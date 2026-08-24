"use client";

import { useEffect, useRef } from "react";

export const FRAME_COUNT = 300;

export function framePath(frame: number): string {
  return `/scene_frames_30fps/frame_${String(frame).padStart(6, "0")}.jpg`;
}

export interface CinematicCanvasApi {
  /** Draw the frame at a fractional position in the 1..300 sequence. */
  draw(frame: number): void;
  /** Re-measure the canvas and repaint the current frame. */
  resize(): void;
}

const SPREAD_STEP = 12;
const PREFETCH_BACK = 8;
const PREFETCH_AHEAD_DESKTOP = 24;
const PREFETCH_AHEAD_MOBILE = 12;
const WINDOW_ANCHOR_STEP = 10;

/* Mobile data budget: small screens load every Nth frame (~half the bytes)
   and scrubbing snaps to the nearest loaded frame. */
const MOBILE_FRAME_STRIDE = 2;
const MOBILE_DPR_CAP = 1.5;

/* Motion-blur shaping: engages above ~40 fps-equivalent scrub velocity. */
const BLUR_ENGAGE = 40;
const BLUR_RELEASE = 20;
const BLUR_MAX_PX = 2.5;

/**
 * Full-bleed canvas that renders the 300-frame sequence.
 *
 * The parent (CinematicStory) owns scroll progress + interpolation and calls
 * `draw(frame)` every rAF with a fractional frame number. This component owns
 * image loading, caching, cover-fit painting and sub-frame cross-blending so
 * the sequence reads as continuous motion instead of discrete pictures.
 */
export function CinematicCanvas({
  apiRef,
}: {
  apiRef: React.RefObject<CinematicCanvasApi | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    return setupCinematicCanvas(canvas, context, apiRef);
  }, [apiRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 block h-full w-full"
    />
  );
}

