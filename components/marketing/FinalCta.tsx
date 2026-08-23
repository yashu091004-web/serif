import Link from "next/link";
import { Reveal } from "@/components/reveal";

export function FinalCta() {
  return (
    <section
      aria-label="Get started"
      className="bg-paper px-6 pt-28 pb-28 text-center text-ink sm:pt-36 sm:pb-36"
    >
      <Reveal>
        <h2 className="font-display mx-auto max-w-4xl text-5xl leading-[0.98] font-bold tracking-tighter text-balance sm:text-7xl">
          Write something{" "}
          <span className="font-medium text-ink-soft">worth reading.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-ink-soft">
          Your ideas deserve more than a blank document.
        </p>
        <Link
          href="/signup"
          className="font-display mt-10 inline-block rounded-full bg-ink px-9 py-4 text-base font-bold text-paper transition-transform duration-300 hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(10,10,10,0.25)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100 sm:px-12 sm:py-5 sm:text-lg"
        >
          Start Writing
        </Link>
      </Reveal>
    </section>
  );
}
