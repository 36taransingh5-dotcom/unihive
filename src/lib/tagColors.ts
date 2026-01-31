// Smart Tag Engine - Deterministic color assignment for event tags

type TagColorScheme = {
  bg: string;
  text: string;
};

const tagColorMap: Record<string, TagColorScheme> = {
  // Food tags → Orange
  pizza: { bg: 'bg-orange-100', text: 'text-orange-800' },
  food: { bg: 'bg-orange-100', text: 'text-orange-800' },
  cake: { bg: 'bg-orange-100', text: 'text-orange-800' },
  donut: { bg: 'bg-orange-100', text: 'text-orange-800' },
  donuts: { bg: 'bg-orange-100', text: 'text-orange-800' },
  buffet: { bg: 'bg-orange-100', text: 'text-orange-800' },
  snacks: { bg: 'bg-orange-100', text: 'text-orange-800' },
  
  // Party/Alcohol tags → Purple
  party: { bg: 'bg-purple-100', text: 'text-purple-800' },
  alcohol: { bg: 'bg-purple-100', text: 'text-purple-800' },
  wine: { bg: 'bg-purple-100', text: 'text-purple-800' },
  beer: { bg: 'bg-purple-100', text: 'text-purple-800' },
  pub: { bg: 'bg-purple-100', text: 'text-purple-800' },
  '18+': { bg: 'bg-purple-100', text: 'text-purple-800' },
  nightlife: { bg: 'bg-purple-100', text: 'text-purple-800' },
  
  // Chill/Study tags → Blue
  sober: { bg: 'bg-blue-100', text: 'text-blue-800' },
  coffee: { bg: 'bg-blue-100', text: 'text-blue-800' },
  tea: { bg: 'bg-blue-100', text: 'text-blue-800' },
  study: { bg: 'bg-blue-100', text: 'text-blue-800' },
  chill: { bg: 'bg-blue-100', text: 'text-blue-800' },
  quiet: { bg: 'bg-blue-100', text: 'text-blue-800' },
  
  // Free tags → Green
  free: { bg: 'bg-green-100', text: 'text-green-800' },
  
  // Paid/Ticket tags → Grey
  ticket: { bg: 'bg-slate-100', text: 'text-slate-800' },
  '£': { bg: 'bg-slate-100', text: 'text-slate-800' },
  paid: { bg: 'bg-slate-100', text: 'text-slate-800' },
  ticketed: { bg: 'bg-slate-100', text: 'text-slate-800' },
};

// Pastel color palette for deterministic hash-based fallback
const pastelColors: TagColorScheme[] = [
  { bg: 'bg-rose-100', text: 'text-rose-800' },
  { bg: 'bg-pink-100', text: 'text-pink-800' },
  { bg: 'bg-fuchsia-100', text: 'text-fuchsia-800' },
  { bg: 'bg-violet-100', text: 'text-violet-800' },
  { bg: 'bg-indigo-100', text: 'text-indigo-800' },
  { bg: 'bg-cyan-100', text: 'text-cyan-800' },
  { bg: 'bg-teal-100', text: 'text-teal-800' },
  { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  { bg: 'bg-lime-100', text: 'text-lime-800' },
  { bg: 'bg-amber-100', text: 'text-amber-800' },
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
