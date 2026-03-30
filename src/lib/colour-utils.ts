/**
 * Colour utilities.
 *
 * The `colour` field may be stored in one of these formats:
 *   - "Red"                    → named colour (basic map)
 *   - "#e02020"                → exact hex
 *   - "#e02020/#f0f0f0"        → split hex
 *   - "#e02020|Cherry Red"     → hex with display name
 *   - "#e02020/#f0f0f0|Wrap"   → split hex with display name
 *
 * `parseColour`  → separates swatch value from display name
 * `resolveColour` → returns CSS background string (hex or gradient)
 */

const BASIC: Record<string, string> = {
  white: "#f0f0f0",   black: "#111111",   red: "#e02020",
  blue: "#3b82f6",    green: "#16a34a",   yellow: "#facc15",
  orange: "#f97316",  purple: "#a855f7",  pink: "#f43f8a",
  grey: "#888888",    gray: "#888888",    silver: "#b0b0b0",
  gold: "#d4a017",    brown: "#92400e",   teal: "#0d9488",
  navy: "#1e3a6e",    maroon: "#7f0000",  cream: "#f5f0e0",
  beige: "#d4b896",   bronze: "#cd7f32",  copper: "#cd7f32",
  wrapped: "#555555", wrap: "#555555",
};

/** Parse a stored colour value into its swatch and display-name parts. */
export function parseColour(input: string): { swatch: string; name: string } {
  if (!input?.trim()) return { swatch: "#888888", name: "" };
  const pipeIdx = input.indexOf("|");
  if (pipeIdx !== -1) {
    return {
      swatch: input.slice(0, pipeIdx).trim(),
      name: input.slice(pipeIdx + 1).trim(),
    };
  }
  // No pipe — the whole value is the swatch (could be name or hex)
  return { swatch: input.trim(), name: "" };
}

function hexForSingle(v: string): string {
  const s = v.trim().toLowerCase();
  if (!s) return "#888888";
  if (s.startsWith("#")) return s;
  return BASIC[s] ?? "#888888";
}

/**
 * Returns a CSS `background` value — a hex string or hard-stop gradient.
 * Supports `#hex1/#hex2` split and pipe-separated display names.
 */
export function resolveColour(input: string): string {
  const { swatch } = parseColour(input);
  if (!swatch) return "#888888";

  const parts = swatch.split("/").map(p => p.trim()).filter(Boolean);
  if (parts.length >= 2) {
    const c1 = hexForSingle(parts[0]);
    const c2 = hexForSingle(parts[1]);
    return `linear-gradient(to right, ${c1} 50%, ${c2} 50%)`;
  }
  return hexForSingle(swatch);
}
