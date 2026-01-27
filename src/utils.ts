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

export function absoluteLink(url: URL, src: string): string {
  return url.href.replace(/(\w\/).+/, "$1") + src.substring(1);
}

export function formatCurrency(value: number, options: Partial<Intl.NumberFormatOptions>= {}) {
  return new Intl.NumberFormat("de-AT", {
    style: "currency", currency: "EUR",
    roundingIncrement: 5,
    maximumFractionDigits: 0,
    trailingZeroDisplay: "stripIfInteger",
    ...options
  }).format(value);
}