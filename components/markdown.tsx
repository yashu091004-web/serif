import ReactMarkdown, { type Components } from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"
import { LinkIcon } from "lucide-react"

const components: Components = {
  h1: ({ children }) => (
    <h1 className="mt-10 mb-4 font-display text-3xl font-semibold tracking-tight">
      {children}
    </h1>
  ),
  h2: ({ children, id }) => (
    <h2
      id={id}
      className="group mt-10 mb-3 flex scroll-mt-24 items-center gap-2 font-display text-2xl font-semibold tracking-tight"
    >
      <a href={`#${id}`} className="inline-flex items-center gap-2">
        {children}
        <LinkIcon className="size-4 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100" />
      </a>
    </h2>
  ),
  h3: ({ children, id }) => (
    <h3
      id={id}
      className="group mt-8 mb-2 flex scroll-mt-24 items-center gap-2 text-lg font-semibold tracking-tight"
    >
      <a href={`#${id}`} className="inline-flex items-center gap-2">
        {children}
        <LinkIcon className="size-4 text-muted-foreground/40 opacity-0 transition-opacity group-hover:opacity-100" />
      </a>
    </h3>
  ),
  p: ({ children }) => (
    <p className="my-4 leading-7 text-muted-foreground [&>code]:text-foreground">
      {children}
    </p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-medium text-primary underline underline-offset-4 transition-colors hover:text-primary/80"
      target={href?.startsWith("http") ? "_blank" : undefined}
      rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="my-4 ml-5 list-disc space-y-1.5 leading-7 marker:text-primary/60 [&>li]:text-muted-foreground">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-4 ml-5 list-decimal space-y-1.5 leading-7 marker:font-medium marker:text-primary [&>li]:text-muted-foreground">
      {children}
    </ol>
  ),
  li: ({ children }) => <li>{children}</li>,
  blockquote: ({ children }) => (
    <blockquote className="my-5 rounded-r-lg border-l-3 border-primary bg-primary/5 py-1 pl-4 pr-3 [&>p]:my-2 [&>p]:text-foreground/90">
      {children}
    </blockquote>
  ),
  code: ({ className, children }) => {
    const isBlock = className?.includes("language-")
    if (isBlock) {
      const lang = className?.match(/language-(\w+)/)?.[1] ?? "text"
      return (
        <pre className="my-5 overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 text-sm leading-relaxed">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[0.625rem] font-semibold tracking-wider text-muted-foreground uppercase">
              {lang}
            </span>
          </div>
          <code className="font-mono text-[0.8125rem] text-foreground">
            {children}
          </code>
        </pre>
      )
    }
    return (
      <code className="rounded-md border border-border/80 bg-muted px-1.5 py-0.5 font-mono text-[0.8125rem] font-medium text-primary">
        {children}
      </code>
    )
  },
  pre: ({ children }) => <>{children}</>,
  hr: () => <hr className="my-8 border-border" />,
  table: ({ children }) => (
    <div className="my-5 overflow-x-auto rounded-lg border border-border">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="border-b border-border bg-muted/40 text-left">
      {children}
    </thead>
  ),
  th: ({ children }) => (
    <th className="px-3 py-2 font-semibold text-foreground">{children}</th>
  ),
  td: ({ children }) => (
    <td className="border-t border-border/60 px-3 py-2 text-muted-foreground">
      {children}
    </td>
  ),
  strong: ({ children }) => (
    <strong className="font-semibold text-foreground">{children}</strong>
  ),
  em: ({ children }) => (
    <em className="font-display italic text-foreground">{children}</em>
  ),
  input: ({ ...props }) => (
    <input
      type="checkbox"
      disabled
      className="mr-2 inline-block h-4 w-4 rounded border-border align-middle accent-primary"
      {...props}
    />
  ),
}

export function Markdown({ content }: { content: string }) {
  return (
    <div className={cn("text-[0.9375rem]")}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}