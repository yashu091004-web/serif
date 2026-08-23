import { Reveal } from "@/components/reveal";

const FEATURES = [
  {
    title: "AI Writing",
    copy: "Give it a topic and a tone. Get a full draft back, ready to edit.",
  },
  {
    title: "Content Optimization",
    copy: "Tighten pacing and structure without losing your voice.",
  },
  {
    title: "Easy Publishing",
    copy: "One click from draft to a live, readable post.",
  },
  {
    title: "Content Management",
    copy: "Every draft and published post, sorted and searchable.",
  },
];

/**
 * Editorial feature index — numbered rows instead of SaaS cards.
 * Server-renderable; entries reveal via the shared IntersectionObserver.
 */
export function FeatureEditorial() {
  return (
    <section
      id="features"
      aria-label="Features"
      className="scroll-mt-24 bg-paper px-6 pt-28 pb-28 text-ink sm:pt-32 sm:pb-32"
    >
      <div className="mx-auto max-w-5xl">
        <Reveal className="max-w-xl">
          <p className="font-mono text-[11px] tracking-[0.22em] text-gold-deep uppercase">
            What&rsquo;s inside
          </p>
          <h2 className="font-display mt-4 text-4xl font-bold tracking-tighter text-balance sm:text-5xl">
            Four tools. One quiet workspace.
          </h2>
        </Reveal>

        <ol className="mt-16 border-t border-ink/10">
          {FEATURES.map((feature, i) => (
            <li key={feature.title}>
              <Reveal delay={i * 70}>
                <div className="group grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-3 border-b border-ink/10 py-9 transition-colors duration-300 sm:grid-cols-[90px_1fr_1fr] sm:items-center sm:gap-x-10">
                  <span className="font-display text-4xl leading-none font-bold tracking-tighter text-ink/15 transition-colors duration-300 group-hover:text-gold-deep sm:text-5xl">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl font-bold tracking-tight sm:text-2xl">
                    {feature.title}
                  </h3>
                  <p className="col-span-2 max-w-md text-sm leading-relaxed text-ink-soft sm:col-span-1">
                    {feature.copy}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
