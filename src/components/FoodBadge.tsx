interface FoodBadgeProps {
  foodDetail: string | null;
}

const foodEmojis: Record<string, { emoji: string; label: string }> = {
  pizza: { emoji: '🍕', label: 'Free Pizza' },
  donut: { emoji: '🍩', label: 'Free Donuts' },
  donuts: { emoji: '🍩', label: 'Free Donuts' },
  coffee: { emoji: '☕', label: 'Free Coffee' },
  cookies: { emoji: '🍪', label: 'Free Cookies' },
  cake: { emoji: '🍰', label: 'Free Cake' },
  sandwich: { emoji: '🥪', label: 'Free Sandwiches' },
  sandwiches: { emoji: '🥪', label: 'Free Sandwiches' },
  drinks: { emoji: '🥤', label: 'Free Drinks' },
  snacks: { emoji: '🍿', label: 'Free Snacks' },
  burger: { emoji: '🍔', label: 'Free Burgers' },
  burgers: { emoji: '🍔', label: 'Free Burgers' },
  tacos: { emoji: '🌮', label: 'Free Tacos' },
  sushi: { emoji: '🍣', label: 'Free Sushi' },
  ice: { emoji: '🍦', label: 'Free Ice Cream' },
  'ice cream': { emoji: '🍦', label: 'Free Ice Cream' },
};

export function FoodBadge({ foodDetail }: FoodBadgeProps) {
  if (!foodDetail) return null;

  const normalizedFood = foodDetail.toLowerCase().trim();
  
  // Try to match a known food type
  let matched = foodEmojis[normalizedFood];
  
  // If not exact match, try partial match
  if (!matched) {
    for (const [key, value] of Object.entries(foodEmojis)) {
      if (normalizedFood.includes(key)) {
        matched = value;
        break;
      }
    }
  }

  const { emoji, label } = matched || { emoji: '😋', label: 'Free Food' };

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-food-bg text-food-fg">
      {emoji} {label}
    </span>
  );
}
