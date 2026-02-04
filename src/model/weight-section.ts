import type { Section } from "./cascader";

export function weight<P extends readonly string[]>(
  section: Section<P>,
  table: { [K in P[number]]?: number },
): Section<P> & { score: number } {
  const slots = Object.keys(table).length - 1;
  const frequency = new Array(slots).fill(0);
  section.tags.forEach((t) => {
    const slot = (table[t.type] as number) - 1;
    frequency[slot] += 1;
  });

  let max = 0;
  let i = 0;
  frequency.forEach((c, ni) => {
    if (c >= max) {
      i = ni;
      max = c;
    }
  });
  return {
    ...section,
    score: ((i + 1) * 100 - frequency[i]) * Math.pow(10, -slots - 1),
  };
}
