import type { MarkdownHeading } from "astro";

export interface Heading {
  text: string;
  slug: string;
  level: number;
  children: Heading[];
}

export function buildTree(headings: MarkdownHeading[]): Heading[] {
  const root: Heading[] = [];
  const stack: Heading[] = [];

  for (const heading of headings) {
    const node: Heading = { text: heading.text, level: heading.depth, children: [], slug: heading.slug };

    while (stack.length > 0 && stack[stack.length - 1].level >= heading.depth) {
      stack.pop();
    }

    if (stack.length === 0) {
      root.push(node);
    } else {
      stack[stack.length - 1].children.push(node);
    }

    stack.push(node);
  }

  return root;
}