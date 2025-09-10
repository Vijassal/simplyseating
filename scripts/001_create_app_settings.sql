-- Create table for storing wedding app customization settings
CREATE TABLE IF NOT EXISTS public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Find Your Table Assignment',
  subtitle TEXT DEFAULT 'Begin typing your full name in the search field above',
  title_font TEXT DEFAULT 'font-serif',
  subtitle_font TEXT DEFAULT 'font-sans',
  title_background_opacity INTEGER DEFAULT 50,
  subtitle_background_opacity INTEGER DEFAULT 50,
  background_image TEXT,
  background_size TEXT DEFAULT 'cover',
  background_position TEXT DEFAULT 'center',
  background_opacity INTEGER DEFAULT 50,
  table_card_background_image TEXT,
  table_card_background_size TEXT DEFAULT 'cover',
  table_card_background_position TEXT DEFAULT 'center',
  table_card_background_opacity INTEGER DEFAULT 50,
  table_card_icon_color TEXT DEFAULT '#64748b',
  table_card_header_text TEXT DEFAULT 'Your Table Assignment',
  table_card_subtext TEXT DEFAULT 'You are seated at:',
  table_card_table_prefix TEXT DEFAULT 'Table',
  table_card_celebration_message TEXT DEFAULT 'We look forward to celebrating with you!',
  table_card_header_color TEXT DEFAULT '#1e293b',
  table_card_table_number_color TEXT DEFAULT '#1e293b',
  table_card_subtext_color TEXT DEFAULT '#64748b',
  table_card_celebration_text_color TEXT DEFAULT '#64748b',
  table_card_celebration_box_opacity INTEGER DEFAULT 20,
  table_card_table_number_box_opacity INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own app settings" ON public.app_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own app settings" ON public.app_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own app settings" ON public.app_settings
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own app settings" ON public.app_settings
  FOR DELETE USING (auth.uid() = user_id);
