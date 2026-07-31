export type ExifData = {
  captureDate?: string;
  aperture?: string;
  focalLength?: string;
  shutter?: string;
  iso?: number;
  camera?: string;
  lens?: string;
  orientation?: "portrait" | "landscape" | "square";
}

export type YamlMetaData = {
  title?: string | null;
  darkInvert?: boolean;
  favorite?: boolean;
  metadata?: ExifData | null;
  slug?: string;
  categories?: string[] | null;
}

export type ImageWithExifMeta = {
  metadata: ExifData | null;
  slug: string;
  title: string;
  darkInvert: boolean;
  favorite: boolean;
}
