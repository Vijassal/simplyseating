-- Add music-related fields to app_settings table
ALTER TABLE public.app_settings 
ADD COLUMN IF NOT EXISTS background_music_url TEXT,
ADD COLUMN IF NOT EXISTS background_music_enabled BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS background_music_volume INTEGER DEFAULT 25,
ADD COLUMN IF NOT EXISTS background_music_autoplay BOOLEAN DEFAULT true;
