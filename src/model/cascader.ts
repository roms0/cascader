import { weight } from "./weight-section";

type TagValue = string | number;

type Tag<P extends readonly string[]> = { type: P[number]; value: TagValue };

export type Section<P extends readonly string[]> = {
  tags: Tag<P>[];
  title: string;
};

export function cascade<
  P extends readonly string[],
  I extends { id: string; tags: Tag<P>[] },
  S extends Section<P>,
>(priorities: P, items: I[], sections: S[]) {
  type PossibleTypes = "Все" | (typeof priorities)[number];
  const table: { [K in PossibleTypes]?: number } = {
    Все: 0,
  };

  priorities.forEach((title: PossibleTypes, i) => {
    table[title] = i + 1;
  });
  const _sections = sections
    .map((section) => weight(section, table))
    .sort((a, b) => b.score - a.score);

  const distribution: Record<string, I[]> = {};
  const drafted: Set<I> = new Set();

  _sections.forEach((section) => {
    const title = section.title;
    distribution[title] = [];
    items.forEach((item) => {
      if (drafted.has(item)) return;
      const match = item.tags.some((it) =>
        section.tags.some((st) => st.type === it.type && st.value === it.value),
      );
      if (match) {
        drafted.add(item);
        distribution[title]?.push(item);
      }
    });
  });

  distribution["*"] = [];
  items.forEach((item) => {
    if (drafted.has(item)) return;
    distribution["*"]?.push(item);
  });
  return distribution;
}
