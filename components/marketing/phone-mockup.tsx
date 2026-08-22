"use client";

import { useEffect, useRef } from "react";

export interface PhonePost {
  title: string;
  meta: string;
  gradient: string;
}

export function PhoneMockup({ posts }: { posts: PhonePost[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const phone = phoneRef.current;
    if (!stage || !phone) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const onMove = (e: MouseEvent) => {
      const r = stage.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      phone.style.transform = `rotateY(${-16 + px * 22}deg) rotateX(${
        6 - py * 18
      }deg)`;
    };
    const onLeave = () => {
      phone.style.transform = "";
    };

    stage.addEventListener("mousemove", onMove);
    stage.addEventListener("mouseleave", onLeave);
    return () => {
      stage.removeEventListener("mousemove", onMove);
      stage.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      className="flex justify-center [perspective:1400px]"
      aria-hidden="true"
    >
      <div
        ref={phoneRef}
        className="animate-floaty relative h-[560px] w-[270px] rounded-[38px] border-2 border-white/10 bg-gradient-to-b from-[#1c1c1c] to-[#0a0a0a] p-2.5 shadow-[0_60px_100px_rgba(0,0,0,0.6)] transition-transform duration-150 ease-out motion-reduce:animate-none motion-reduce:transition-none max-sm:h-[460px] max-sm:w-[220px]"
      >
        <div className="absolute top-5 left-1/2 z-10 h-4 w-[70px] -translate-x-1/2 rounded-full bg-black" />
        <div className="h-full w-full overflow-hidden rounded-[28px] bg-paper p-4 pt-11 text-ink">
          <p className="font-display mb-3.5 text-lg font-bold">Serif</p>
          {posts.map((post) => (
            <div
              key={post.title}
              className="mb-2.5 rounded-xl bg-paper-card p-3 shadow-[0_4px_14px_rgba(0,0,0,0.06)]"
            >
              <div
                className="mb-2.5 h-16 rounded-lg"
                style={{ background: post.gradient }}
              />
              <p className="font-display text-[12.5px] leading-snug font-semibold">
                {post.title}
              </p>
              <p className="mt-1.5 font-mono text-[9px] text-ink-soft">
                {post.meta}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
