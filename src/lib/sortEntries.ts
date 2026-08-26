// Shared ordering rule for games/pnp/posts everywhere they're listed:
// manual `order` wins (set via drag-and-drop in the CMS), ties fall back
// to most-recent-first. Every entry defaults to order: 0, so before
// anyone has ever dragged anything in a given collection, everything is
// tied and this behaves exactly like the old "most recent first" sort.
export function sortEntries<T extends { data: { order?: number; publishedDate: Date } }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => {
    const orderDiff = (a.data.order ?? 0) - (b.data.order ?? 0);
    if (orderDiff !== 0) return orderDiff;
    return b.data.publishedDate.valueOf() - a.data.publishedDate.valueOf();
  });
}
