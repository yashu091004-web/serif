"use client";

import { useState, useSyncExternalStore } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const bubbleButtonClass =
  "inline-flex size-7 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-primary";

const mobileButtonClass = cn(bubbleButtonClass, "size-8");

function useIsDesktop() {
  return useSyncExternalStore(
    (callback) => {
      const mq = window.matchMedia("(min-width: 768px)");
      mq.addEventListener("change", callback);
      return () => mq.removeEventListener("change", callback);
    },
    () => window.matchMedia("(min-width: 768px)").matches,
    () => true
  );
}

interface RichTextEditorProps {
  initialContent: string;
  onChange: (html: string) => void;
}

export function RichTextEditor({ initialContent, onChange }: RichTextEditorProps) {
  const [linkMode, setLinkMode] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const isDesktop = useIsDesktop();

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "min-h-[18rem] px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  function openLinkEditor() {
    if (!editor) return;
    setLinkUrl((editor.getAttributes("link").href as string) || "");
    setLinkMode(true);
  }

  function applyLink() {
    if (!editor) return;
    if (linkUrl.trim()) {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: linkUrl.trim() })
        .run();
    }
    setLinkMode(false);
    setLinkUrl("");
  }

  function removeLink() {
    if (!editor) return;
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkMode(false);
    setLinkUrl("");
  }

  const buttonClass = isDesktop ? bubbleButtonClass : mobileButtonClass;

  const controls = linkMode ? (
    <>
      <Input
        value={linkUrl}
        onChange={(e) => setLinkUrl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            applyLink();
          }
        }}
        placeholder="https://example.com"
        className="h-7 w-48 text-xs sm:w-60"
        autoFocus
      />
      <Button type="button" size="xs" onClick={applyLink}>
        Save
      </Button>
      <button
        type="button"
        onClick={removeLink}
        aria-label="Remove link"
        className={buttonClass}
      >
        <Link2Off className="size-3.5" />
      </button>
    </>
  ) : (
    <>
      <button
        type="button"
        aria-label="Bold"
        data-active={editor?.isActive("bold")}
        className={buttonClass}
        onClick={() => editor?.chain().focus().toggleBold().run()}
      >
        <Bold className="size-3.5" />
      </button>
      <button
        type="button"
        aria-label="Italic"
        data-active={editor?.isActive("italic")}
        className={buttonClass}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
      >
        <Italic className="size-3.5" />
      </button>
      <span className="mx-0.5 h-4 w-px bg-border" aria-hidden />
      {[1, 2, 3].map((level) => (
        <button
          key={level}
          type="button"
          aria-label={`Heading ${level}`}
          data-active={editor?.isActive("heading", { level })}
          className={buttonClass}
          onClick={() =>
            editor
              ?.chain()
              .focus()
              .toggleHeading({ level: level as 1 | 2 | 3 })
              .run()
          }
        >
          {level === 1 ? (
            <Heading1 className="size-3.5" />
          ) : level === 2 ? (
            <Heading2 className="size-3.5" />
          ) : (
            <Heading3 className="size-3.5" />
          )}
        </button>
      ))}
      <span className="mx-0.5 h-4 w-px bg-border" aria-hidden />
      <button
        type="button"
        aria-label="Bullet list"
        data-active={editor?.isActive("bulletList")}
        className={buttonClass}
        onClick={() => editor?.chain().focus().toggleBulletList().run()}
      >
        <List className="size-3.5" />
      </button>
      <button
        type="button"
        aria-label="Numbered list"
        data-active={editor?.isActive("orderedList")}
        className={buttonClass}
        onClick={() => editor?.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="size-3.5" />
      </button>
      <span className="mx-0.5 h-4 w-px bg-border" aria-hidden />
      <button
        type="button"
        aria-label="Add or edit link"
        data-active={editor?.isActive("link")}
        className={buttonClass}
        onClick={openLinkEditor}
      >
        <Link2 className="size-3.5" />
      </button>
    </>
  );

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      {!isDesktop && editor && (
        <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 p-1">
          {controls}
        </div>
      )}
      {editor && isDesktop && (
        <BubbleMenu
          editor={editor}
          options={{ placement: "top", offset: 12 }}
        >
          <div className="flex items-center gap-0.5 rounded-lg border border-border bg-popover p-1 shadow-lg">
            {controls}
          </div>
        </BubbleMenu>
      )}
      <EditorContent
        editor={editor}
        className={cn(
          "[&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-4",
          "[&_blockquote]:my-3 [&_blockquote]:rounded-r-md [&_blockquote]:border-l-2 [&_blockquote]:border-primary/40 [&_blockquote]:bg-primary/5 [&_blockquote]:py-1 [&_blockquote]:pl-3 [&_blockquote]:pr-2",
          "[&_code]:rounded-md [&_code]:border [&_code]:border-border/80 [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.8125rem]",
          "[&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:font-display [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:tracking-tight",
          "[&_h2]:mt-6 [&_h2]:mb-2.5 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight",
          "[&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold",
          "[&_hr]:my-6 [&_hr]:border-border",
          "[&_li]:leading-7 [&_ol]:my-3 [&_ol]:ml-5 [&_ol]:list-decimal [&_p]:my-2 [&_p]:leading-7",
          "[&_pre]:my-3 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-muted/50 [&_pre]:p-3 [&_pre_code]:border-none [&_pre_code]:bg-transparent [&_pre_code]:p-0",
          "[&_strong]:font-semibold [&_strong]:text-foreground",
          "[&_ul]:my-3 [&_ul]:ml-5 [&_ul]:list-disc"
        )}
      />
    </div>
  );
}
