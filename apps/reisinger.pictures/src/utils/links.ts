export function contactLink(prefix: string, extra?: Record<string, string>): string {
  const params = new URLSearchParams({ subject_prefix: prefix, ...extra });
  return `?${params.toString()}#kontakt`;
}
