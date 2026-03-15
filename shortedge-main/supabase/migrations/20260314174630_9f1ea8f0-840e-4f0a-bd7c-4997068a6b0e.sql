
-- Sanitize all existing short_codes: lowercase, replace dots/spaces/invalid chars with hyphens, trim trailing hyphens
UPDATE public.links
SET short_code = TRIM(BOTH '-' FROM LOWER(REGEXP_REPLACE(REGEXP_REPLACE(short_code, '[^a-zA-Z0-9-]', '-', 'g'), '-+', '-', 'g'))),
    custom_alias = CASE 
      WHEN custom_alias IS NOT NULL THEN TRIM(BOTH '-' FROM LOWER(REGEXP_REPLACE(REGEXP_REPLACE(custom_alias, '[^a-zA-Z0-9-]', '-', 'g'), '-+', '-', 'g')))
      ELSE NULL
    END
WHERE short_code ~ '[^a-z0-9-]' OR (custom_alias IS NOT NULL AND custom_alias ~ '[^a-z0-9-]');
