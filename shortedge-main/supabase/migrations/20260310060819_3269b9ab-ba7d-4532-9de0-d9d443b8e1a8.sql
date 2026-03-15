
-- Create links table
CREATE TABLE public.links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  original_url text NOT NULL,
  short_code text NOT NULL UNIQUE,
  custom_alias text,
  clicks integer NOT NULL DEFAULT 0,
  last_accessed_at timestamp with time zone,
  expires_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index on short_code for fast lookups
CREATE INDEX idx_links_short_code ON public.links(short_code);
CREATE INDEX idx_links_user_id ON public.links(user_id);

-- Enable RLS
ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- Policy: users can manage their own links
CREATE POLICY "Users can manage their own links"
  ON public.links
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: anyone can read links for redirect (public read by short_code)
CREATE POLICY "Anyone can read links by short_code"
  ON public.links
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create click_events table for analytics
CREATE TABLE public.click_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id uuid NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  clicked_at timestamp with time zone NOT NULL DEFAULT now(),
  country text,
  device text,
  referrer text,
  user_agent text
);

CREATE INDEX idx_click_events_link_id ON public.click_events(link_id);
CREATE INDEX idx_click_events_clicked_at ON public.click_events(clicked_at);

ALTER TABLE public.click_events ENABLE ROW LEVEL SECURITY;

-- Anyone can insert click events (for redirect tracking)
CREATE POLICY "Anyone can insert click events"
  ON public.click_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Link owners can read their click events
CREATE POLICY "Link owners can read click events"
  ON public.click_events
  FOR SELECT
  TO authenticated
  USING (
    link_id IN (SELECT id FROM public.links WHERE user_id = auth.uid())
  );

-- Update the link_tags foreign key to reference links table
-- Update updated_at trigger for links
CREATE TRIGGER update_links_updated_at
  BEFORE UPDATE ON public.links
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
