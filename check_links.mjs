import { readdir, readFile } from "fs/promises";
import { join, resolve } from "path";
import { JSDOM } from "jsdom";
import config from "./astro.config.mjs";

/**
 * Removes all elements from the array that match the given predicate.
 *
 * @template T
 * @param {T[]} array - The array to modify.
 * @param {(element: T, index: number, array: T[]) => boolean} predicate - Function to test each element.
 * @returns {T[]} The modified array (same reference) with matching elements removed.
 */
function removeIf(array, predicate) {
  let i = 0;
  while (i < array.length) {
    if (predicate(array[i], i, array)) {
      array.splice(i, 1);
    } else {
      i++;
    }
  }
  return array;
}

/**
 * Recursively finds all files with a .html extension in a given directory.
 * This helper function is parser-agnostic.
 * @param {string} dirPath - The directory to start scanning from.
 * @returns {Promise<string[]>} A promise that resolves to a flat array of full file paths.
 */
async function getHtmlFilePaths(dirPath) {
  const absoluteDirPath = resolve(dirPath);
  const allEntries = await readdir(absoluteDirPath, { withFileTypes: true });

  const filePromises = allEntries.map(async (entry) => {
    const fullPath = join(absoluteDirPath, entry.name);
    if (entry.isDirectory()) {
      return getHtmlFilePaths(fullPath); // Recurse into subdirectories
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith(".html")) {
      return fullPath; // Return the path if it's an HTML file
    }
    return []; // Ignore other file types
  });

  const nestedPaths = await Promise.all(filePromises);
  // Flatten the array of arrays into a single list of paths
  return nestedPaths.flat();
}


/**
 * Extracts unique `href` attributes from `<a>` tags and `id` attributes from `<h1>` to `<h4>` tags
 * within a given HTML file using JSDOM.
 * @param {string} filePath - The path to the HTML file to process.
 * @param {string} absoluteUrl - The absolute URL of the site.
 * @returns {Promise<{aLinks: string[], hIds: string[]}>} A promise that resolves to an object containing two arrays:
 * `aLinks` for hrefs and `hIds` for heading IDs. Returns empty arrays on error.
 */
async function extractUniqueLinksFromFileWithJSDOM(filePath, absoluteUrl) {
  try {
    const htmlContent = await readFile(filePath, "utf-8");
    const dom = new JSDOM(htmlContent);
    const { document } = dom.window;
    const hIds = Array.from(document.querySelectorAll("[id]"))
      .map(element => `${absoluteUrl}#${encodeURIComponent(element.getAttribute("id"))}`);
    const aLinks = Array.from(document.querySelectorAll("a[href]"))
      .map(element => element.getAttribute("href")).map(e => e.startsWith("#") ? absoluteUrl + e : e);
    return { aLinks, hIds };
  } catch (error) {
    console.error(`Could not process file ${filePath}:`, error);
    return { aLinks: [], hIds: [] };
  }
}

/**
 * Recursively iterates over all HTML files in a folder and its subdirectories,
 * extracting all unique href attributes from <a> tags using JSDOM.
 * @param {string} folderPath The path to the top-level folder to scan.
 * @param {string} prefix The prefix to prepend to all href values
 * @returns {Promise<{ links:string[],anchors: string[]}>} A promise that resolves to an object containing two arrays:
 * `globallyUniqueLinks` for all unique links and `anchors` for all valid anchor links.
 */
export async function extractAllLinksRecursivelyWithJSDOM(folderPath, prefix) {
  folderPath = resolve(folderPath);
  try {
    // 1. Get a flat list of all HTML files recursively
    const htmlFiles = await getHtmlFilePaths(folderPath);

    if (htmlFiles.length === 0) {
      console.log(`No HTML files found in "${folderPath}" or its subdirectories.`);
      return { links: [], anchors: [] };
    }

    console.log(`Found ${htmlFiles.length} HTML files to process...`);

    // 2. Create an array of promises, with each promise resolving to the links from one file
    const promises = htmlFiles.map(filePath => {
      const relativePath = filePath.replace(folderPath, "").replace(/[\\/]?index\.html$/, "").replaceAll("\\", "/");
      return extractUniqueLinksFromFileWithJSDOM(filePath, relativePath);
    });

    // 3. Wait for all files to be processed in parallel
    const results = await Promise.all(promises);
    const aLinks = results.flatMap(e => e.aLinks);
    const anchors = results.flatMap(e => e.hIds).map(e => prefix + e);

    // 4. Flatten the array of arrays and perform the final global deduplication
    const links = aLinks.flat()
      .map(e => e.startsWith("/") || e.startsWith("#") ? prefix + e : e)
      .map(e => !e.endsWith("/") && e.startsWith("https") && !e.includes("#") && !e.endsWith(".pdf") ? `${e}/` : e);

    return { links, anchors };

  } catch (error) {
    console.error(`Error processing folder "${folderPath}":`, error.message);
    throw error;
  }
}

/**
 * Parses an XML sitemap file using jsdom and extracts the text content of all <loc> tags.
 *
 * @param {string} sitemapPath The file path to the sitemap.xml file.
 * @returns {Promise<string[]>} A promise that resolves to an array of URL strings from the <loc> tags.
 */
export async function extractLocsFromSitemap(sitemapPath) {
  try {
    // 1. Read the XML file content
    const xmlContent = await readFile(sitemapPath, "utf-8");

    // 2. Create a JSDOM instance, crucially specifying the XML content type
    const dom = new JSDOM(xmlContent, { contentType: "application/xml" });

    // 3. Access the document object from the created DOM
    const { document } = dom.window;
    return Array.from(document.querySelectorAll("loc"))
      .map(element => element.textContent)
      .map(e => decodeURI(e))
      .filter(e => e !== undefined);
  } catch (error) {
    console.error(`Failed to parse sitemap at ${sitemapPath}:`, error);
    throw error;
  }
}

const knownUrlsPromise = extractLocsFromSitemap("./dist/sitemap-0.xml");
const crossRefLinksPromise = extractAllLinksRecursivelyWithJSDOM("./dist", config.site);

const sitemapUrls = await knownUrlsPromise;
const { links: crossRefLinks, anchors } = await crossRefLinksPromise;

const knownUrls = [...new Set([...sitemapUrls, ...anchors])];

let missingUrls = crossRefLinks
  .filter(link => !knownUrls.includes(link))
  .map(link => new URL(link));

missingUrls = removeIf(missingUrls, link => link.protocol.includes("mailto") && link.pathname === "florian@reisinger.pictures");
missingUrls = removeIf(missingUrls, link => link.protocol.includes("https") && !link.host.includes("reisinger.pictures"));
missingUrls = removeIf(missingUrls, link => link.pathname.endsWith(".pdf") && (["agb", "dsb"].some(prefix => link.pathname.includes(prefix))));

if (missingUrls.length > 0)
  throw new Error(`Found ${missingUrls.length} missing links:\n${missingUrls.join("\n")}`);
else
  console.log("No missing links found!");
