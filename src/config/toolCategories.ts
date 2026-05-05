/** Tool section categories — keep ToolModal options and Tools headings in sync. */

export const TOOL_CATEGORY_OPTIONS = [
  { value: "languages", label: "Languages" },
  { value: "frameworks", label: "Frameworks" },
  { value: "data", label: "Data" },
  { value: "devops", label: "DevOps" },
  { value: "ai-workflow", label: "AI Workflow" },
] as const;

export type ToolCategoryValue = (typeof TOOL_CATEGORY_OPTIONS)[number]["value"];

/** Display order for section columns (unknown categories sort last, alphabetically). */
export const TOOL_CATEGORY_ORDER: readonly string[] = [
  "languages",
  "frameworks",
  "data",
  "devops",
  "ai-workflow",
];

export function formatToolCategoryLabel(category: string): string {
  const row = TOOL_CATEGORY_OPTIONS.find((o) => o.value === category);
  if (row) return row.label;
  return category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function sortToolCategoryEntries<T>(entries: [string, T][]): [string, T][] {
  return [...entries].sort((a, b) => {
    const ia = TOOL_CATEGORY_ORDER.indexOf(a[0]);
    const ib = TOOL_CATEGORY_ORDER.indexOf(b[0]);
    if (ia === -1 && ib === -1) return a[0].localeCompare(b[0]);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });
}
