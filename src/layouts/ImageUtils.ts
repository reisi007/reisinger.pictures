export function absoluteLink(url: URL, src: string): string {
  return url.href.replace(/(\w\/).+/, "$1") + src.substring(1);
}