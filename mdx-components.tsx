import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {
  h2: (props) => <h2 className="mt-12 font-display text-3xl font-bold tracking-tight" {...props} />,
  h3: (props) => <h3 className="mt-8 font-display text-2xl font-bold" {...props} />,
  p: (props) => <p className="mt-5 text-lg leading-relaxed text-ink-soft text-pretty" {...props} />,
  ul: (props) => <ul className="mt-5 list-disc space-y-2 pl-6 text-lg text-ink-soft marker:text-lavender-deep" {...props} />,
  ol: (props) => <ol className="mt-5 list-decimal space-y-2 pl-6 text-lg text-ink-soft marker:font-bold marker:text-lavender-deep" {...props} />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  a: (props) => <a className="font-semibold text-ink underline decoration-lavender-deep decoration-2 underline-offset-4" {...props} />,
  code: (props) => <code className="rounded-md bg-lavender/30 px-1.5 py-0.5 font-mono text-[0.9em] text-ink" {...props} />,
  pre: (props) => (
    <pre
      className="mt-6 overflow-x-auto rounded-3xl bg-ink p-5 font-mono text-sm leading-relaxed text-cream [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-cream"
      {...props}
    />
  ),
  blockquote: (props) => <blockquote className="mt-6 border-l-4 border-peach-deep pl-5 italic text-ink-soft" {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
