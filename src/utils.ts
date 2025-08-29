import { readFile } from "fs/promises";

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

/**
 * Asynchronously checks if a file contains a specific string.
 * This is the recommended non-blocking approach.
 *
 * @param filePath The path to the file to check.
 * @param searchString The string to search for within the file.
 * @returns A promise that resolves to true if the string is found, otherwise false.
 */
export const fileContainsString = async (filePath: string, searchString: string): Promise<boolean> => {
  try {
    // Read the entire file content into a string.
    // 'utf8' encoding is specified to ensure we get a string, not a buffer.
    const content = await readFile(filePath, "utf8");

    // Use the String.prototype.includes() method for a simple and readable check.
    return content.includes(searchString);
  } catch (error) {
    // If an error occurs (e.g., file not found, permissions issue),
    // log the error and return false.
    console.error(`Error reading file at ${filePath}:`, error);
    return false;
  }
};

export async function asyncFilter<T>(
  arr: T[],
  predicate: (value: T) => Promise<boolean>
): Promise<T[]> {
  // Map each item to its corresponding promise from the async predicate
  const promises = arr.map(predicate);

  // Await the array of promises to get an array of boolean results
  const results = await Promise.all(promises);

  // Filter the original array based on the boolean results
  return arr.filter((_value, index) => results[index]);
}