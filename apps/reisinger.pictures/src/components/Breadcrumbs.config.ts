import { testimonialTypes } from "../data/testimonialTypes";

export type BreadcrumbLink = {
  path: string;
  name: string;
};

type BreadcrumbLevel = {
  path: string;
  name: string;
  parent?: string;
};

const globalLabel = "Alle Kundenbewertungen";

export const breadcrumbLevels: BreadcrumbLevel[] = [
  { path: "/testimonials", name: globalLabel },
  ...Object.entries(testimonialTypes).map(([type, meta]) => ({
    path: `/shootings/${type}/testimonials`,
    name: meta.title,
    parent: "/testimonials"
  }))
];

const levelByPath = new Map(breadcrumbLevels.map(level => [level.path, level]));

function ancestorsOf(level: BreadcrumbLevel): BreadcrumbLink[] {
  const chain: BreadcrumbLink[] = [];
  let current = level.parent !== undefined ? levelByPath.get(level.parent) : undefined;
  while (current !== undefined) {
    chain.unshift({ path: current.path, name: current.name });
    current = current.parent !== undefined ? levelByPath.get(current.parent) : undefined;
  }
  return chain;
}

export function extractTestimonialId(pathname: string): string | undefined {
  return /^\/testimonials\/([^/]+)$/.exec(pathname)?.[1];
}

export function buildBreadcrumbs(
  pathname: string,
  urlAncestors: BreadcrumbLink[],
  detailType?: string
): BreadcrumbLink[] {
  const level = levelByPath.get(pathname);
  if (level !== undefined) {
    return ancestorsOf(level);
  }

  const testimonialId = extractTestimonialId(pathname);
  if (testimonialId !== undefined && detailType !== undefined) {
    const parent = levelByPath.get(`/shootings/${detailType}/testimonials`);
    if (parent !== undefined) {
      return [...ancestorsOf(parent), { path: parent.path, name: parent.name }];
    }
  }

  return urlAncestors;
}
