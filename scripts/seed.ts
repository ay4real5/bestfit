import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { initialProducts } from '../lib/data';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seed() {
  console.log('Seeding products...');

  for (const product of initialProducts) {
    const { error } = await supabase
      .from('products')
      .insert({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        compare_at_price: product.compareAtPrice,
        image: product.image,
        category: product.category,
        tags: product.tags,
        in_stock: product.inStock,
        inventory: product.inventory,
        featured: product.featured,
        weight: product.weight,
        servings: product.servings,
        created_at: product.createdAt,
        delivery_cost: product.deliveryCost,
      });

    if (error) {
      console.error(`Error inserting product ${product.name}:`, error);
    } else {
      console.log(`✓ Inserted: ${product.name}`);
    }
  }

  console.log('Seeding complete!');
}

seed().catch(console.error);
