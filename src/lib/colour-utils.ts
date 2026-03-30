/**
 * Simple colour resolver.
 * Accepts hex values (#rrggbb) directly, or a small set of basic colour names.
 * Split colours via slash: "#e02020/#f0f0f0" → clean left-right gradient.
 */

const BASIC: Record<string, string> = {
  white: "#f0f0f0",
  black: "#111111",
  red: "#e02020",
  blue: "#3b82f6",
  green: "#16a34a",
  yellow: "#facc15",
  orange: "#f97316",
  purple: "#a855f7",
  pink: "#f43f8a",
  grey: "#888888",
  gray: "#888888",
  silver: "#b0b0b0",
  gold: "#d4a017",
  brown: "#92400e",
  teal: "#0d9488",
  navy: "#1e3a6e",
  maroon: "#7f0000",
  cream: "#f5f0e0",
  beige: "#d4b896",
  bronze: "#cd7f32",
  copper: "#cd7f32",
};

function hexForSingle(input: string): string {
  const v = input.trim().toLowerCase();
  if (!v) return "#888888";
  // Direct hex
  if (v.startsWith("#")) return v;
  // Basic named colour (exact match only)
  return BASIC[v] ?? "#888888";
}

/**
 * Returns a CSS background value — hex or a hard-stop linear-gradient.
 * Supports slash-separated split: "#e02020/#f0f0f0" or "red/blue".
 */
export function resolveColour(input: string): string {
  if (!input?.trim()) return "#888888";

  const parts = input.split("/").map(p => p.trim()).filter(Boolean);

  if (parts.length >= 2) {
    const c1 = hexForSingle(parts[0]);
    const c2 = hexForSingle(parts[1]);
    return `linear-gradient(to right, ${c1} 50%, ${c2} 50%)`;
  }

  return hexForSingle(input);
}

/** True when value contains a slash (split colour). */
export function isGradientColour(input: string): boolean {
  return input.includes("/");
}
