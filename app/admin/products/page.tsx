"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  categories,
} from "@/lib/data";
import { Product } from "@/lib/types";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Search, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("festfit_admin")) {
      router.push("/admin/login");
    }
    setProducts(getProducts());
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

  const handleSave = () => {
    if (!form.name || !form.slug || form.price <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (editing) {
      updateProduct(form);
      toast.success("Product updated");
    } else {
      addProduct(form);
      toast.success("Product added");
    }

    setProducts(getProducts());
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
      setProducts(getProducts());
      toast.success("Product deleted");
    }
  };

  const generateSlug = (name: string) =>
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            onClick={() => router.push("/admin/dashboard")}
            className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </button>
          <h1 className="text-3xl font-bold tracking-tight">Products</h1>
          <p className="text-muted-foreground">Manage your supplement catalog</p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
          onClick={openNew}
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-md bg-slate-100">
                      <Image
                        src={product.image || "https://picsum.photos/seed/festfitadmin/40/40"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span className="font-medium">{product.name}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{product.category}</Badge>
                </TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                    {product.inventory}
                  </span>
                </TableCell>
                <TableCell>
                  {product.featured ? (
                    <Badge className="bg-primary text-white">Yes</Badge>
                  ) : (
                    <span className="text-muted-foreground">No</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(product)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
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

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
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
                <Label htmlFor="comparePrice">Compare-at Price</Label>
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
                <Label htmlFor="inventory">Inventory *</Label>
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
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={form.image}
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.value })
                  }
                  placeholder="https://..."
                />
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
              className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-slate-100 transition-colors"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
              onClick={handleSave}
            >
              {editing ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
