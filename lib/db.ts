import { Product } from "./types";
import { supabaseAdmin } from "./supabase";

export async function readProducts(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

export async function getProductById(id: string): Promise<Product | undefined> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching product by id:', error);
    return undefined;
  }

  return data;
}

export async function getProductBySlugDb(slug: string): Promise<Product | undefined> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error fetching product by slug:', error);
    return undefined;
  }

  return data;
}

export async function getFeaturedProductsDb(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return data || [];
}

export async function getProductsByCategoryDb(category: string): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from('products')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }

  return data || [];
}

export async function addProductDb(product: Product): Promise<void> {
  const { error } = await supabaseAdmin
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
    console.error('Error adding product:', error);
    throw error;
  }
}

export async function updateProductDb(updated: Product): Promise<void> {
  const { error } = await supabaseAdmin
    .from('products')
    .update({
      name: updated.name,
      slug: updated.slug,
      description: updated.description,
      price: updated.price,
      compare_at_price: updated.compareAtPrice,
      image: updated.image,
      category: updated.category,
      tags: updated.tags,
      in_stock: updated.inStock,
      inventory: updated.inventory,
      featured: updated.featured,
      weight: updated.weight,
      servings: updated.servings,
      delivery_cost: updated.deliveryCost,
    })
    .eq('id', updated.id);

  if (error) {
    console.error('Error updating product:', error);
    throw error;
  }
}

export async function deleteProductDb(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
}
