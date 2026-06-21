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

-- Create storage bucket for products if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'];

-- Allow public access to product images
CREATE POLICY "Allow public access to product images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'products');

-- Allow service role to upload product images
CREATE POLICY "Allow service role uploads to products"
  ON storage.objects FOR INSERT
  TO service_role
  WITH CHECK (bucket_id = 'products');

-- Allow service role to update/delete product images
CREATE POLICY "Allow service role updates to products"
  ON storage.objects FOR UPDATE
  TO service_role
  USING (bucket_id = 'products');

CREATE POLICY "Allow service role deletes to products"
  ON storage.objects FOR DELETE
  TO service_role
  USING (bucket_id = 'products');

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
