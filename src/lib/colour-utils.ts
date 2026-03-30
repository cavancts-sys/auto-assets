/**
 * Smart colour resolver — handles exact names, semantic/nature words,
 * fuzzy typos, and split colours like "black/white".
 *
 * Strategy (in order):
 * 1. Exact keyword match against the master table (longest match wins)
 * 2. Semantic word map (leaf→green, ocean→blue, fire→orange, etc.)
 * 3. Word-level Levenshtein fuzzy match (catches typos)
 */

type ColourEntry = { keywords: string[]; hex: string };

const COLOUR_MAP: ColourEntry[] = [
  // ── Whites & creams ────────────────────────────────────────────────────────
  {
    keywords: [
      "pearl white","pearlescent white","solid white","alpine white","arctic white",
      "crystal white","glacier white","chalk white","polar white","bright white",
      "ceramic white","cloud white","cotton white","porcelain white",
    ],
    hex: "#f8f8f8",
  },
  {
    keywords: [
      "cream","ivory","off white","off-white","eggshell","champagne white",
      "vanilla","linen white","butter","bone","bisque","wheat",
    ],
    hex: "#f5f0e0",
  },
  { keywords: ["white","snow","milk","frost","chalk"], hex: "#f0f0f0" },

  // ── Blacks ─────────────────────────────────────────────────────────────────
  {
    keywords: [
      "midnight black","jet black","piano black","obsidian","onyx black",
      "gloss black","matte black","phantom black","ultra black","carbon black",
      "raven","satin black","velvet black","stealth black","starlight black",
      "coal","soot","void","abyss","darkness","shadow black",
    ],
    hex: "#0a0a0a",
  },
  { keywords: ["black","night","shadow","dark","onyx"], hex: "#111111" },

  // ── Greys / Silvers ────────────────────────────────────────────────────────
  {
    keywords: [
      "space grey","space gray","gunmetal","anthracite","charcoal","dark grey",
      "dark gray","graphite","slate","ash grey","ash gray","iron grey",
      "iron gray","dark charcoal","volcano grey","smoke","soot grey",
      "stone grey","stone gray","flint","gravel","pebble grey",
    ],
    hex: "#3a3a3a",
  },
  {
    keywords: [
      "nardo grey","nardo gray","cement","concrete grey","concrete gray",
      "urban grey","urban gray","mineral grey","mineral gray","thunder grey",
      "storm grey","storm gray","ash","fog","mist","smoke grey",
    ],
    hex: "#808080",
  },
  {
    keywords: [
      "silver","chrome","aluminium","aluminum","metallic grey","metallic gray",
      "light grey","light gray","platinum","titanium","pewter","nickel",
      "lunar silver","blade silver","sonic silver","satin silver",
      "polished silver","steel","cloud","ice grey","moonlight",
    ],
    hex: "#b0b0b0",
  },
  { keywords: ["grey","gray","rock","stone","pebble"], hex: "#888888" },

  // ── Reds ───────────────────────────────────────────────────────────────────
  {
    keywords: [
      "black cherry","cherry black","dark cherry","midnight cherry",
      "blood red","deep red","oxblood red","vampire","garnet dark",
    ],
    hex: "#3d0014",
  },
  {
    keywords: [
      "candy red","candy apple","cherry red","chilli red","chili red",
      "ferrari red","imola red","rosso corsa","lava red","flame red",
      "rally red","sport red","racing red","fire red","tomato red",
    ],
    hex: "#cc0000",
  },
  {
    keywords: [
      "dark red","maroon","burgundy","wine red","wine","crimson","claret",
      "oxblood","sangria","merlot","cabernet","brick","blood","scarlet dark",
    ],
    hex: "#7f0000",
  },
  {
    keywords: [
      "orange red","torch red","sunset red","bright red","firetruck red",
      "scarlet","ruby red","poppy",
    ],
    hex: "#e8232a",
  },
  { keywords: ["red","fire engine","rose red","strawberry","tomato"], hex: "#e02020" },
  { keywords: ["rose","blush","coral pink","dusty rose","salmon","petal"], hex: "#ff6b8a" },
  { keywords: ["pink","fuchsia","magenta","hot pink","flamingo","bubblegum"], hex: "#f43f8a" },

  // ── Oranges & Yellows ──────────────────────────────────────────────────────
  {
    keywords: [
      "burnt orange","terracotta orange","rust orange","solar orange",
      "copper orange","ember","clay orange","brick orange",
    ],
    hex: "#c45500",
  },
  {
    keywords: [
      "orange","tangerine","amber orange","tiger orange","inferno orange",
      "carrot","pumpkin","citrus","peach","mango orange","fire orange",
    ],
    hex: "#f97316",
  },
  {
    keywords: [
      "gold","golden","saffron","mustard gold","champagne gold","dark gold",
      "amber","honey","caramel gold","wheat gold","harvest gold","topaz",
    ],
    hex: "#d4a017",
  },
  {
    keywords: [
      "yellow","lime yellow","canary","daytona yellow","racing yellow",
      "sulphur","sunburst yellow","bright yellow","sun","sunshine","lemon",
      "banana","sunflower","corn","buttercup","daffodil","golden yellow",
    ],
    hex: "#facc15",
  },

  // ── Greens ─────────────────────────────────────────────────────────────────
  {
    keywords: [
      "british racing green","brg","racing green","dark green","forest green",
      "hunter green","deep green","night green","bottle green",
      "jungle","emerald dark","pine","woodland","moss dark","swamp",
    ],
    hex: "#1a4d2e",
  },
  {
    keywords: [
      "olive","khaki green","army green","military green","camo","drab green",
      "nato green","moss","avocado","fern","leaf dark","earth green","sage dark",
    ],
    hex: "#6b7c3a",
  },
  {
    keywords: [
      "mint","sage","light green","pale green","pistachio","celadon",
      "seafoam green","spring green","cucumber","matcha","herb",
    ],
    hex: "#86efac",
  },
  {
    keywords: [
      "neon green","lime green","lime","electric green","acid green",
      "chartreuse","grass neon","alien green","toxic green",
    ],
    hex: "#84cc16",
  },
  {
    keywords: [
      "green","emerald","highland green","leaf","grass","plant","bush",
      "tree green","garden","lawn","nature green","foliage","ivy",
    ],
    hex: "#16a34a",
  },
  { keywords: ["teal","petrol","aqua","dark teal","deep teal","lagoon dark"], hex: "#0d9488" },
  {
    keywords: [
      "turquoise","cyan","electric teal","caribbean","peacock","pool",
    ],
    hex: "#22d3ee",
  },

  // ── Blues ──────────────────────────────────────────────────────────────────
  {
    keywords: [
      "midnight blue","dark blue","deep blue","navy blue","navy","marine",
      "abyss blue","dark navy","ink blue","deep navy","ocean blue",
      "ocean","sea","deep sea","sea blue","atlantic","pacific","admiral",
    ],
    hex: "#1e3a6e",
  },
  {
    keywords: [
      "royal blue","cobalt","electric blue","bright blue","azure",
      "victory blue","performance blue","sapphire","lapis","ultramarine",
      "water","river","lake","lagoon",
    ],
    hex: "#2563eb",
  },
  {
    keywords: [
      "metallic blue","steel blue","slate blue","denim","sonic blue",
      "interlagos blue","long beach blue","ink","indigo blue","storm blue",
    ],
    hex: "#4682b4",
  },
  {
    keywords: [
      "baby blue","sky blue","powder blue","light blue","ice blue",
      "polar blue","lagoon blue","sky","air","heavenly","periwinkle",
      "carolina blue","robin egg","cerulean",
    ],
    hex: "#7dd3fc",
  },
  { keywords: ["blue","blueberry","cornflower","iris","jeans"], hex: "#3b82f6" },

  // ── Purples ────────────────────────────────────────────────────────────────
  {
    keywords: [
      "dark purple","deep purple","grape","eggplant","plum","aubergine",
      "ultraviolet","space purple","galaxy purple","cosmic purple","nebula",
    ],
    hex: "#5b21b6",
  },
  { keywords: ["violet","indigo","dark violet","twilight","midnight purple"], hex: "#7c3aed" },
  {
    keywords: [
      "purple","lavender","mauve","orchid","lilac","amethyst","heather",
      "thistle","wisteria","mulberry","plum light",
    ],
    hex: "#a855f7",
  },

  // ── Browns / Earth tones ───────────────────────────────────────────────────
  {
    keywords: [
      "espresso","dark chocolate","dark brown","walnut","mahogany","ebony brown",
      "almost black brown","bark dark","chestnut dark",
    ],
    hex: "#3b1a08",
  },
  {
    keywords: [
      "chocolate","rich brown","deep brown","cocoa","cacao","brownie",
      "bark","wood dark","log",
    ],
    hex: "#5c2e0a",
  },
  {
    keywords: [
      "coffee","café","café brown","coffee bean","café noir","mocha latte",
      "mocha","macchiato","cappuccino","java","hazel",
    ],
    hex: "#6f4e37",
  },
  {
    keywords: [
      "caramel","cognac","toffee brown","whiskey brown","tawny",
      "amber brown","copper brown","rust brown","russet",
    ],
    hex: "#8b5e3c",
  },
  {
    keywords: [
      "brown","tan","wood","timber","tree","bark light","earth","soil",
      "dirt","mud","acorn","pecan","chestnut",
    ],
    hex: "#92400e",
  },
  {
    keywords: [
      "clay","adobe","terracotta","brick red","pottery","rusty",
    ],
    hex: "#b5651d",
  },
  { keywords: ["tobacco","umber","sienna","cinnamon","nutmeg"], hex: "#8b4513" },
  { keywords: ["bronze","copper","penny","metallic brown"], hex: "#cd7f32" },
  { keywords: ["rose gold","blush gold","pink gold","champagne rose"], hex: "#b76e79" },
  {
    keywords: [
      "beige","sand","dune","sahara","desert","khaki","biscuit",
      "linen","cream beige","warm beige","sandstone","sesame","oat",
    ],
    hex: "#d4b896",
  },

  // ── Special finishes ───────────────────────────────────────────────────────
  { keywords: ["champagne","light champagne","warm champagne","straw"], hex: "#f7e7ce" },
  { keywords: ["matte","satin finish","flat"], hex: "#666666" },
  { keywords: ["wrapped","vinyl wrap","wrap","vinyl"], hex: "#555555" },
  { keywords: ["two tone","two-tone","bicolor","bi-colour","bi-color","dual tone"], hex: "#888888" },
];

