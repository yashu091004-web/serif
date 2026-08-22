"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";

export interface ArchivePost {
  slug: string | null;
  title: string;
  author: string;
  dateLabel: string;
  readLabel: string;
  gradient: string;
}

const MAX_POSTS = 6;

interface Copy {
  tag: string;
  title: string;
  sub: string;
}

const INTRO_COPY: Copy = {
  tag: "Chapter 01",
  title: "Scroll to open the book.",
  sub: "Your posts are bound inside.",
};

function subscribeReducedMotion(callback: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

export function BookArchive({ posts }: { posts: ArchivePost[] }) {
  const items = useMemo(() => posts.slice(0, MAX_POSTS), [posts]);

  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );

  const [copy, setCopy] = useState<Copy>(INTRO_COPY);
  const [copyVisible, setCopyVisible] = useState(true);

  const sceneRef = useRef<HTMLElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const bookRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);

  const desktopRef = useRef(true);
  const metricsRef = useRef({ top: 0, height: 1 });
  const tickingRef = useRef(false);
  const frontIndexRef = useRef<number | null>(null);
  const swapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || items.length === 0) return;
    if (prefersReducedMotion) return;

    const desktopMq = window.matchMedia("(min-width: 768px)");
    desktopRef.current = desktopMq.matches;

    const N = items.length;
    const angleStep = 360 / N;
    const radius = 340;

    const clamp = (v: number, a: number, b: number) =>
      Math.max(a, Math.min(b, v));
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const measure = () => {
      const rect = scene.getBoundingClientRect();
      metricsRef.current = {
        top: window.scrollY + rect.top,
        height: scene.offsetHeight,
      };
    };

    const setCopyFor = (index: number | null) => {
      if (swapTimerRef.current) clearTimeout(swapTimerRef.current);
      const next: Copy =
        index === null
          ? INTRO_COPY
          : {
              tag: `Chapter ${String(index + 1).padStart(2, "0")}`,
              title: items[index].title,
              sub: `${items[index].author} · ${items[index].dateLabel} · ${items[index].readLabel}`,
            };
      setCopyVisible(false);
      swapTimerRef.current = setTimeout(() => {
        setCopy(next);
        setCopyVisible(true);
      }, 120);
    };

    const update = () => {
      tickingRef.current = false;
      const { top, height } = metricsRef.current;
      const raw =
        (window.scrollY - top) / Math.max(height - window.innerHeight, 1);
      const progress = clamp(raw, 0, 1);

      if (fillRef.current) {
        fillRef.current.style.width = `${(progress * 100).toFixed(1)}%`;
      }

      const openT = clamp(progress / 0.22, 0, 1);
      if (coverRef.current) {
        coverRef.current.style.transform = `rotateY(${lerp(0, -165, openT)}deg)`;
      }

      const popT = clamp((progress - 0.16) / 0.2, 0, 1);
      if (bookRef.current) {
        bookRef.current.style.opacity = String(lerp(1, 0.2, popT));
        bookRef.current.style.transform = `translateZ(${lerp(
          0,
          -120,
          popT
        )}px) scale(${lerp(1, 0.85, popT)})`;
      }

      let frontIndex: number | null = null;

      if (desktopRef.current && ringRef.current) {
        const currentRadius = lerp(0, radius, popT);
        ringRef.current.classList.toggle("opacity-0", popT <= 0.02);
        ringRef.current.style.pointerEvents = popT > 0.02 ? "auto" : "none";

        const spinT = clamp((progress - 0.3) / 0.7, 0, 1);
        const ringRotation = spinT * 360 * 2.4;

        const cards =
          ringRef.current.querySelectorAll<HTMLElement>("[data-archive-card]");
        cards.forEach((el, i) => {
          const angle = i * angleStep - ringRotation;
          el.style.transform = `rotateY(${angle}deg) translateZ(${currentRadius}px)`;
        });

        if (popT > 0.05) {
          let bestI = 0;
          let bestDiff = 999;
          for (let i = 0; i < N; i++) {
            let a = (i * angleStep - ringRotation) % 360;
            a = ((a + 180) % 360) - 180;
            const diff = Math.abs(a);
            if (diff < bestDiff) {
              bestDiff = diff;
              bestI = i;
            }
          }
          frontIndex = bestI;
        }
      } else if (listRef.current) {
        listRef.current.style.opacity = popT > 0.02 ? "1" : "0";
        listRef.current.style.pointerEvents = popT > 0.02 ? "auto" : "none";

        let mobileFront: number | null = null;
        if (popT > 0.05) {
          const spinT = clamp((progress - 0.3) / 0.7, 0, 1);
          mobileFront = clamp(Math.floor(spinT * N), 0, N - 1);
        }

        const cards =
          listRef.current.querySelectorAll<HTMLElement>("[data-archive-card]");
        cards.forEach((el, i) => {
          const reveal = clamp((popT * 1.6 - i * 0.12) / 0.55, 0, 1);
          el.style.opacity = String(reveal);
          el.style.transform = `translateY(${(1 - reveal) * 28}px)`;
          el.style.borderColor =
            i === mobileFront ? "var(--gold)" : "transparent";
        });

        frontIndex = mobileFront;
      }

      if (popT <= 0.05) {
        if (frontIndexRef.current !== null) {
          frontIndexRef.current = null;
          setCopyFor(null);
        }
      } else if (frontIndex !== null && frontIndex !== frontIndexRef.current) {
        frontIndexRef.current = frontIndex;
        setCopyFor(frontIndex);
      }
    };

    const requestUpdate = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(update);
      }
    };

    const onResize = () => {
      desktopRef.current = desktopMq.matches;
      measure();
      requestUpdate();
    };

    const onMqChange = () => onResize();

    measure();
    update();

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", onResize);
    desktopMq.addEventListener("change", onMqChange);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", onResize);
      desktopMq.removeEventListener("change", onMqChange);
      if (swapTimerRef.current) clearTimeout(swapTimerRef.current);
    };
  }, [items, prefersReducedMotion]);

  if (items.length === 0) return null;

  const renderCardBody = (post: ArchivePost) => (
    <>
      <div className="relative h-[54%]" style={{ background: post.gradient }} />
      <div className="flex flex-1 flex-col p-4 text-ink">
        <span className="font-mono text-[8.5px] tracking-widest text-gold-deep uppercase">
          Post
        </span>
        <h3 className="font-display mt-1 text-sm leading-tight font-bold tracking-tight sm:text-[14.5px]">
          {post.title}
        </h3>
        <div className="mt-auto flex items-center gap-2 pt-2 text-[9.5px] text-ink-soft">
          <span
            className="flex size-4 shrink-0 items-center justify-center rounded-full font-mono text-[8px] text-white"
            style={{ background: post.gradient }}
          >
            {post.author.charAt(0)}
          </span>
          <span className="truncate">
            {post.author} · {post.dateLabel} · {post.readLabel}
          </span>
        </div>
      </div>
    </>
  );

  const cardBaseClass =
    "overflow-hidden rounded-xl bg-paper-card shadow-[0_30px_70px_rgba(0,0,0,0.6)] will-change-transform";

  return (
    <section
      ref={sceneRef}
      aria-label="Post archive"
      className={`relative z-[1] bg-ink text-paper ${
        prefersReducedMotion ? "py-20 sm:py-28" : "h-[420vh]"
      }`}
    >
      {prefersReducedMotion ? (
        <div className="mx-auto flex max-w-5xl flex-col px-6">
          <SceneKicker />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((post, i) =>
              post.slug ? (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className={`${cardBaseClass} flex h-[260px] w-full flex-col`}
                >
                  {renderCardBody(post)}
                </Link>
              ) : (
                <div
                  key={`${post.title}-${i}`}
                  className={`${cardBaseClass} flex h-[260px] w-full flex-col`}
                >
                  {renderCardBody(post)}
                </div>
              )
            )}
          </div>
        </div>
      ) : (
        <div className="sticky top-0 flex h-svh flex-col items-center justify-center overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--color-gold)_0%,transparent_65%)] opacity-[0.07]"
          />
          <SceneKicker />

          <div className="relative flex h-[52vh] w-full items-center justify-center [perspective:1900px]">
            <div
              ref={bookRef}
              className="relative h-[280px] w-[210px] [transform-style:preserve-3d] max-sm:h-[226px] max-sm:w-[170px]"
            >
              <div className="absolute inset-0 rounded-r-lg bg-gradient-to-b from-[#1c1c1c] to-black shadow-[0_40px_90px_rgba(0,0,0,0.6)] [backface-visibility:hidden] [transform:translateZ(-6px)]" />
              <div className="absolute top-0 bottom-0 left-[-4px] w-[10px] bg-gradient-to-r from-black/60 to-[#050505] [backface-visibility:hidden] [transform:rotateY(90deg)_translateZ(4px)] [transform-origin:left_center]" />
              <div
                ref={coverRef}
                className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 rounded-r-lg border border-gold/25 bg-gradient-to-br from-[#161616] to-black will-change-transform"
                style={{ transformOrigin: "left center" }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-[9px] rounded-sm border border-gold/20"
                />
                <span className="font-display text-4xl font-extrabold tracking-tight text-gold">
                  S
                </span>
                <span className="font-mono text-[9px] tracking-[0.2em] text-paper/40 uppercase">
                  Collected Stories
                </span>
              </div>
            </div>

            <div
              ref={ringRef}
              className="absolute hidden h-[280px] w-[210px] opacity-0 md:block [transform-style:preserve-3d]"
            >
              {items.map((post, i) =>
                post.slug ? (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    data-archive-card
                    className={`${cardBaseClass} absolute inset-0 border-2 border-transparent [backface-visibility:hidden]`}
                  >
                    {renderCardBody(post)}
                  </Link>
                ) : (
                  <div
                    key={`${post.title}-${i}`}
                    data-archive-card
                    className={`${cardBaseClass} absolute inset-0 border-2 border-transparent [backface-visibility:hidden]`}
                  >
                    {renderCardBody(post)}
                  </div>
                )
              )}
            </div>

            <div
              ref={listRef}
              className="absolute flex w-[min(340px,86vw)] flex-col gap-3 opacity-0 md:hidden"
            >
              {items.map((post, i) =>
                post.slug ? (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    data-archive-card
                    className={`${cardBaseClass} h-[92px] shrink-0 border-2 border-transparent`}
                  >
                    {renderCardBody(post)}
                  </Link>
                ) : (
                  <div
                    key={`${post.title}-${i}`}
                    data-archive-card
                    className={`${cardBaseClass} h-[92px] shrink-0 border-2 border-transparent`}
                  >
                    {renderCardBody(post)}
                  </div>
                )
              )}
            </div>
          </div>

          <div className="z-[3] mt-5 px-6 pb-2 text-center">
            <p className="font-mono text-[10.5px] tracking-[0.15em] text-gold uppercase">
              {copy.tag}
            </p>
            <h3
              className="font-display mt-2 text-xl font-bold tracking-tight transition-opacity duration-200 sm:text-2xl"
              style={{ opacity: copyVisible ? 1 : 0 }}
            >
              {copy.title}
            </h3>
            <p
              className="mt-1.5 text-xs text-paper/45 transition-opacity duration-200"
              style={{ opacity: copyVisible ? 1 : 0 }}
            >
              {copy.sub}
            </p>
          </div>

          <div className="absolute bottom-9 left-1/2 h-0.5 w-[180px] -translate-x-1/2 overflow-hidden rounded-full bg-white/10">
            <div ref={fillRef} className="h-full w-0 bg-gold" />
          </div>
        </div>
      )}
    </section>
  );
}

function SceneKicker() {
  return (
    <div className="text-center">
      <p className="font-mono text-[11px] tracking-[0.2em] text-paper/40 uppercase">
        The archive
      </p>
      <h2 className="font-display mt-2.5 text-2xl font-bold tracking-tight sm:text-4xl">
        Every post, bound together.
      </h2>
    </div>
  );
}
