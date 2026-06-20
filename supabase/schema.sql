-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  compare_at_price NUMERIC,
  image TEXT,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  in_stock BOOLEAN DEFAULT true,
  inventory INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT false,
  weight TEXT,
  servings INTEGER,
  created_at TEXT NOT NULL,
  delivery_cost NUMERIC DEFAULT 0
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);

-- Create index on featured for homepage
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);

-- Enable RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for client-side queries)
CREATE POLICY "Allow public read access on products"
  ON products FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow service role full access (for admin operations)
CREATE POLICY "Allow service role full access on products"
  ON products FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
