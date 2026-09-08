CREATE TABLE public.word_drafts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  parola text NOT NULL,
  categoria text NOT NULL,
  difficolta text NOT NULL DEFAULT 'media',
  indizi text[] NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  environment text NOT NULL DEFAULT 'staging',
  model text,
  validation_note text,
  batch_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT word_drafts_status_check CHECK (status IN ('draft','approved','rejected')),
  CONSTRAINT word_drafts_difficolta_check CHECK (difficolta IN ('facile','media','difficile')),
  CONSTRAINT word_drafts_env_check CHECK (environment IN ('staging','dev'))
);

CREATE UNIQUE INDEX word_drafts_unique_parola ON public.word_drafts (categoria, lower(parola));
CREATE INDEX word_drafts_status_idx ON public.word_drafts (status, categoria);

GRANT SELECT ON public.word_drafts TO anon, authenticated;
GRANT ALL ON public.word_drafts TO service_role;

ALTER TABLE public.word_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "word_drafts_public_read" ON public.word_drafts FOR SELECT TO anon, authenticated USING (true);

CREATE OR REPLACE FUNCTION public.word_drafts_touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER word_drafts_updated_at
BEFORE UPDATE ON public.word_drafts
FOR EACH ROW EXECUTE FUNCTION public.word_drafts_touch_updated_at();