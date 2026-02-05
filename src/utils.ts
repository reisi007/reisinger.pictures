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

/**
 * Berechnet den "psychologischen" Preis.
 * Rundet auf den nächsten 5er. Wenn das Ergebnis auf 0 endet (z.B. 100, 20),
 * wird 1 abgezogen (z.B. 99, 19).
 */
function roundToPsychologicalValue(value: number): number {
  // 1. Auf den nächsten 5er runden
  let rounded = Math.round(value / 5) * 5;

  // 2. Prüfen, ob die Zahl durch 10 teilbar ist (Endziffer 0)
  // Wir schließen 0 aus, damit "0 Euro" nicht zu "-1 Euro" wird,
  // es sei denn, das ist gewünscht.
  if (rounded !== 0 && rounded % 10 === 0) {
    rounded -= 1;
  }

  return rounded;
}

/**
 * Basis-Optionen für ein konsistentes Aussehen (Währung, Sprache)
 */
const BASE_OPTIONS: Intl.NumberFormatOptions = {
  style: "currency",
  currency: "EUR",
  trailingZeroDisplay: "stripIfInteger" // Optional, je nach Browser-Support
};

/**
 * OPTION A: Psychologischer Preis (Rundung + Formatierung)
 * Beispiel: 103 -> 105 € | 98 -> 99 €
 */
export function formatPsychologicalPrice(value: number, options: Partial<Intl.NumberFormatOptions> = {}) {
  const psychologicalValue = roundToPsychologicalValue(value);

  return new Intl.NumberFormat("de-AT", {
    ...BASE_OPTIONS,
    maximumFractionDigits: 0, // Keine Cents bei psychologischen Preisen (sind immer Ganzzahlen)
    ...options
  }).format(psychologicalValue);
}

/**
 * OPTION B: Exakter Preis (Centgenau)
 * Beispiel: 123.45 -> 123,45 €
 */
export function formatExactPrice(value: number) {
  return new Intl.NumberFormat("de-AT", {
    ...BASE_OPTIONS,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

export function psychologicalPriceAsNumber(value: number) {
  const string = formatPsychologicalPrice(value).replace(/[^\d.]/g, "");
  console.log(value, string);
  return parseFloat(string);
}