// ── Semantic word map — any single evocative word → colour ─────────────────
// These are words NOT likely covered by keyword exact/fuzzy matching
const SEMANTIC: Record<string, string> = {
  // Nature / plants
  leaf: "#16a34a",   leaves: "#16a34a", sprout: "#16a34a", stem: "#16a34a",
  grass: "#16a34a",  lawn: "#16a34a",   field: "#16a34a",  meadow: "#16a34a",
  fern: "#1a4d2e",   palm: "#1a4d2e",   jungle: "#1a4d2e", canopy: "#1a4d2e",
  moss: "#6b7c3a",   lichen: "#6b7c3a", algae: "#6b7c3a",
  // Water / ocean
  ocean: "#1e3a6e",  sea: "#1e3a6e",    wave: "#2563eb",   surf: "#0d9488",
  river: "#3b82f6",  lake: "#3b82f6",   pond: "#3b82f6",   stream: "#3b82f6",
  rain: "#7dd3fc",   teardrop: "#7dd3fc",
  // Sky
  sky: "#7dd3fc",    cloud: "#d0d0d0",  fog: "#888888",    mist: "#808080",
  dusk: "#7c3aed",   twilight: "#7c3aed", dawn: "#f97316", sunrise: "#f97316",
  sunset: "#f97316", horizon: "#7dd3fc",
  // Fire / heat
  fire: "#f97316",   flame: "#f97316",  blaze: "#e8232a",
  lava: "#e8232a",   magma: "#c45500",  ember: "#c45500",  spark: "#facc15",
  // Sun / light / stars
  sun: "#facc15",    sunshine: "#facc15", solar: "#facc15", sunray: "#facc15",
  star: "#facc15",   stellar: "#7dd3fc", moon: "#d0d0d0",  moonlight: "#b0b0b0",
  galaxy: "#1e3a6e", nebula: "#7c3aed", cosmos: "#111111", space: "#0a0a0a",
  aurora: "#22d3ee", comet: "#b0b0b0",
  // Night / dark
  night: "#111111",  shadow: "#222222", void: "#0a0a0a",   dark: "#111111",
  soot: "#222222",   cave: "#222222",   abyss: "#0a0a0a",
  // Ice / cold
  ice: "#7dd3fc",    snow: "#f0f0f0",   frost: "#c8e8ff",  glacier: "#a0c8e0",
  arctic: "#c8e8ff", blizzard: "#f0f0f0",
  // Earth / ground
  earth: "#92400e",  soil: "#6f4e37",   mud: "#6b7c3a",    dirt: "#92400e",
  clay: "#b5651d",   sand: "#d4b896",   dust: "#d4b896",
  stone: "#888888",  rock: "#666666",   gravel: "#808080", pebble: "#808080",
  slate: "#3a3a3a",  flint: "#3a3a3a",  cobble: "#808080",
  // Wood / bark
  wood: "#92400e",   bark: "#6f4e37",   timber: "#92400e", log: "#5c2e0a",
  oak: "#92400e",    cedar: "#8b4513",  pine: "#1a4d2e",   mahogany: "#3b1a08",
  // Gems / minerals
  ruby: "#cc0000",   emerald: "#16a34a", sapphire: "#2563eb", amethyst: "#a855f7",
  topaz: "#d4a017",  opal: "#b0b0b0",   jade: "#16a34a",   onyx: "#0a0a0a",
  amber: "#d4a017",  garnet: "#7f0000", crystal: "#d0d0d0", quartz: "#d0d0d0",
  diamond: "#e8e8e8",
  // Food / drink
  banana: "#facc15", lemon: "#facc15",  sunflower: "#facc15",
  strawberry: "#e02020", tomato: "#e02020", cherry: "#cc0000",
  blueberry: "#3b82f6", grape: "#5b21b6",  plum: "#5b21b6",
  avocado: "#6b7c3a",   lime: "#84cc16",   kiwi: "#6b7c3a",
  peach: "#f97316",     mango: "#f97316",  papaya: "#f97316",
  tangerine: "#f97316", apricot: "#f97316",
  raspberry: "#e02020", pomegranate: "#cc0000",
  chocolate: "#5c2e0a", caramel: "#8b5e3c", vanilla: "#f5f0e0",
  coffee: "#6f4e37",    espresso: "#3b1a08", mocha: "#6f4e37",
  honey: "#d4a017",     mustard: "#d4a017", cinnamon: "#8b4513",
  mint: "#86efac",      pistachio: "#86efac",
  // Animals / nature-inspired
  flamingo: "#f43f8a", peacock: "#22d3ee", parrot: "#16a34a",
  raven: "#0a0a0a",    crow: "#111111",    dove: "#f0f0f0",
  swan: "#f0f0f0",     falcon: "#808080",  hawk: "#808080",
  panther: "#111111",  jaguar: "#d4a017",  tiger: "#f97316",
  elephant: "#888888", rhino: "#808080",   hippo: "#808080",
  // Textiles / vibes
  denim: "#4682b4",    cobalt: "#2563eb",  coral: "#f97316",
  lilac: "#a855f7",    lavender: "#a855f7", teal: "#0d9488",
  turquoise: "#22d3ee", aqua: "#0d9488",
  // Metals
  gold: "#d4a017",     silver: "#b0b0b0",  bronze: "#cd7f32",
  copper: "#cd7f32",   iron: "#3a3a3a",    steel: "#4682b4",
  chrome: "#c0c0c0",   titanium: "#888888", nickel: "#b0b0b0",
};

// ── Build a flat list for fuzzy matching ───────────────────────────────────
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
 * 2. Semantic word map (any evocative word)
 * 3. Word-level fuzzy match (Levenshtein — catches typos)
 */
function hexForSingle(input: string): string {
  const lower = input.toLowerCase().trim();
  if (!lower) return "#888888";

  // 1. Exact substring match (longest keyword first)
  for (const entry of COLOUR_MAP) {
    for (const kw of entry.keywords) {
      if (lower === kw || lower.includes(kw) || kw.includes(lower)) {
        return entry.hex;
      }
    }
  }

  // 2. Per-word semantic lookup — if any word in input is a semantic keyword
  const inputWords = lower.split(/[\s/-]+/).filter(Boolean);
  for (const word of inputWords) {
    if (word.length >= 3 && word in SEMANTIC) {
      return SEMANTIC[word];
    }
  }

  // 3. Fuzzy match (Levenshtein ≤ 2)
  let bestHex = "#888888";
  let bestScore = Infinity;

  for (const { keyword, hex } of FLAT) {
    const kwWords = keyword.split(/[\s-]+/).filter(Boolean);
    for (const iw of inputWords) {
      if (iw.length < 3) continue;
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
