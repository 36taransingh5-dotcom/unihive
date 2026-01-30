-- Add columns for Munchies Engine and Smart Maps features
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS food_detail TEXT,
ADD COLUMN IF NOT EXISTS latitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION,
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Add has_free_food computed check (for convenience, we'll handle this in the app logic)
COMMENT ON COLUMN public.events.food_detail IS 'Extracted food item if free food is available (e.g., Pizza, Donuts, Coffee)';