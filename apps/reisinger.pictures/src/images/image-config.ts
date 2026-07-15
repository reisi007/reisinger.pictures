export const IMAGE_BASE_URL = import.meta.env.PUBLIC_IMAGE_CDN_URL ?? "/imagedist";
export const IMAGE_FORMAT = "webp" as const;
export const TARGET_WIDTHS = [256, 640, 828, 1080, 1200, 1920, 2048];
