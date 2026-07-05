const config = {
  basePrice: 50,
  hourlyRate: 100,
  imagesPerHourPackage: 6 // Basis für Studio (Indoor)
};

export const basePrice = config.basePrice;
export const flatrateMultiplier = 1.2;
export const outdoorDiscountMultiplier = 0.5;

/**
 * Zentralisierte Preis-Berechnung für Shootings
 * @param durationMinutes Dauer des Shootings in Minuten
 * @param images Anzahl der inkludierten Bilder
 * @param multiplier Multiplikator für Rabatte (z.B. 0.5) oder Aufschläge (z.B. 1.2)
 * @param location "indoor" (Studio) oder "outdoor" (1/2 Preis pro Bild -> 2x Menge)
 */
export function calculatePackagePrice(
  durationMinutes: number,
  images: number,
  multiplier = 1,
  location: "indoor" | "outdoor" = "indoor"
): number {
  const durationHours = durationMinutes / 60;
  const timePrice = durationHours * config.hourlyRate;

  // Outdoor: Bilder kosten pro Stück nur die Hälfte (2x so viele fürs gleiche Geld)
  const locationMultiplier = location === "outdoor" ? outdoorDiscountMultiplier : 1;
  const imagesPrice = (config.hourlyRate / config.imagesPerHourPackage) * images * locationMultiplier;

  return (config.basePrice + timePrice + imagesPrice) * multiplier;
}

// Next Specials getrennt berechnen
export const pricingNextIndoor = calculatePackagePrice(90, 15, 1, "indoor");
export const pricingNextIndoorReduced = pricingNextIndoor * (2 / 3);

export const pricingNextOutdoor = calculatePackagePrice(90, 20, 1, "outdoor");
export const pricingNextOutdoorReduced = pricingNextOutdoor * (2 / 3);

export const socialMediaSpecial = config.basePrice / 3 + config.hourlyRate / 2 + (2 * (config.hourlyRate / config.imagesPerHourPackage));

export const image1 = (config.hourlyRate / config.imagesPerHourPackage) * 1.8;
export const image5 = (config.hourlyRate / config.imagesPerHourPackage) * 5 * 1.5;
export const image10 = (config.hourlyRate / config.imagesPerHourPackage) * 10 * 1.2;

export const image1Indoor = image1;
export const image5Indoor = image5;
export const image10Indoor = image10;

export const image1Outdoor = image1 * outdoorDiscountMultiplier;
export const image5Outdoor = image5 * outdoorDiscountMultiplier;
export const image10Outdoor = image10 * outdoorDiscountMultiplier;

export const express = 3 * config.hourlyRate;
export const all = 2 * 8 * config.hourlyRate;

export const maxReductionNext = Math.max(pricingNextIndoor - pricingNextIndoorReduced, pricingNextOutdoor - pricingNextOutdoorReduced);
export const maxPriceImage5 = Math.max(image5Indoor, image5Outdoor);
