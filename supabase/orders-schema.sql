-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  delivery_cost NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  address TEXT,
  city TEXT,
  phone TEXT NOT NULL,
  delivery_method TEXT NOT NULL DEFAULT 'delivery',
  payment_method TEXT NOT NULL DEFAULT 'bank_transfer',
  proof_of_payment TEXT,
  payment_reference TEXT,
  discount NUMERIC DEFAULT 0,
  promo_code TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index on customer email for order lookups
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);

-- Create index on status for admin filtering
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access (for customer order history)
CREATE POLICY "Allow public read access on orders"
  ON orders FOR SELECT
  TO anon, authenticated
  USING (true);

-- Allow service role full access (for admin operations)
CREATE POLICY "Allow service role full access on orders"
  ON orders FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
