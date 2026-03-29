/**
 * Maps a free-text car colour string to the closest CSS hex colour.
 * Checks each word/phrase in the input against a priority-ordered keyword list.
 */

type ColourEntry = { keywords: string[]; hex: string };

const COLOUR_MAP: ColourEntry[] = [
  // Whites & creams
  { keywords: ["pearl white", "pearlescent white", "solid white", "alpine white", "arctic white", "crystal white", "glacier white", "chalk white", "polar white"], hex: "#f8f8f8" },
  { keywords: ["cream", "ivory", "off white", "off-white", "eggshell", "champagne white", "vanilla"], hex: "#f5f0e0" },
  { keywords: ["white"], hex: "#f0f0f0" },

  // Blacks
  { keywords: ["midnight black", "jet black", "piano black", "obsidian", "onyx black", "gloss black", "matte black", "phantom black", "ultra black", "carbon black", "raven"], hex: "#0a0a0a" },
  { keywords: ["black"], hex: "#111111" },

  // Greys / Silvers
  { keywords: ["space grey", "space gray", "gunmetal", "anthracite", "charcoal", "dark grey", "dark gray", "graphite", "slate", "ash grey", "ash gray", "iron grey", "iron gray"], hex: "#3a3a3a" },
  { keywords: ["nardo grey", "nardo gray", "cement", "concrete grey", "concrete gray", "urban grey", "urban gray", "mineral grey", "mineral gray"], hex: "#808080" },
  { keywords: ["silver", "chrome", "aluminium", "aluminum", "metallic grey", "metallic gray", "light grey", "light gray", "platinum", "titanium", "pewter", "nickel"], hex: "#b0b0b0" },
  { keywords: ["grey", "gray"], hex: "#888888" },

  // Reds
  { keywords: ["candy red", "candy apple", "cherry red", "chilli red", "chili red", "ferrari red", "imola red", "rosso corsa", "lava red", "flame red"], hex: "#cc0000" },
  { keywords: ["dark red", "maroon", "burgundy", "wine red", "wine", "crimson", "claret", "oxblood", "sangria"], hex: "#7f0000" },
  { keywords: ["orange red", "torch red", "sunset red", "bright red", "racing red", "sport red", "rally red"], hex: "#e8232a" },
  { keywords: ["red"], hex: "#e02020" },
  { keywords: ["rose", "blush", "coral pink"], hex: "#ff6b8a" },
  { keywords: ["pink", "fuchsia", "magenta"], hex: "#f43f8a" },

  // Oranges
  { keywords: ["burnt orange", "terracotta", "rust orange", "solar orange"], hex: "#c45500" },
  { keywords: ["orange", "tangerine", "amber orange"], hex: "#f97316" },
  { keywords: ["gold", "golden", "saffron", "mustard gold"], hex: "#d4a017" },
  { keywords: ["yellow", "lime yellow", "canary", "daytona yellow", "racing yellow", "sulphur"], hex: "#facc15" },

  // Greens
  { keywords: ["british racing green", "brg", "racing green", "dark green", "forest green", "hunter green", "deep green"], hex: "#1a4d2e" },
  { keywords: ["olive", "khaki green", "army green", "military green", "camo"], hex: "#6b7c3a" },
  { keywords: ["mint", "sage", "light green", "pale green"], hex: "#86efac" },
  { keywords: ["neon green", "lime green", "lime", "electric green"], hex: "#84cc16" },
  { keywords: ["green", "emerald"], hex: "#16a34a" },
  { keywords: ["teal", "petrol", "aqua", "seafoam"], hex: "#0d9488" },
  { keywords: ["turquoise", "cyan"], hex: "#22d3ee" },

  // Blues
  { keywords: ["midnight blue", "dark blue", "deep blue", "navy blue", "navy", "marine", "abyss blue"], hex: "#1e3a6e" },
  { keywords: ["royal blue", "cobalt", "electric blue", "bright blue", "azure"], hex: "#2563eb" },
  { keywords: ["metallic blue", "steel blue", "slate blue", "denim", "sonic blue"], hex: "#4682b4" },
  { keywords: ["baby blue", "sky blue", "powder blue", "light blue", "ice blue"], hex: "#7dd3fc" },
  { keywords: ["blue"], hex: "#3b82f6" },

  // Purples
  { keywords: ["dark purple", "deep purple", "grape", "eggplant", "plum", "aubergine"], hex: "#5b21b6" },
  { keywords: ["violet", "indigo"], hex: "#7c3aed" },
  { keywords: ["purple", "lavender", "mauve"], hex: "#a855f7" },

  // Browns / Bronzes / Coppers
  { keywords: ["dark brown", "chocolate", "espresso", "walnut", "mahogany"], hex: "#4a2510" },
  { keywords: ["bronze", "copper", "rose gold"], hex: "#cd7f32" },
  { keywords: ["brown", "tan", "caramel", "cognac", "mocha", "hazel"], hex: "#92400e" },
  { keywords: ["beige", "sand", "dune", "sahara", "desert", "khaki", "biscuit"], hex: "#d4b896" },

  // Champagne / Golds
  { keywords: ["champagne", "gold", "champagne gold"], hex: "#d4af7a" },

  // Wrapped / Special finishes
  { keywords: ["matte", "satin", "wrapped"], hex: "#666666" },
  { keywords: ["two tone", "two-tone", "bicolor", "bi-colour", "bi-color"], hex: "#888888" },
];

export function resolveColour(input: string): string {
  if (!input || !input.trim()) return "#888888";

  const lower = input.toLowerCase().trim();

  // Try longest-match first by checking full phrases before individual words
  for (const entry of COLOUR_MAP) {
    for (const kw of entry.keywords) {
      if (lower.includes(kw)) return entry.hex;
    }
  }

  // Fallback: medium grey
  return "#888888";
}
