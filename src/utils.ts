import { type Page } from "astro";

export function groupBy<T>(
  items: T[],
  keyExtractor: (item: T) => string
): Record<string, T[]> {
  return items.reduce((groupedItems, item) => {
    const grouped = groupedItems;
    const key = keyExtractor(item);
    // Check if the key exists in groups, if not, create an empty array
    grouped[key] = grouped[key] || ([] as T);
    grouped[key].push(item);
    return grouped;
  }, {} as Record<string, T[]>);
}


export function slugToName(slug: string) {
  return slug[0].toUpperCase() + slug.substring(1);
}

export function singlePage<T>(data: T[]): Page<T> {
  return {
    start: 0,
    end: data.length - 1,
    total: data.length - 1,
    currentPage: 1,
    size: data.length - 1,
    lastPage: 1,
    data,
    url: { current: "", next: undefined, last: undefined, prev: undefined, first: "" }
  };
}