"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { categories } from "@/lib/data";
import { Product } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Search, ArrowLeft, Upload, X } from "lucide-react";
import { formatPrice } from "@/lib/currency";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("festfit_admin")) {
      router.push("/admin/login");
    }
    fetchProducts();
  }, [router]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const emptyProduct: Product = {
    id: "",
    name: "",
    slug: "",
    description: "",
    price: 0,
    image: "",
    category: categories[0],
    tags: [],
    inStock: true,
    inventory: 0,
    featured: false,
    createdAt: new Date().toISOString().split("T")[0],
    deliveryCost: 0,
  };

  const [form, setForm] = useState<Product>(emptyProduct);

  const openNew = () => {
    setEditing(null);
    setForm({ ...emptyProduct, id: Date.now().toString() });
    setDialogOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({ ...product });
    setDialogOpen(true);
  };

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.name || !form.slug || form.price <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/products/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to update product");
        toast.success("Product updated");
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Failed to add product");
        toast.success("Product added");
      }

      await fetchProducts();
      setDialogOpen(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Failed to delete product");
        await fetchProducts();
        toast.success("Product deleted");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete product");
      }
    }
  };

  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const { url } = await res.json();
      setForm({ ...form, image: url });
      toast.success("Image uploaded");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </button>
          <h1 className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">Products</h1>
          <p className="mt-2 text-stone-500">Manage your supplement catalog</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
          onClick={openNew}
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl border-stone-200 pl-9"
        />
      </div>

      <div className="rounded-2xl border border-stone-100 bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-stone-50 hover:bg-stone-50">
              <TableHead className="text-stone-700">Product</TableHead>
              <TableHead className="text-stone-700">Category</TableHead>
              <TableHead className="text-stone-700">Price</TableHead>
              <TableHead className="text-stone-700">Delivery</TableHead>
              <TableHead className="text-stone-700">Stock</TableHead>
              <TableHead className="text-stone-700">Featured</TableHead>
              <TableHead className="text-right text-stone-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product) => (
              <TableRow key={product.id} className="hover:bg-stone-50/50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-lg bg-stone-100">
                      <Image
                        src={product.image || "https://picsum.photos/seed/festfitadmin/40/40"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium text-stone-900">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">{product.category}</span>
                </TableCell>
                <TableCell className="font-medium text-stone-900">{formatPrice(product.price)}</TableCell>
                <TableCell className="text-stone-600">{formatPrice(product.deliveryCost ?? 0)}</TableCell>
                <TableCell>
                  <span className={product.inStock ? "text-emerald-600 font-medium" : "text-red-500 font-medium"}>
                    {product.inventory}
                  </span>
                </TableCell>
                <TableCell>
                  {product.featured ? (
                    <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">Yes</span>
                  ) : (
                    <span className="text-stone-400">No</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
                      onClick={() => openEdit(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-stone-400">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit Product" : "Add New Product"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to {editing ? "update" : "add"} a supplement.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                      slug: generateSlug(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={form.slug}
                  onChange={(e) =>
                    setForm({ ...form, slug: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="comparePrice">Compare-at ($)</Label>
                <Input
                  id="comparePrice"
                  type="number"
                  step="0.01"
                  value={form.compareAtPrice || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      compareAtPrice: e.target.value
                        ? parseFloat(e.target.value)
                        : undefined,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="inventory">Stock *</Label>
                <Input
                  id="inventory"
                  type="number"
                  value={form.inventory}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      inventory: parseInt(e.target.value) || 0,
                      inStock: (parseInt(e.target.value) || 0) > 0,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deliveryCost">Delivery Cost ($)</Label>
                <Input
                  id="deliveryCost"
                  type="number"
                  step="0.01"
                  value={form.deliveryCost}
                  onChange={(e) =>
                    setForm({ ...form, deliveryCost: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={form.category}
                  onValueChange={(v) => setForm({ ...form, category: v ?? "" })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Product Image</Label>
                <div className="space-y-3">
                  {form.image && (
                    <div className="relative inline-block">
                      <div className="relative h-24 w-24 overflow-hidden rounded-xl border border-stone-200 bg-stone-50">
                        <Image
                          src={form.image}
                          alt="Preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600"
                        onClick={() => setForm({ ...form, image: "" })}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  <label
                    htmlFor="imageUpload"
                    className={`flex items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-3 text-sm font-medium transition-colors ${
                      uploading
                        ? "border-stone-300 bg-stone-100 text-stone-400 cursor-wait"
                        : "border-stone-200 bg-stone-50 text-stone-500 cursor-pointer hover:border-primary hover:bg-primary/5 hover:text-primary"
                    }`}
                  >
                    <Upload className={`h-4 w-4 ${uploading ? "animate-pulse" : ""}`} />
                    {uploading ? "Uploading..." : form.image ? "Change image" : "Upload image"}
                  </label>
                  <input
                    id="imageUpload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploading}
                    onChange={handleImageUpload}
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-stone-400">or</span>
                    <Input
                      id="image"
                      value={form.image}
                      onChange={(e) =>
                        setForm({ ...form, image: e.target.value })
                      }
                      placeholder="Paste image URL..."
                      className="text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="weight">Weight / Size</Label>
                <Input
                  id="weight"
                  value={form.weight || ""}
                  onChange={(e) =>
                    setForm({ ...form, weight: e.target.value })
                  }
                  placeholder="e.g. 2kg, 60 capsules"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="servings">Servings</Label>
                <Input
                  id="servings"
                  type="number"
                  value={form.servings || ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      servings: e.target.value
                        ? parseInt(e.target.value)
                        : undefined,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="featured"
                  checked={form.featured}
                  onCheckedChange={(checked: boolean) =>
                    setForm({ ...form, featured: checked })
                  }
                />
                <Label htmlFor="featured">Featured on homepage</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="inline-flex items-center rounded-full border border-stone-200 px-5 py-2.5 text-sm font-medium text-stone-600 transition-all hover:bg-stone-50"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
              onClick={handleSave}
            >
              {saving ? "Saving..." : editing ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