function setupCinematicCanvas(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  apiRef: React.RefObject<CinematicCanvasApi | null>
): () => void {
  const isSmallScreen = window.innerWidth < 768;
  const prefetchAhead = isSmallScreen
    ? PREFETCH_AHEAD_MOBILE
    : PREFETCH_AHEAD_DESKTOP;
  const concurrencyLimit = isSmallScreen ? 4 : 6;

  const frameStride = isSmallScreen ? MOBILE_FRAME_STRIDE : 1;
  /* Highest frame index that exists on the stride grid (300 on desktop, 299 on mobile). */
  const topLoaded = FRAME_COUNT - ((FRAME_COUNT - 1) % frameStride);

  function snapToStride(frame: number) {
    return Math.min(
      Math.max(Math.round((frame - 1) / frameStride) * frameStride + 1, 1),
      topLoaded
    );
  }

  /* ---- Frame cache & priority loader --------------------------------- */

  const ready = new Map<number, HTMLImageElement>();
  const pending = new Set<number>();
  const queue: number[] = [];
  let inflight = 0;
  let intrinsicW = 16;
  let intrinsicH = 9;

  function pump() {
    while (inflight < concurrencyLimit && queue.length > 0) {
      const n = queue.shift();
      if (n === undefined || ready.has(n) || pending.has(n)) continue;
      pending.add(n);
      inflight++;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        ready.set(n, img);
        pending.delete(n);
        inflight--;
        intrinsicW = img.naturalWidth || intrinsicW;
        intrinsicH = img.naturalHeight || intrinsicH;
        // Warm the decoded-image cache so the first draw never stalls.
        img.decode?.().catch(() => {});
        pump();
      };
      img.onerror = () => {
        pending.delete(n);
        inflight--;
        pump();
      };
      img.src = framePath(n);
    }
  }

  function request(frames: number[], highPriority: boolean) {
    for (const n of frames) {
      if (n < 1 || n > FRAME_COUNT || ready.has(n) || pending.has(n)) continue;
      if (highPriority) queue.unshift(n);
      else queue.push(n);
    }
    pump();
  }

  /* Opening order: first frame immediately, then an even spread across the
     whole timeline so early scrubbing always has neighbours. The remainder
     fills sequentially as background work. */
  request([1], true);
  const spreadStep = SPREAD_STEP * frameStride;
  const spread: number[] = [];
  for (let n = spreadStep; n < FRAME_COUNT; n += spreadStep) spread.push(n);
  spread.push(topLoaded);
  request(spread, true);
  const rest: number[] = [];
  for (let n = 1 + frameStride; n < FRAME_COUNT; n += frameStride) rest.push(n);
  request(rest, false);

  /* ---- Cover-fit painting with sub-frame blend ------------------------ */

  let cssW = 1;
  let cssH = 1;
  /* Device-pixel ratio of the current backing buffer; drawing must happen in
     CSS pixels under a matching transform or frames land in only part of the
     buffer (duplicated-looking band on the right at dpr != 1). */
  let dpr = 1;
  let lastPaintedKey = "";
  let requestedFrame = 1;

  function applySize() {
    const rect = canvas.getBoundingClientRect();
    dpr = Math.min(
      window.devicePixelRatio || 1,
      isSmallScreen ? MOBILE_DPR_CAP : 2
    );
    cssW = Math.max(1, Math.round(rect.width));
    cssH = Math.max(1, Math.round(rect.height));
    const pxW = Math.round(cssW * dpr);
    const pxH = Math.round(cssH * dpr);
    if (canvas.width !== pxW || canvas.height !== pxH) {
      canvas.width = pxW;
      canvas.height = pxH;
    }
  }

  function paint(frame: number) {
    const clamped = Math.min(Math.max(frame, 1), FRAME_COUNT);
    const i0 = Math.min(Math.floor(clamped), FRAME_COUNT - 1);
    const frac = Math.min(1, clamped - i0);
    const imgA = ready.get(i0);
    if (!imgA) return; // hold last painted frame until the exact one decodes

    const scale = Math.max(cssW / intrinsicW, cssH / intrinsicH);
    const dw = intrinsicW * scale;
    const dh = intrinsicH * scale;
    const dx = (cssW - dw) / 2;
    const dy = (cssH - dh) / 2;

    /* Known-state transform every paint (setTransform is absolute, so it
       cannot accumulate across resizes) + full clear so no stale pixels
       survive outside the cover rect. */
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssW, cssH);

    ctx.drawImage(imgA, dx, dy, dw, dh);

    if (frac > 0.004) {
      const imgB = ready.get(i0 + 1);
      if (imgB) {
        ctx.globalAlpha = frac;
        ctx.drawImage(imgB, dx, dy, dw, dh);
        ctx.globalAlpha = 1;
      }
    }
    lastPaintedKey = `${clamped.toFixed(3)}@${cssW}x${cssH}`;
  }

  /* ---- Velocity-adaptive micro motion blur ---------------------------- */

  let prevTime = 0;
  let prevFrame = 1;
  let smoothedVelocity = 0;
  let appliedBlur = -1;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function updateBlur(now: number, frame: number) {
    if (reducedMotion.matches || prevTime === 0) {
      prevTime = now;
      prevFrame = frame;
      return;
    }
    const dt = Math.max((now - prevTime) / 1000, 1 / 240);
    const instant = (frame - prevFrame) / dt;
    prevTime = now;
    prevFrame = frame;
    smoothedVelocity += (instant - smoothedVelocity) * 0.18;

    let target = 0;
    const speed = Math.abs(smoothedVelocity);
    if (speed > BLUR_ENGAGE) {
      target = Math.min(BLUR_MAX_PX, (speed - BLUR_ENGAGE) / 48);
    } else if (speed > BLUR_RELEASE && appliedBlur > 0) {
      target = Math.min(appliedBlur, BLUR_MAX_PX * 0.4);
    }
    const quantized = Math.round(target * 10) / 10;
    if (quantized !== appliedBlur) {
      appliedBlur = quantized;
      canvas.style.filter =
        quantized > 0 ? `blur(${quantized.toFixed(1)}px)` : "";
    }
  }

  /* ---- Direction-aware prefetch ---------------------------------------- */

  let windowAnchor = -1;
  function prefetchAround(frame: number) {
    const center = Math.round(frame);
    const anchor = Math.floor(center / WINDOW_ANCHOR_STEP);
    if (anchor === windowAnchor) return;
    windowAnchor = anchor;
    const from = Math.max(1, center - PREFETCH_BACK);
    const to = Math.min(FRAME_COUNT, center + prefetchAhead);
    const window: number[] = [];
    for (let n = snapToStride(from); n <= to; n += frameStride) window.push(n);
    request(window, true);
  }

  /* ---- Public api ------------------------------------------------------- */

  apiRef.current = {
    draw(frame: number) {
      requestedFrame = snapToStride(frame);
      prefetchAround(requestedFrame);
      updateBlur(performance.now(), requestedFrame);
      const key = `${requestedFrame.toFixed(3)}@${cssW}x${cssH}`;
      if (key === lastPaintedKey) return;
      paint(requestedFrame);
    },
    resize() {
      applySize();
      lastPaintedKey = "";
      paint(requestedFrame);
    },
  };

  applySize();
  paint(1);

  const observer = new ResizeObserver(() => {
    applySize();
    lastPaintedKey = "";
  });
  observer.observe(canvas);

  return () => {
    observer.disconnect();
    queue.length = 0;
    apiRef.current = null;
  };
}
