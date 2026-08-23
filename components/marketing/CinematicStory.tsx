"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  CinematicCanvas,
  FRAME_COUNT,
  framePath,
  type CinematicCanvasApi,
} from "./CinematicCanvas";
import { StoryOverlay, type StoryOverlayApi } from "./StoryOverlay";
import { StoryProgress, type StoryProgressApi } from "./StoryProgress";

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

/* Damping constant for the eased approach toward the target frame. */
const DAMPING = 7;

/**
 * The scroll-driven cinematic story.
 *
 * A 500vh scroll track keeps a full-viewport stage pinned via position:
 * sticky. One requestAnimationFrame loop converts scroll position into
 * normalized progress, maps it to a target frame, eases the displayed frame
 * toward that target and pushes updates to the canvas, chapter typography and
 * progress instrumentation through imperative refs — React state never sits in
 * the scroll path. Nothing autoplays: zero scroll means zero visual change.
 */
export function CinematicStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasApi = useRef<CinematicCanvasApi | null>(null);
  const overlayApi = useRef<StoryOverlayApi | null>(null);
  const progressApi = useRef<StoryProgressApi | null>(null);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  useEffect(() => {
    if (prefersReducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    let rafId = 0;
    let running = true;
    let currentFrame = 1;
    let lastTick = performance.now();

    const computeProgress = () => {
      const rect = section.getBoundingClientRect();
      const total = Math.max(rect.height - window.innerHeight, 1);
      return Math.min(Math.max(-rect.top / total, 0), 1);
    };

    const tick = (now: number) => {
      rafId = requestAnimationFrame(tick);
      const dt = Math.min((now - lastTick) / 1000, 0.05);
      lastTick = now;
      if (!running) return;

      const progress = computeProgress();
      const targetFrame = Math.min(
        FRAME_COUNT,
        Math.max(1, Math.ceil(progress * FRAME_COUNT))
      );
      currentFrame +=
        (targetFrame - currentFrame) * (1 - Math.exp(-dt * DAMPING));
      if (Math.abs(targetFrame - currentFrame) < 0.002) {
        currentFrame = targetFrame;
      }

      canvasApi.current?.draw(currentFrame);
      overlayApi.current?.update(progress);
      progressApi.current?.update(progress, currentFrame);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        lastTick = performance.now();
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(section);

    const initialProgress = computeProgress();
    overlayApi.current?.update(initialProgress);
    progressApi.current?.update(initialProgress, 1);

    const onResize = () => canvasApi.current?.resize();
    window.addEventListener("resize", onResize);

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <section aria-label="The Serif story" className="bg-ink text-paper">
        <h1 className="sr-only">Serif — Where writers get read.</h1>

        <div className="relative flex h-svh items-end justify-center overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={framePath(1)}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black/80 via-black/30 to-transparent"
          />
          <div className="relative px-6 pb-16 text-center sm:pb-20">
            <p className="font-mono text-[11px] tracking-[0.24em] text-gold uppercase">
              Chapter 01
            </p>
            <h2 className="font-display mt-4 text-4xl leading-[1.04] font-bold tracking-tighter text-balance sm:text-6xl">
              Every story starts somewhere.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-paper/75 sm:text-base">
              An idea is only the beginning.
            </p>
            <Link
              href="/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-paper px-8 py-3.5 text-sm font-semibold text-ink"
            >
              Start Writing
            </Link>
          </div>
        </div>

        <div className="mx-auto max-w-xl space-y-12 px-6 py-24">
          {CHAPTER_SUMMARIES.map((chapter) => (
            <div key={chapter.eyebrow}>
              <p className="font-mono text-[11px] tracking-[0.24em] text-gold uppercase">
                {chapter.eyebrow}
              </p>
              <h2 className="font-display mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
                {chapter.headline}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-paper/65">
                {chapter.support}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      aria-label="The Serif story"
      className="relative h-[500vh] bg-ink"
    >
      <h1 className="sr-only">Serif — Where writers get read.</h1>

      <div className="sticky top-0 h-svh overflow-hidden">
        <CinematicCanvas apiRef={canvasApi} />

        {/* Faint top scrim so the floating navbar stays legible on bright frames */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-[5] h-28 bg-gradient-to-b from-black/40 to-transparent"
        />

        <StoryOverlay apiRef={overlayApi} />
        <StoryProgress apiRef={progressApi} />
      </div>
    </section>
  );
}

const CHAPTER_SUMMARIES = [
  {
    eyebrow: "Chapter 02",
    headline: "Turn ideas into stories.",
    support: "Shape thoughts into something worth reading.",
  },
  {
    eyebrow: "Chapter 03",
    headline: "Shape your voice.",
    support: "Write, refine and build your perspective.",
  },
  {
    eyebrow: "Chapter 04",
    headline: "Make your work discoverable.",
    support: "Create content designed to reach the right readers.",
  },
  {
    eyebrow: "Chapter 05",
    headline: "Publish something worth reading.",
    support: "Serif gives your ideas a place to live.",
  },
];
