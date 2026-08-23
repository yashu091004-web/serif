import { Reveal } from "@/components/reveal";

const STEPS = [
  {
    label: "Idea",
    headline: "Capture the spark.",
    copy: "Every published piece starts as one honest thought. Serif keeps it safe until you're ready.",
  },
  {
    label: "Write",
    headline: "Draft in flow.",
    copy: "Write manually or let AI lay down a first pass — the editor stays out of your way either way.",
  },
  {
    label: "Refine",
    headline: "Cut what doesn't serve the reader.",
    copy: "Tighten structure, sharpen pacing, keep the voice that made it yours.",
  },
  {
    label: "Publish",
    headline: "Live in one click.",
    copy: "A clean, readable page with your name on it — no templates to fight.",
  },
  {
    label: "Reach readers",
    headline: "Written to be found.",
    copy: "SEO-aware publishing puts your work in front of the people searching for it.",
  },
];

/**
 * Editorial product narrative: IDEA → WRITE → REFINE → PUBLISH → REACH READERS.
 * A single ruled timeline with staggered scroll reveals.
 */
export function ProductStory() {
  return (
    <section
      aria-label="How Serif works"
      className="bg-ink px-6 py-28 text-paper sm:py-32"
    >
      <div className="mx-auto max-w-3xl">
        <Reveal className="text-center">
          <p className="font-mono text-[11px] tracking-[0.22em] text-gold uppercase">
            The workflow
          </p>
          <h2 className="font-display mt-4 text-4xl font-bold tracking-tighter text-balance sm:text-5xl">
            From idea to readers.
          </h2>
        </Reveal>

        <ol className="relative mt-16 ml-2 space-y-14 border-l border-white/12 pl-8 sm:ml-6 sm:pl-12">
          {STEPS.map((step, i) => (
            <li key={step.label} className="relative">
              <span
                aria-hidden
                className="absolute top-[7px] -left-[37px] size-2 rotate-45 bg-gold sm:-left-[53px]"
              />
              <Reveal delay={i * 80}>
                <p className="font-mono text-[10px] tracking-[0.26em] text-gold uppercase">
                  {String(i + 1).padStart(2, "0")} · {step.label}
                </p>
                <h3 className="font-display mt-2.5 text-2xl font-bold tracking-tight sm:text-3xl">
                  {step.headline}
                </h3>
                <p className="mt-2.5 max-w-md text-sm leading-relaxed text-paper/60">
                  {step.copy}
                </p>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
