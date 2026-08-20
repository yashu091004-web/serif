import type { BlogPost } from "./types";

export const blogCategories = [
  "AI",
  "Writing",
  "SEO",
  "Strategy",
  "Productivity",
  "Publishing",
];

export const publishedPosts: BlogPost[] = [
  {
    id: "pub-1",
    slug: "the-intelligent-future-of-blogging",
    title: "The Intelligent Future of Blogging",
    subtitle:
      "How AI is reshaping the way writers create, edit, and publish — without replacing their voice.",
    content: `The craft of blogging has always been a balance: speed versus quality, consistency versus inspiration. For most writers, that tension is the hardest part of the job.

AI changes the economics of that balance. It doesn't replace the writer's judgment — it removes the friction between an idea and its first draft.

## From blank page to first draft

The most expensive moment in writing is the blank page. AI collapses that cost. Give it a topic, an angle, and a tone, and you have a structured draft in seconds. What matters is what you do next: shaping, cutting, and sharpening it into something that sounds like *you*.

## Editing becomes the creative act

When generation is cheap, editing becomes the craft. The best writers on AI-powered platforms spend their energy on structure, clarity, and voice — the things a model still can't feel.

## Publishing at the speed of thought

Drafts that used to take an afternoon now take minutes. That means more experiments, faster feedback loops, and a rhythm of publishing that keeps an audience engaged without burning out the author.

The tools will keep evolving. The writers who win will be the ones who treat AI as a partner, not a shortcut — their taste, judgment, and voice leading every step of the way.`,
    category: "AI",
    cover: "from-indigo-500 via-violet-500 to-purple-700",
    seoTitle: "The Intelligent Future of Blogging | Serif",
    seoDescription:
      "How AI is reshaping the way writers create, edit, and publish — without replacing their voice.",
    author: { id: "a1", name: "Maya Chen", initials: "MC", role: "Editor at Serif" },
    status: "published",
    publishedAt: "2026-08-18",
    updatedAt: "2026-08-18",
    readTime: 4,
    views: 4820,
  },
  {
    id: "pub-2",
    slug: "ten-habits-of-prolific-writers",
    title: "Ten Habits of Prolific Writers",
    subtitle:
      "Consistency beats inspiration. Here's how the most prolific writers we know structure their weeks.",
    content: `Everyone wants to write more. Almost nobody wants to build the systems that make writing inevitable. The difference is the difference between a hobby and a practice.

## 1. Write on a schedule

Inspiration is unreliable; a calendar is not. Prolific writers show up at the same time, most days, and let the routine carry them past hesitation.

## 2. Keep an idea bank

A single idea is fragile. A bank of fifty is a safety net. Capture everything — headlines, angles, fragments — and mine it when the well runs dry.

## 3. Draft ugly

The first draft is allowed to be bad. Its only job is to exist. Editing, not drafting, is where the writing happens.

## 4. Publish on a cadence

An audience forms around rhythm. Weekly, biweekly, monthly — pick a cadence you can defend, and defend it.

## 5. Measure what matters

Views are vanity; *returning* readers are the signal. Watch the posts that bring people back, and write more of those.

## 6. Steal structure

Borrow the skeleton of posts you admire. Structure is a skill you can learn by imitation, even before voice.

## 7. Batch your workflow

Write five drafts in one sitting. Edit them in another. Separating modes removes decision fatigue.

## 8. Cut ruthlessly

If a sentence doesn't earn its place, delete it. Shorter posts that respect the reader outperform longer ones that don't.

## 9. Use AI for the grind

Outlines, titles, and SEO — let a tool handle the mechanical work so your energy goes to the thinking.

## 10. Ship and move on

Perfection is a form of procrastination. Ship it, learn from the response, and start the next one.`,
    category: "Productivity",
    cover: "from-emerald-500 via-teal-500 to-cyan-700",
    seoTitle: "Ten Habits of Prolific Writers | Serif",
    seoDescription:
      "Consistency beats inspiration. Here's how the most prolific writers structure their weeks.",
    author: { id: "a2", name: "Daniel Osei", initials: "DO", role: "Contributing writer" },
    status: "published",
    publishedAt: "2026-08-11",
    updatedAt: "2026-08-12",
    readTime: 5,
    views: 3215,
  },
  {
    id: "pub-3",
    slug: "seo-in-the-age-of-ai-search",
    title: "SEO in the Age of AI Search",
    subtitle:
      "Rankings still matter. The rules are just changing — here's what to optimize for now.",
    content: `For a decade, SEO meant keywords, backlinks, and density. Search is changing, and so must the playbook.

## People are asking questions, not typing keywords

Voice search and AI assistants reward conversational, complete answers. Structure your posts around real questions and answer them directly, early, and thoroughly.

## Authority is built with depth

Thin content loses to comprehensive content. One authoritative post that fully answers a topic will outrank a dozen shallow ones — and earns the links that compound authority.

## Readability is a ranking signal

Clear structure — short paragraphs, meaningful headings, scannable lists — keeps readers engaged, and engagement is the meta-signal behind every ranking system.

## E-E-A-T still rules

Experience, expertise, authoritativeness, and trust. Show your credentials, cite sources, and write like someone who actually knows the subject.

## The practical checklist

- Answer the question in the first 100 words
- Use descriptive headings that read like an outline
- Add a clear meta description and title
- Keep posts focused on one core topic
- Update old posts instead of always writing new ones

The tools change, but the principle doesn't: write for humans first, and the machines will follow.`,
    category: "SEO",
    cover: "from-amber-500 via-orange-500 to-rose-600",
    seoTitle: "SEO in the Age of AI Search | Serif",
    seoDescription:
      "Rankings still matter — the rules are just changing. Here's what to optimize for now.",
    author: { id: "a3", name: "Sofia Reyes", initials: "SR", role: "Growth lead" },
    status: "published",
    publishedAt: "2026-08-04",
    updatedAt: "2026-08-04",
    readTime: 4,
    views: 2941,
  },
  {
    id: "pub-4",
    slug: "writing-headlines-that-earn-the-click",
    title: "Writing Headlines That Earn the Click",
    subtitle:
      "Your headline is a promise. Here's how to make it specific, honest, and impossible to ignore.",
    content: `The headline is the only part of your post most people will ever read. It decides whether your carefully crafted ideas get seen or stay invisible.

## Specificity beats cleverness

"Improve your writing" is forgettable. "Ten editing cuts that make any draft read better" is a promise with an audience. Specific headlines attract specific readers — and those are the readers who stay.

## Make a promise you can keep

Clickbait earns the click and loses the trust. A good headline sets an expectation the post fully delivers on. Alignment between headline and content is what turns one-time visitors into subscribers.

## Borrow the patterns that work

- **Numbers**: "Five ways to…"
- **Questions**: "Why is everyone talking about AI writing?"
- **How-to**: "How to publish every week without burning out"
- **Contrast**: "The slow way to grow, and the fast way"

## Test your titles

Write five headlines for every post. The act of generating alternatives forces clarity about what the post is really about.

## The one-line test

If you can't explain what someone gets from reading the post in one line, neither can they. Fix the headline before you fix anything else.`,
    category: "Writing",
    cover: "from-sky-500 via-blue-600 to-indigo-700",
    seoTitle: "Writing Headlines That Earn the Click | Serif",
    seoDescription:
      "Your headline is a promise. Make it specific, honest, and impossible to ignore.",
    author: { id: "a1", name: "Maya Chen", initials: "MC", role: "Editor at Serif" },
    status: "published",
    publishedAt: "2026-07-28",
    updatedAt: "2026-07-29",
    readTime: 3,
    views: 4107,
  },
  {
    id: "pub-5",
    slug: "the-draft-to-publish-workflow",
    title: "The Draft-to-Publish Workflow",
    subtitle:
      "A repeatable pipeline that turns a rough idea into a polished, published post — every single time.",
    content: `Most writers fail at publishing because they treat every post as a unique crisis. A workflow turns writing from an event into a system.

## Stage 1: Capture

Collect ideas continuously — a note, a voice memo, a headline that made you pause. No judgment, just capture. This is the raw material.

## Stage 2: Outline

Before writing, sketch the structure: the promise, the three or four points, the payoff. An outline is a map that keeps the draft from wandering.

## Stage 3: Generate the draft

This is where AI shines. Feed the outline to your assistant, set the tone, and let it produce a draft. Treat the output as a starting point, never a finished piece.

## Stage 4: Edit in passes

- **Pass one** — structure: does the argument hold?
- **Pass two** — clarity: does every sentence earn its place?
- **Pass three** — voice: does it sound like you?

## Stage 5: Polish the metadata

Title, subtitle, SEO title, and description. Ten minutes here multiplies every other minute of work.

## Stage 6: Publish

Hit publish, share it, and move on. The next post starts the cycle again — a little faster each time.`,
    category: "Strategy",
    cover: "from-fuchsia-500 via-purple-600 to-violet-800",
    seoTitle: "The Draft-to-Publish Workflow | Serif",
    seoDescription:
      "A repeatable pipeline that turns a rough idea into a polished, published post — every single time.",
    author: { id: "a4", name: "Priya Nair", initials: "PN", role: "Content strategist" },
    status: "published",
    publishedAt: "2026-07-21",
    updatedAt: "2026-07-21",
    readTime: 4,
    views: 2688,
  },
  {
    id: "pub-6",
    slug: "finding-your-writing-voice-with-ai",
    title: "Finding Your Writing Voice with AI",
    subtitle:
      "AI drafts can sound like everyone. Here's how to make them sound like you.",
    content: `The most common criticism of AI writing is that it all sounds the same. It's a fair point — and a solvable one.

## Feed the model examples of you

Give your AI assistant three of your best posts and ask it to match the rhythm, sentence length, and word choice. Style transfer works when the reference material is specific.

## Keep a voice guide

Write a short document describing your voice: conversational or formal, long or short sentences, where you use humor, which words you never use. Reference it in every generation.

## Rewrite the opening and closing by hand

The intro sets the tone and the conclusion leaves the impression. Those are the two places your personal voice must come through undiluted.

## Replace the generic with the specific

AI defaults to abstractions. Swap them for concrete details, real numbers, and personal anecdotes. Specificity is where voice lives.

## Edit with your ear

Read your drafts aloud. If a sentence sounds like a press release, rewrite it until it sounds like you talking to a smart friend.

## The loop that works

Generate → rewrite the human parts → generate again on the margins → polish. Each cycle pushes the piece further from generic and closer to unmistakably yours.`,
    category: "AI",
    cover: "from-violet-500 via-indigo-500 to-blue-700",
    seoTitle: "Finding Your Writing Voice with AI | Serif",
    seoDescription:
      "AI drafts can sound like everyone. Here's how to make them sound like you.",
    author: { id: "a2", name: "Daniel Osei", initials: "DO", role: "Contributing writer" },
    status: "published",
    publishedAt: "2026-07-14",
    updatedAt: "2026-07-15",
    readTime: 4,
    views: 3529,
  },
  {
    id: "pub-7",
    slug: "building-a-content-engine",
    title: "Building a Content Engine",
    subtitle:
      "One post is luck. A system that produces good posts on schedule is a business asset.",
    content: `Audiences don't form around one good post. They form around a rhythm of good posts — a content engine that runs whether you feel inspired or not.

## The engine has three gears

1. **Inventory** — a running list of topics, angles, and formats.
2. **Production** — the drafting, editing, and polish workflow.
3. **Distribution** — where the work goes and how it gets found.

## Pick formats that compound

Some formats produce one-time traffic; others build on themselves. Tutorials, frameworks, and opinion pieces that earn backlinks and shares are compounding assets.

## Audit your inventory monthly

Review what performed and why. Double down on the topics and formats that earned engagement, and prune the ones that didn't.

## Ship imperfect

An engine that ships weekly beats a masterpiece that ships yearly. Momentum is a feature.

## Make it yours

The tools change constantly. The engine — inventory, production, distribution — doesn't. Build the system once, and let the details evolve.`,
    category: "Strategy",
    cover: "from-rose-500 via-pink-500 to-fuchsia-600",
    seoTitle: "Building a Content Engine | Serif",
    seoDescription:
      "One post is luck. A system that produces good posts on schedule is a business asset.",
    author: { id: "a3", name: "Sofia Reyes", initials: "SR", role: "Growth lead" },
    status: "published",
    publishedAt: "2026-07-07",
    updatedAt: "2026-07-07",
    readTime: 4,
    views: 2380,
  },
];

export function getPublishedPost(slug: string): BlogPost | undefined {
  return publishedPosts.find((p) => p.slug === slug);
}

export function getRelatedPublishedPosts(slug: string, limit = 2): BlogPost[] {
  const current = getPublishedPost(slug);
  if (!current) return [];
  return publishedPosts
    .filter((p) => p.slug !== slug && p.category === current.category)
    .slice(0, limit);
}

export const seoDefaults = {
  title: "Serif — The Intelligent Future of Blogging",
  description:
    "Harness the power of AI to create, optimize, and publish compelling content in seconds.",
};