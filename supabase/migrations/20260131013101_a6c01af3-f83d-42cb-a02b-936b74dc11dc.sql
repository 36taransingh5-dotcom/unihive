-- Add tags column to events table for Smart Tag Engine
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}'::TEXT[];