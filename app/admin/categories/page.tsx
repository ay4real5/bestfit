"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, Pencil, Trash2, Tags } from "lucide-react";

export default function AdminCategoriesPage() {
  const router = useRouter();
  const [cats, setCats] = useState<string[]>(categories);
  const [search, setSearch] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editValue, setEditValue] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("festfit_admin")) {
      router.push("/admin/login");
    }
  }, [router]);

  const filtered = cats.filter((c) =>
    c.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!newCategory.trim()) return;
    if (cats.includes(newCategory.trim())) return;
    setCats([...cats, newCategory.trim()]);
    setNewCategory("");
    setOpenAdd(false);
  };

  const handleEdit = () => {
    if (!editValue.trim()) return;
    setCats(cats.map((c) => (c === editCategory ? editValue.trim() : c)));
    setEditValue("");
    setOpenEdit(false);
  };

  const handleDelete = (cat: string) => {
    if (confirm(`Delete category "${cat}"?`)) {
      setCats(cats.filter((c) => c !== cat));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 md:px-6">
      <div className="mb-8">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="mb-2 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </button>
        <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">Manage product categories</p>
      </div>

      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Tags className="h-5 w-5" /> All Categories
          </CardTitle>
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger>
              <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" /> Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <Input
                  placeholder="Category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
                  onClick={handleAdd}
                >
                  Create Category
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((cat) => (
                  <TableRow key={cat}>
                    <TableCell>
                      <Badge variant="secondary">{cat}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-slate-100 transition-colors"
                          onClick={() => {
                            setEditCategory(cat);
                            setEditValue(cat);
                            setOpenEdit(true);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-md text-destructive hover:bg-slate-100 transition-colors"
                          onClick={() => handleDelete(cat)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-8 text-muted-foreground">
                      No categories found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Category name"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
            />
            <button
              type="button"
              className="w-full inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 transition-colors"
              onClick={handleEdit}
            >
              Save Changes
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
