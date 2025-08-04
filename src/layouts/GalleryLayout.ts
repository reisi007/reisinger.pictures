import type { BreakPoints } from "../styles/Breakpoints.ts";

export enum GalleryLayout {
  Full = "11111",
  Presentation = "11122",
  Overview = "12223",
  Thumbnails = "44488"
}

export const GALLERY_BREAKPOINTS: Record<GalleryLayout, Omit<BreakPoints<number>, "default">> = {
  [GalleryLayout.Full]: {
    "sm": 1,
    "md": 1,
    "lg": 1,
    "xl": 1,
    "2xl": 1
  },
  [GalleryLayout.Presentation]: {
    "sm": 1,
    "md": 1,
    "lg": 1,
    "xl": 2,
    "2xl": 2
  },
  [GalleryLayout.Overview]: {
    "sm": 1,
    "md": 2,
    "lg": 2,
    "xl": 2,
    "2xl": 3
  },
  [GalleryLayout.Thumbnails]: {
    "sm": 4,
    "md": 4,
    "lg": 4,
    "xl": 8,
    "2xl": 8
  }
};