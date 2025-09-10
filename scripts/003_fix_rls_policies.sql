-- Disable RLS for app_settings table to allow public access
ALTER TABLE app_settings DISABLE ROW LEVEL SECURITY;

-- Disable RLS for wedding_guests table to allow public access  
ALTER TABLE wedding_guests DISABLE ROW LEVEL SECURITY;

-- Alternatively, if you want to keep RLS enabled but allow public access:
-- ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Allow all operations on app_settings" ON app_settings FOR ALL USING (true) WITH CHECK (true);

-- ALTER TABLE wedding_guests ENABLE ROW LEVEL SECURITY;  
-- CREATE POLICY "Allow all operations on wedding_guests" ON wedding_guests FOR ALL USING (true) WITH CHECK (true);
