"use client";

import { useEffect, useRef } from "react";

export interface StoryProgressApi {
  /** Drive rail, counters and scroll-hint fade from the engine loop. */
  update(progress: number, frame: number): void;
}

const HINT_HIDE_END = 0.04;
const CHAPTER_TOTAL = 5;

function smoothstep(a: number, b: number, x: number) {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
}

/**
 * Minimal instrumentation pinned to the bottom of the cinematic stage:
 * a fading SCROLL hint, a hairline progress rail and chapter/frame counters.
 * Updated imperatively from CinematicStory's rAF loop.
 */
export function StoryProgress({
  apiRef,
}: {
  apiRef: React.RefObject<StoryProgressApi | null>;
}) {
  const hintRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const chapterRef = useRef<HTMLSpanElement>(null);
  const frameRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let lastChapter = "";
    let lastFrame = "";
    let lastHintOpacity = -1;

    const api: StoryProgressApi = {
      update(progress: number, frame: number) {
        if (fillRef.current) {
          fillRef.current.style.transform = `scaleX(${progress.toFixed(5)})`;
        }

        const chapterIndex = Math.min(
          CHAPTER_TOTAL - 1,
          Math.floor(progress * CHAPTER_TOTAL)
        );
        const chapterLabel = String(chapterIndex + 1).padStart(2, "0");
        if (chapterLabel !== lastChapter && chapterRef.current) {
          chapterRef.current.textContent = chapterLabel;
          lastChapter = chapterLabel;
        }

        const frameLabel = String(Math.round(frame)).padStart(3, "0");
        if (frameLabel !== lastFrame && frameRef.current) {
          frameRef.current.textContent = frameLabel;
          lastFrame = frameLabel;
        }

        const hintOpacity = 1 - smoothstep(0.008, HINT_HIDE_END, progress);
        if (
          hintRef.current &&
          Math.abs(hintOpacity - lastHintOpacity) > 0.01
        ) {
          lastHintOpacity = hintOpacity;
          hintRef.current.style.opacity = hintOpacity.toFixed(2);
          hintRef.current.style.visibility =
            hintOpacity <= 0.01 ? "hidden" : "visible";
        }
      },
    };
    apiRef.current = api;
    return () => {
      apiRef.current = null;
    };
  }, [apiRef]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-5 px-6 pb-6"
    >
      <div
        ref={hintRef}
        aria-hidden
        className="flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[10px] tracking-[0.3em] text-paper/60 uppercase">
          Scroll
        </span>
        <span className="animate-scrollhint block h-8 w-px bg-gradient-to-b from-gold to-transparent" />
        <span className="text-[10px] text-paper/60">↓</span>
      </div>

      <div className="flex w-full max-w-md items-center gap-4">
        <span className="font-mono text-[10px] tracking-[0.18em] whitespace-nowrap text-paper/50">
          CH{" "}
          <span ref={chapterRef} className="text-gold">
            01
          </span>{" "}
          / {String(CHAPTER_TOTAL).padStart(2, "0")}
        </span>
        <div className="h-px flex-1 overflow-hidden bg-white/15">
          <div
            ref={fillRef}
            className="h-full w-full origin-left bg-gold"
            style={{ transform: "scaleX(0)" }}
          />
        </div>
        <span className="font-mono text-[10px] tracking-[0.18em] whitespace-nowrap text-paper/50">
          FRM{" "}
          <span ref={frameRef} className="text-paper/80">
            001
          </span>{" "}
          / 300
        </span>
      </div>
    </div>
  );
}
