-- Create table for storing wedding guests (separate from existing guests table)
CREATE TABLE IF NOT EXISTS public.wedding_guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  table_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.wedding_guests ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own wedding guests" ON public.wedding_guests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wedding guests" ON public.wedding_guests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wedding guests" ON public.wedding_guests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own wedding guests" ON public.wedding_guests
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for faster searches
CREATE INDEX IF NOT EXISTS idx_wedding_guests_user_id ON public.wedding_guests(user_id);
CREATE INDEX IF NOT EXISTS idx_wedding_guests_name ON public.wedding_guests(name);
