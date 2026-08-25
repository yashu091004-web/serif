"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export interface StoryOverlayApi {
  /** Drive chapter visibility from normalized scroll progress (0..1). */
  update(progress: number): void;
}

interface Chapter {
  headline: string;
  support: string;
  cta?: boolean;
}

const CHAPTERS: Chapter[] = [
  {
    headline: "Every story starts somewhere.",
    support: "An idea is only the beginning.",
  },
  {
    headline: "Turn ideas into stories.",
    support: "Shape thoughts into something worth reading.",
  },
  {
    headline: "Shape your voice.",
    support: "Write, refine and build your perspective.",
  },
  {
    headline: "Make your work discoverable.",
    support: "Create content designed to reach the right readers.",
  },
  {
    headline: "Publish something worth reading.",
    support: "Serif gives your ideas a place to live.",
    cta: true,
  },
];

/* Fade zones are sequential: a chapter finishes fading out exactly where the
   next begins fading in, so two chapters are never readable at once. */
const FADE = 0.04;

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Chapter typography layered over the cinematic canvas.
 * CinematicStory calls `update(progress)` every animation frame; all writes
 * go straight to the DOM — no React state in the scroll path.
 */
export function StoryOverlay({
  apiRef,
}: {
  apiRef: React.RefObject<StoryOverlayApi | null>;
}) {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lastOpacity = useRef<number[]>(CHAPTERS.map(() => -1));

  useEffect(() => {
    const api: StoryOverlayApi = {
      update(progress: number) {
        for (let i = 0; i < CHAPTERS.length; i++) {
          const el = itemRefs.current[i];
          if (!el) continue;
          const start = i / CHAPTERS.length;
          const end = (i + 1) / CHAPTERS.length;
          const isLast = i === CHAPTERS.length - 1;

          const enterT =
            i === 0 ? 1 : smoothstep(start, start + FADE, progress);
          const exitT = isLast ? 0 : smoothstep(end - FADE, end, progress);

          const opacity = enterT * (1 - exitT);
          if (
            Math.abs(opacity - lastOpacity.current[i]) < 0.002 &&
            opacity !== 0 &&
            opacity !== 1
          ) {
            continue;
          }
          lastOpacity.current[i] = opacity;

          const yIn = (1 - easeOutCubic(enterT)) * 24;
          const yOut = exitT * -20;
          el.style.opacity = opacity.toFixed(3);
          el.style.transform = `translateY(${(yIn + yOut).toFixed(2)}px)`;
          el.style.visibility = opacity <= 0.001 ? "hidden" : "visible";
        }
      },
    };
    apiRef.current = api;
    return () => {
      apiRef.current = null;
    };
  }, [apiRef]);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-end justify-center">
      {/* Readability scrims — bottom band only, the scene stays visible */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-black/75 via-black/30 to-transparent sm:h-[55%]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_45%_at_50%_72%,rgba(0,0,0,0.42),transparent_70%)]"
      />

      <div className="relative grid w-full max-w-3xl px-6 pb-[15svh] text-center sm:px-8 sm:pb-[13svh]">
        {CHAPTERS.map((chapter, i) => (
          <div
            key={chapter.headline}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            style={{ opacity: 0, transform: "translateY(24px)", visibility: "hidden" }}
            className="col-start-1 row-start-1 will-change-transform"
          >
            <h2 className="cinematic-text font-display mt-4 text-3xl leading-[1.12] font-bold tracking-tighter text-balance sm:text-6xl sm:leading-[1.04]">
              {chapter.headline}
            </h2>
            <p className="cinematic-text mx-auto mt-3 max-w-md text-sm leading-relaxed text-paper/75 sm:mt-4 sm:text-base">
              {chapter.support}
            </p>
            {chapter.cta && (
              <Link
                href="/signup"
                className="pointer-events-auto cinematic-text mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(251,250,247,0.25)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:mt-8"
              >
                Start Writing
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
