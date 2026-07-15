export interface ExifData {
  captureDate?: string;
  aperture?: string;
  focalLength?: string;
  shutter?: string;
  iso?: number;
  camera?: string;
  lens?: string;
  orientation?: "portrait" | "landscape" | "square";
}

export interface YamlMetaData {
  title?: string | null;
  darkInvert?: boolean;
  favorite?: boolean;
  metadata?: ExifData | null;
  slug?: string;
  categories?: string[] | null;
}

export interface ImageWithExifMeta {
  metadata: ExifData | null;
  slug: string;
  title: string;
  darkInvert: boolean;
  favorite: boolean;
}
