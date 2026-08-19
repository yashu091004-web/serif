import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Clean Writing",
    description: "A distraction-free editor that lets you focus on what matters most — your words.",
  },
  {
    title: "Powerful Editor",
    description: "Rich formatting, markdown support, and media embedding built right in.",
  },
  {
    title: "Share Instantly",
    description: "Publish with one click and share your stories with the world.",
  },
  {
    title: "Track Performance",
    description: "Understand your audience with built-in analytics and engagement metrics.",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <section className="flex flex-col items-center justify-center gap-6 px-6 py-24 text-center">
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Where ideas find their voice
        </h1>
        <p className="max-w-lg text-lg text-muted-foreground">
          Serif is a modern blog platform built for writers who care about craft.
          Write beautifully, publish effortlessly.
        </p>
        <div className="flex gap-3">
          <Link href="/signup" className={buttonVariants({ size: "lg" })}>
            Get started
          </Link>
          <a href="#features" className={buttonVariants({ size: "lg", variant: "outline" })}>
            Learn more
          </a>
        </div>
      </section>

      <section id="features" className="border-t bg-muted/40 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-10 text-center text-2xl font-semibold tracking-tight">
            Everything you need
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <Card key={f.title}>
                <CardHeader>
                  <CardTitle className="text-base">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {f.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground">
        Serif &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
