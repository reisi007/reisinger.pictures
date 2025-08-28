import { readFile } from "fs/promises";
import { readFileSync } from "fs";

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

/**
 * Synchronously checks if a file contains a specific string.
 * This will block the Node.js event loop until the file is read.
 * Use it only in scripts or situations where blocking is acceptable.
 *
 * @param filePath The path to the file to check.
 * @param searchString The string to search for within the file.
 * @returns True if the string is found, otherwise false.
 */
export const fileContainsStringSync = (filePath: string, searchString: string): boolean => {
  try {
    // Read the file content synchronously.
    const content = readFileSync(filePath, "utf8");

    // Check if the content includes the search string.
    return content.includes(searchString);
  } catch (error) {
    // Handle errors, such as the file not existing.
    console.error(`Error reading file synchronously at ${filePath}:`, error);
    return false;
  }
};
