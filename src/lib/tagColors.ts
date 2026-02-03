// Smart Tag Engine - Pop Art Edition
// Saturated, high-contrast colors with black borders

type TagColorScheme = {
  bg: string;
  text: string;
};

const tagColorMap: Record<string, TagColorScheme> = {
  // Food tags → Bright Orange
  pizza: { bg: 'bg-[#FF9F1C]', text: 'text-white' },
  food: { bg: 'bg-[#FF9F1C]', text: 'text-white' },
  cake: { bg: 'bg-[#FF9F1C]', text: 'text-white' },
  donut: { bg: 'bg-[#FF9F1C]', text: 'text-white' },
  donuts: { bg: 'bg-[#FF9F1C]', text: 'text-white' },
  buffet: { bg: 'bg-[#FF9F1C]', text: 'text-white' },
  snacks: { bg: 'bg-[#FF9F1C]', text: 'text-white' },
  snack: { bg: 'bg-[#FF9F1C]', text: 'text-white' },
  
  // Party/Alcohol tags → Hot Pink
  party: { bg: 'bg-[#FF4081]', text: 'text-white' },
  alcohol: { bg: 'bg-[#FF4081]', text: 'text-white' },
  wine: { bg: 'bg-[#FF4081]', text: 'text-white' },
  beer: { bg: 'bg-[#FF4081]', text: 'text-white' },
  drink: { bg: 'bg-[#FF4081]', text: 'text-white' },
  drinks: { bg: 'bg-[#FF4081]', text: 'text-white' },
  pub: { bg: 'bg-[#FF4081]', text: 'text-white' },
  '18+': { bg: 'bg-[#FF4081]', text: 'text-white' },
  nightlife: { bg: 'bg-[#FF4081]', text: 'text-white' },
  
  // Chill/Study tags → Electric Blue
  sober: { bg: 'bg-[#2EC4B6]', text: 'text-white' },
  coffee: { bg: 'bg-[#2EC4B6]', text: 'text-white' },
  tea: { bg: 'bg-[#2EC4B6]', text: 'text-white' },
  study: { bg: 'bg-[#2EC4B6]', text: 'text-white' },
  chill: { bg: 'bg-[#2EC4B6]', text: 'text-white' },
  quiet: { bg: 'bg-[#2EC4B6]', text: 'text-white' },
  
  // Free tags → Lime Green
  free: { bg: 'bg-[#CBF3F0]', text: 'text-black' },
  'free food': { bg: 'bg-[#CBF3F0]', text: 'text-black' },
};

// Saturated pastel palette for deterministic hash-based fallback
const pastelColors: TagColorScheme[] = [
  { bg: 'bg-[#FF6B6B]', text: 'text-white' }, // Coral Red
  { bg: 'bg-[#C44569]', text: 'text-white' }, // Berry
  { bg: 'bg-[#9B59B6]', text: 'text-white' }, // Purple
  { bg: 'bg-[#3498DB]', text: 'text-white' }, // Blue
  { bg: 'bg-[#1ABC9C]', text: 'text-white' }, // Teal
  { bg: 'bg-[#2ECC71]', text: 'text-white' }, // Green
  { bg: 'bg-[#F39C12]', text: 'text-white' }, // Orange
  { bg: 'bg-[#E74C3C]', text: 'text-white' }, // Red
  { bg: 'bg-[#5DADE2]', text: 'text-white' }, // Sky Blue
  { bg: 'bg-[#48C9B0]', text: 'text-white' }, // Mint
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
