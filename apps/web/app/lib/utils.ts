import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges multiple class names into a single string, intelligently handling
 * Tailwind classes, arbitrary class names, and objects of class names.
 *
 * @param {...ClassValue} inputs Class names to merge
 * @returns {string} A single class name string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts an RGBA color object to a hex string.
 *
 * @param {Object} color RGBA color object
 * @returns {String} Hex string representation of the color
 */
export const rgbaToHex = ({ r = 0, g = 0, b = 0, a = 1 } = {}) => {
  const toHex = (value: number) => Number(value).toString(16).padStart(2, "0");
  const alpha = Math.round(a * 255); // Convert 0–1 alpha to 0–255
  return `#${toHex(r)}${toHex(g)}${toHex(b)}${toHex(alpha)}`.toUpperCase();
};

type RGBA = { r: number; g: number; b: number; a?: number };

/**
 * Gets the contrasting color of a given color.
 * @param {string} color Color string in any valid CSS format.
 * @returns {string} "#000" or "#fff" (black or white).
 * @example
 * getContrastColor("#fff") // "#000"
 * getContrastColor("#333") // "#fff"
 * getContrastColor("rgba(0, 0, 0, 0.5)") // "#fff"
 */
export function getContrastColor(color: string): "#000" | "#fff" {
  const rgba = parseColor(color);
  const { r, g, b, a = 1 } = rgba;

  // Blend with white background
  const blendedR = Math.round((1 - a) * 255 + a * r);
  const blendedG = Math.round((1 - a) * 255 + a * g);
  const blendedB = Math.round((1 - a) * 255 + a * b);

  const luminance =
    (0.299 * blendedR + 0.587 * blendedG + 0.114 * blendedB) / 255;

  return luminance > 0.6 ? "#000" : "#fff";
}

/**
 * Parses a color string in any valid CSS format and returns an RGBA color object.
 *
 * Supports the following formats:
 * - Hex color: #rrggbb or #rrggbbaa
 * - RGBA color: rgba(r, g, b, a)
 * - RGB color: rgb(r, g, b)
 *
 * @throws if the color string is in an unsupported format.
 */
function parseColor(color: string): RGBA {
  if (color.startsWith("#")) {
    return hexToRgba(color);
  } else if (color.startsWith("rgba")) {
    return rgbaStringToRgba(color);
  } else if (color.startsWith("rgb")) {
    return rgbStringToRgba(color);
  }
  throw new Error("Unsupported color format: " + color);
}

/**
 * Converts a hex color string to an RGBA color object.
 *
 * Supports 3-digit (#rgb) and 6-digit (#rrggbb) hex formats.
 * The alpha value is set to 1 by default.
 *
 * @param {string} hex Hex color string.
 * @returns {RGBA} RGBA color object with properties r, g, b, and a.
 * @throws Will throw an error if the hex string is not a valid 3 or 6-digit color.
 */
function hexToRgba(hex: any): RGBA {
  let r = 0,
    g = 0,
    b = 0;

  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex[1] + hex[2], 16);
    g = parseInt(hex[3] + hex[4], 16);
    b = parseInt(hex[5] + hex[6], 16);
  }

  return { r, g, b, a: 1 };
}

/**
 * Parses an RGBA or RGB color string and returns an RGBA color object.
 *
 * Supports `rgba(r, g, b, a)` and `rgb(r, g, b)` formats. If the alpha value
 * is not provided, it defaults to 1.
 *
 * @param {string} rgbaStr - A string representing an RGBA or RGB color.
 * @returns {RGBA} An object with properties r, g, b, and a representing the color.
 * @throws Will throw an error if the input string is not a valid RGBA or RGB format.
 */
function rgbaStringToRgba(rgbaStr: string): RGBA {
  const match: any = rgbaStr.match(/rgba?\(([^)]+)\)/);
  if (!match) throw new Error("Invalid rgba color string: " + rgbaStr);

  const [r, g, b, a = "1"] = match[1]
    .split(",")
    .map((v: string) => parseFloat(v.trim()));
  return { r, g, b, a };
}

/**
 * Parses an RGB color string and returns an RGBA color object.
 *
 * Supports `rgb(r, g, b)` format. The alpha value is always 1.
 *
 * @param {string} rgbStr - A string representing an RGB color.
 * @returns {RGBA} An object with properties r, g, b, and a representing the color.
 * @throws Will throw an error if the input string is not a valid RGB format.
 */
function rgbStringToRgba(rgbStr: string): RGBA {
  const match: any = rgbStr.match(/rgb\(([^)]+)\)/);
  if (!match) throw new Error("Invalid rgb color string: " + rgbStr);

  const [r, g, b] = match[1]
    .split(",")
    .map((v: string) => parseFloat(v.trim()));
  return { r, g, b, a: 1 };
}
