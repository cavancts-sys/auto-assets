/**
 * Smart colour resolver — handles exact names, semantic nicknames,
 * fuzzy typos, and split colours like "black/white".
 */

type ColourEntry = { keywords: string[]; hex: string };

const COLOUR_MAP: ColourEntry[] = [
  // Whites & creams
  { keywords: ["pearl white","pearlescent white","solid white","alpine white","arctic white","crystal white","glacier white","chalk white","polar white","bright white","ceramic white"], hex: "#f8f8f8" },
  { keywords: ["cream","ivory","off white","off-white","eggshell","champagne white","vanilla","linen white"], hex: "#f5f0e0" },
  { keywords: ["white"], hex: "#f0f0f0" },

  // Blacks
  { keywords: ["midnight black","jet black","piano black","obsidian","onyx black","gloss black","matte black","phantom black","ultra black","carbon black","raven","satin black","velvet black","stealth black","starlight black"], hex: "#0a0a0a" },
  { keywords: ["black"], hex: "#111111" },

  // Greys / Silvers
  { keywords: ["space grey","space gray","gunmetal","anthracite","charcoal","dark grey","dark gray","graphite","slate","ash grey","ash gray","iron grey","iron gray","dark charcoal","volcano grey"], hex: "#3a3a3a" },
  { keywords: ["nardo grey","nardo gray","cement","concrete grey","concrete gray","urban grey","urban gray","mineral grey","mineral gray","pebble grey","pebble gray","thunder grey","thunder gray","storm grey","storm gray"], hex: "#808080" },
  { keywords: ["silver","chrome","aluminium","aluminum","metallic grey","metallic gray","light grey","light gray","platinum","titanium","pewter","nickel","lunar silver","blade silver","sonic silver","satin silver","polished silver"], hex: "#b0b0b0" },
  { keywords: ["grey","gray"], hex: "#888888" },

  // Reds
  { keywords: ["black cherry","cherry black","dark cherry","midnight cherry","blood red","deep red","oxblood red"], hex: "#3d0014" },
  { keywords: ["candy red","candy apple","cherry red","chilli red","chili red","ferrari red","imola red","rosso corsa","lava red","flame red","rally red","sport red","racing red"], hex: "#cc0000" },
  { keywords: ["dark red","maroon","burgundy","wine red","wine","crimson","claret","oxblood","sangria"], hex: "#7f0000" },
  { keywords: ["orange red","torch red","sunset red","bright red","rally red red","firetruck red"], hex: "#e8232a" },
  { keywords: ["red"], hex: "#e02020" },
  { keywords: ["rose","blush","coral pink","dusty rose"], hex: "#ff6b8a" },
  { keywords: ["pink","fuchsia","magenta","hot pink"], hex: "#f43f8a" },

  // Oranges & Yellows
  { keywords: ["burnt orange","terracotta orange","rust orange","solar orange","copper orange"], hex: "#c45500" },
  { keywords: ["orange","tangerine","amber orange","tiger orange","inferno orange"], hex: "#f97316" },
  { keywords: ["gold","golden","saffron","mustard gold","champagne gold","dark gold"], hex: "#d4a017" },
  { keywords: ["yellow","lime yellow","canary","daytona yellow","racing yellow","sulphur","sunburst yellow","bright yellow"], hex: "#facc15" },

  // Greens
  { keywords: ["british racing green","brg","racing green","dark green","forest green","hunter green","deep green","night green","bottle green"], hex: "#1a4d2e" },
  { keywords: ["olive","khaki green","army green","military green","camo","drab green","nato green"], hex: "#6b7c3a" },
  { keywords: ["mint","sage","light green","pale green","pistachio"], hex: "#86efac" },
  { keywords: ["neon green","lime green","lime","electric green","acid green"], hex: "#84cc16" },
  { keywords: ["green","emerald","highland green"], hex: "#16a34a" },
  { keywords: ["teal","petrol","aqua","seafoam","dark teal"], hex: "#0d9488" },
  { keywords: ["turquoise","cyan","electric teal"], hex: "#22d3ee" },

  // Blues
  { keywords: ["midnight blue","dark blue","deep blue","navy blue","navy","marine","abyss blue","dark navy","ink blue","deep navy"], hex: "#1e3a6e" },
  { keywords: ["royal blue","cobalt","electric blue","bright blue","azure","victory blue","performance blue"], hex: "#2563eb" },
  { keywords: ["metallic blue","steel blue","slate blue","denim","sonic blue","interlagos blue","long beach blue"], hex: "#4682b4" },
  { keywords: ["baby blue","sky blue","powder blue","light blue","ice blue","polar blue","lagoon blue"], hex: "#7dd3fc" },
  { keywords: ["blue"], hex: "#3b82f6" },

  // Purples
  { keywords: ["dark purple","deep purple","grape","eggplant","plum","aubergine","ultraviolet"], hex: "#5b21b6" },
  { keywords: ["violet","indigo","dark violet"], hex: "#7c3aed" },
  { keywords: ["purple","lavender","mauve","orchid"], hex: "#a855f7" },

  // Browns / Earth tones — semantic names
  { keywords: ["espresso","dark chocolate","dark brown","walnut","mahogany","ebony brown","almost black brown"], hex: "#3b1a08" },
  { keywords: ["chocolate","rich brown","deep brown","cocoa"], hex: "#5c2e0a" },
  { keywords: ["coffee","café","café brown","coffee bean","café noir"], hex: "#6f4e37" },
  { keywords: ["mocha latte","mocha","macchiato","cappuccino"], hex: "#7b4f2e" },
  { keywords: ["hazel","cognac","caramel latte","toffee brown","whiskey brown"], hex: "#8b5e3c" },
  { keywords: ["brown","tan","caramel"], hex: "#92400e" },
  { keywords: ["clay","adobe","terracotta","brick red"], hex: "#b5651d" },
  { keywords: ["tobacco","umber","russet","sienna"], hex: "#8b4513" },
  { keywords: ["bronze","copper","penny"], hex: "#cd7f32" },
  { keywords: ["rose gold","blush gold"], hex: "#b76e79" },
  { keywords: ["beige","sand","dune","sahara","desert","khaki","biscuit","linen","cream beige","warm beige"], hex: "#d4b896" },

  // Champagnes & Golds
  { keywords: ["champagne","rose champagne","light champagne","warm champagne"], hex: "#f7e7ce" },

  // Wrapped / Special finishes
  { keywords: ["matte","satin finish"], hex: "#666666" },
  { keywords: ["wrapped","vinyl wrap","wrap"], hex: "#555555" },
  { keywords: ["two tone","two-tone","bicolor","bi-colour","bi-color","dual tone"], hex: "#888888" },
];

