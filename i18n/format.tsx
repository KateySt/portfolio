import { Fragment, type ReactNode } from "react";

/** "Hi, I'm {name}" + { name: "Kateryna" } → "Hi, I'm Kateryna". Unknown placeholders are kept. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in vars ? String(vars[key]) : match));
}

/**
 * Like fmt, but placeholders become React nodes — for links or <kbd> inside a sentence,
 * so translators still see (and can reorder) the whole sentence.
 */
export function rich(template: string, nodes: Record<string, ReactNode>): ReactNode {
  return template.split(/(\{\w+\})/g).map((part, i) => {
    const key = part.match(/^\{(\w+)\}$/)?.[1];
    return <Fragment key={i}>{key && key in nodes ? nodes[key] : part}</Fragment>;
  });
}
