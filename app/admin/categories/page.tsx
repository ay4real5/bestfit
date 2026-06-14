"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/lib/data";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
      <div className="mb-10">
        <button
          onClick={() => router.push("/admin/dashboard")}
          className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </button>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl">Categories</h1>
        <p className="mt-2 text-stone-500">Manage product categories</p>
      </div>

      <div className="rounded-2xl border border-stone-100 bg-white p-6 mb-6">
        <div className="flex flex-row items-center justify-between mb-5">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-stone-900">
            <Tags className="h-5 w-5 text-primary" /> All Categories
          </h3>
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90">
              <Plus className="h-4 w-4" /> Add Category
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
                  className="rounded-xl border-stone-200"
                />
                <button
                  type="button"
                  className="w-full inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
                  onClick={handleAdd}
                >
                  Create Category
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="mb-4">
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-xl border-stone-200"
          />
        </div>
        <div className="rounded-xl border border-stone-100 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-stone-50 hover:bg-stone-50">
                <TableHead className="text-stone-700">Name</TableHead>
                <TableHead className="text-right text-stone-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((cat) => (
                <TableRow key={cat} className="hover:bg-stone-50/50">
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">{cat}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-700"
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
                        className="flex h-8 w-8 items-center justify-center rounded-full text-red-400 transition-colors hover:bg-red-50 hover:text-red-600"
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
                  <TableCell colSpan={2} className="text-center py-8 text-stone-400">
                    No categories found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

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
              className="rounded-xl border-stone-200"
            />
            <button
              type="button"
              className="w-full inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary/90"
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