// Build a flat list of all keywords for fuzzy matching
type FlatEntry = { keyword: string; hex: string };
const FLAT: FlatEntry[] = [];
for (const entry of COLOUR_MAP) {
  for (const kw of entry.keywords) {
    FLAT.push({ keyword: kw, hex: entry.hex });
  }
}

function levenshtein(a: string, b: string): number {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[m][n];
}

/**
 * Resolve a single-colour word/phrase to a hex colour.
 * 1. Exact keyword match (longest first)
 * 2. Each word of input tried as fuzzy match against each keyword word
 */
function hexForSingle(input: string): string {
  const lower = input.toLowerCase().trim();
  if (!lower) return "#888888";

  // 1. Exact substring match (longest keyword first = already ordered)
  for (const entry of COLOUR_MAP) {
    for (const kw of entry.keywords) {
      if (lower.includes(kw) || kw.includes(lower)) return entry.hex;
    }
  }

  // 2. Word-level fuzzy match (Levenshtein ≤ 2 on any individual word)
  const inputWords = lower.split(/[\s-]+/).filter(Boolean);
  let bestHex = "#888888";
  let bestScore = Infinity;

  for (const { keyword, hex } of FLAT) {
    const kwWords = keyword.split(/[\s-]+/).filter(Boolean);
    for (const iw of inputWords) {
      if (iw.length < 3) continue; // skip very short words
      for (const kw of kwWords) {
        if (kw.length < 3) continue;
        const dist = levenshtein(iw, kw);
        const threshold = iw.length <= 5 ? 1 : 2;
        if (dist <= threshold && dist < bestScore) {
          bestScore = dist;
          bestHex = hex;
        }
      }
    }
  }

  return bestHex;
}

/**
 * Returns a CSS background value — either a hex string or a linear-gradient.
 * Supports slash-separated split colours: "black/white" → clean left-right split.
 */
export function resolveColour(input: string): string {
  if (!input || !input.trim()) return "#888888";

  const parts = input.split("/").map(p => p.trim()).filter(Boolean);

  if (parts.length >= 2) {
    const colours = parts.slice(0, 3).map(hexForSingle);
    if (colours.length === 2) {
      return `linear-gradient(to right, ${colours[0]} 50%, ${colours[1]} 50%)`;
    }
    const pct = 100 / colours.length;
    const stops = colours.map((c, i) => `${c} ${i * pct}%, ${c} ${(i + 1) * pct}%`).join(", ");
    return `linear-gradient(to right, ${stops})`;
  }

  return hexForSingle(input);
}

/** True when resolved value is a gradient (for style prop selection). */
export function isGradientColour(input: string): boolean {
  return input.includes("/");
}
