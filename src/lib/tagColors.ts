// Smart Tag Engine - Neo-Brutalist Edition
// Deterministic color assignment with black borders

type TagColorScheme = {
  bg: string;
  text: string;
};

const tagColorMap: Record<string, TagColorScheme> = {
  // Food tags → Orange
  pizza: { bg: 'bg-[#FFD580]', text: 'text-black' },
  food: { bg: 'bg-[#FFD580]', text: 'text-black' },
  cake: { bg: 'bg-[#FFD580]', text: 'text-black' },
  donut: { bg: 'bg-[#FFD580]', text: 'text-black' },
  donuts: { bg: 'bg-[#FFD580]', text: 'text-black' },
  buffet: { bg: 'bg-[#FFD580]', text: 'text-black' },
  snacks: { bg: 'bg-[#FFD580]', text: 'text-black' },
  snack: { bg: 'bg-[#FFD580]', text: 'text-black' },
  
  // Party/Alcohol tags → Purple
  party: { bg: 'bg-[#D8B4FE]', text: 'text-black' },
  alcohol: { bg: 'bg-[#D8B4FE]', text: 'text-black' },
  wine: { bg: 'bg-[#D8B4FE]', text: 'text-black' },
  beer: { bg: 'bg-[#D8B4FE]', text: 'text-black' },
  drink: { bg: 'bg-[#D8B4FE]', text: 'text-black' },
  drinks: { bg: 'bg-[#D8B4FE]', text: 'text-black' },
  pub: { bg: 'bg-[#D8B4FE]', text: 'text-black' },
  '18+': { bg: 'bg-[#D8B4FE]', text: 'text-black' },
  nightlife: { bg: 'bg-[#D8B4FE]', text: 'text-black' },
  
  // Chill/Study tags → Blue
  sober: { bg: 'bg-[#BAE6FD]', text: 'text-black' },
  coffee: { bg: 'bg-[#BAE6FD]', text: 'text-black' },
  tea: { bg: 'bg-[#BAE6FD]', text: 'text-black' },
  study: { bg: 'bg-[#BAE6FD]', text: 'text-black' },
  chill: { bg: 'bg-[#BAE6FD]', text: 'text-black' },
  quiet: { bg: 'bg-[#BAE6FD]', text: 'text-black' },
  
  // Free tags → Green
  free: { bg: 'bg-[#BBF7D0]', text: 'text-black' },
};

// Pastel color palette for deterministic hash-based fallback (Brutalist Edition)
const pastelColors: TagColorScheme[] = [
  { bg: 'bg-[#FCA5A5]', text: 'text-black' }, // Rose
  { bg: 'bg-[#F9A8D4]', text: 'text-black' }, // Pink
  { bg: 'bg-[#E9D5FF]', text: 'text-black' }, // Fuchsia
  { bg: 'bg-[#C4B5FD]', text: 'text-black' }, // Violet
  { bg: 'bg-[#A5B4FC]', text: 'text-black' }, // Indigo
  { bg: 'bg-[#A5F3FC]', text: 'text-black' }, // Cyan
  { bg: 'bg-[#99F6E4]', text: 'text-black' }, // Teal
  { bg: 'bg-[#86EFAC]', text: 'text-black' }, // Emerald
  { bg: 'bg-[#BEF264]', text: 'text-black' }, // Lime
  { bg: 'bg-[#FDE047]', text: 'text-black' }, // Amber
];

// Simple deterministic hash function
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

export function getTagColor(tagName: string): TagColorScheme {
  const normalizedTag = tagName.toLowerCase().trim();
  
  // Check for exact match in predefined map
  if (tagColorMap[normalizedTag]) {
    return tagColorMap[normalizedTag];
  }
  
  // Check for partial matches (e.g., "free pizza" contains "free")
  for (const [key, colors] of Object.entries(tagColorMap)) {
    if (normalizedTag.includes(key)) {
      return colors;
    }
  }
  
  // Fallback: Use deterministic hash for consistent color
  const hashIndex = hashString(normalizedTag) % pastelColors.length;
  return pastelColors[hashIndex];
}
