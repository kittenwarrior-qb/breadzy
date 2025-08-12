"use client";

import React, { useEffect, useState, useRef } from "react";
import slugify from "slugify";
import { Toaster, toast } from "sonner";

import { Button } from "@/components/ui/button";
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
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

import type { Product } from "@/types/product";
import type { Category } from "@/types/category";

import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/api/products/get";

import { getAllCategories } from "@/api/categories/get";
import Link from "next/link";

export default function ProductAdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sortBy, setSortBy] = useState<"createdAt" | "name">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  // Form inputs
  const [inputName, setInputName] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [inputCategory, setInputCategory] = useState("");
  const [inputIsHot, setInputIsHot] = useState(false);

  // Dropdown state for sorting
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortDropdownOpen(false);
      }
    }
    if (isSortDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSortDropdownOpen]);

  async function fetchCategories() {
    try {
      const res = await getAllCategories();
      setCategories(res.data);
    } catch {
      toast.error("Failed to load categories.");
    }
  }

  async function fetchProducts() {
    setLoading(true);
    try {
      const slugifiedSearch = slugify(searchTerm, { lower: true, strict: true });
      const res = await getAllProducts(page, pageSize, slugifiedSearch, sortBy, sortOrder);
      setProducts(res.data);
      setTotal(res.pagination.total);
    } catch {
      toast.error("Failed to load products.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, sortBy, sortOrder]);

  function openAddModal() {
    setEditProduct(null);
    setInputName("");
    setInputDescription("");
    setInputCategory("");
    setInputIsHot(false);
    setIsModalOpen(true);
  }

  function openEditModal(product: Product) {
    setEditProduct(product);
    setInputName(product.name);
    setInputDescription(product.description);
    setInputCategory(product.category);
    setInputIsHot(!!product.isHot);
    setIsModalOpen(true);
  }

  async function handleSave() {
    if (!inputName.trim() || !inputDescription.trim() || !inputCategory) {
      toast.error("Please fill all required fields.");
      return;
    }
    const slug = slugify(inputName.trim(), { lower: true, strict: true });
    const productData: Partial<Product> = {
      name: inputName.trim(),
      description: inputDescription.trim(),
      slug,
      category: inputCategory,
      isHot: inputIsHot,
    };

    try {
      if (editProduct) {
        await updateProduct(editProduct._id, productData);
        toast.success("Product updated successfully.");
      } else {
        await createProduct(productData);
        toast.success("Product created successfully.");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch {
      toast.error(editProduct ? "Failed to update product." : "Failed to create product.");
    }
  }

  async function handleDelete(product: Product) {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;
    try {
      await deleteProduct(product._id);
      toast.success("Product deleted.");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product.");
    }
  }

  // Mô tả hiển thị cho sort hiện tại
  function getSortLabel() {
    if (sortBy === "createdAt") {
      return sortOrder === "asc" ? "Cũ nhất" : "Mới nhất";
    }
    if (sortBy === "name") {
      return sortOrder === "asc" ? "Từ A-Z" : "Từ Z-A";
    }
    return "";
  }

  function onSelectSort(field: "name" | "createdAt", order: "asc" | "desc") {
    setSortBy(field);
    setSortOrder(order);
    setIsSortDropdownOpen(false);
  }

  return (
    <div className="p-6 bg-white shadow rounded">
      <Toaster position="top-right" />
      <h2 className="text-xl font-bold mb-4">Quản lý sản phẩm</h2>

      <div className="mb-5 flex justify-between items-center">
        <div className="flex gap-4 items-center relative" ref={dropdownRef}>
          <button
            className="border border-gray-300 p-2 w-[300px] rounded cursor-pointer select-none"
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            type="button"
            aria-haspopup="listbox"
            aria-expanded={isSortDropdownOpen}
          >
            Sắp xếp theo: {getSortLabel()}
          </button>
          {isSortDropdownOpen && (
            <ul
              className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded shadow-md z-10"
              role="listbox"
              tabIndex={-1}
            >
              <li
                className={`p-2 cursor-pointer hover:bg-gray-100 ${
                  sortBy === "createdAt" && sortOrder === "desc" ? "font-semibold" : ""
                }`}
                onClick={() => onSelectSort("createdAt", "desc")}
                role="option"
                aria-selected={sortBy === "createdAt" && sortOrder === "desc"}
              >
                Mới nhất
              </li>
              <li
                className={`p-2 cursor-pointer hover:bg-gray-100 ${
                  sortBy === "createdAt" && sortOrder === "asc" ? "font-semibold" : ""
                }`}
                onClick={() => onSelectSort("createdAt", "asc")}
                role="option"
                aria-selected={sortBy === "createdAt" && sortOrder === "asc"}
              >
                Cũ nhất
              </li>
              <li
                className={`p-2 cursor-pointer hover:bg-gray-100 ${
                  sortBy === "name" && sortOrder === "asc" ? "font-semibold" : ""
                }`}
                onClick={() => onSelectSort("name", "asc")}
                role="option"
                aria-selected={sortBy === "name" && sortOrder === "asc"}
              >
                Từ A-Z
              </li>
              <li
                className={`p-2 cursor-pointer hover:bg-gray-100 ${
                  sortBy === "name" && sortOrder === "desc" ? "font-semibold" : ""
                }`}
                onClick={() => onSelectSort("name", "desc")}
                role="option"
                aria-selected={sortBy === "name" && sortOrder === "desc"}
              >
                Từ Z-A
              </li>
            </ul>
          )}

          <Input
            type="text"
            placeholder="Tìm kiếm sản phẩm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 rounded max-w-sm"
          />
        </div>

        <Button
          className="px-4 py-2 bg-blue-600 text-white rounded"
          onClick={openAddModal}
        >
          Thêm sản phẩm
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => {
                if (sortBy === "name") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("name");
                  setSortOrder("asc");
                }
              }}
            >
              Tên {sortBy === "name" ? (sortOrder === "asc" ? "(A-Z)" : "(Z-A)") : ""}
            </TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead>Bán chạy</TableHead>
            <TableHead
              className="cursor-pointer select-none"
              onClick={() => {
                if (sortBy === "createdAt") {
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                } else {
                  setSortBy("createdAt");
                  setSortOrder("desc");
                }
              }}
            >
              Ngày tạo {sortBy === "createdAt" ? (sortOrder === "asc" ? "(Cũ nhất)" : "(Mới nhất)") : ""}
            </TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                Không có sản phẩm nào.
              </TableCell>
            </TableRow>
          )}
          {products.map((p, i) => (
            <TableRow key={p._id}>
              <TableCell>{(page - 1) * pageSize + i + 1}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell className="max-w-[200px] truncate">{p.description}</TableCell>
              <TableCell>{p.slug}</TableCell>
              <TableCell>{p.category}</TableCell>
              <TableCell>{p.isHot ? "Có" : ""}</TableCell>
              <TableCell>{new Date(p.createdAt).toLocaleString()}</TableCell>
              <TableCell className="flex gap-2 items-center">
                <Button variant="outline"><Link href={`/admin/variant/${p.slug}`}>Xem biến thể</Link></Button>
                <Button variant="outline" size="sm" onClick={() => openEditModal(p)}>Sửa</Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(p)}>Xóa</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <div>Tổng: {total}</div>
        <div className="flex items-center gap-2">
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</Button>
          <span>Page {page}</span>
          <Button disabled={page * pageSize >= total} onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      </div>

      {/* Modal Add/Edit */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => setIsModalOpen(!!open)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">Tên sản phẩm</label>
              <Input
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                autoFocus
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Mô tả</label>
              <textarea
                value={inputDescription}
                onChange={(e) => setInputDescription(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                rows={3}
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Danh mục</label>
              <Select value={inputCategory} onValueChange={setInputCategory}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.slug} value={cat.slug}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <label className="font-semibold">Sản phẩm hot?</label>
              <Switch checked={inputIsHot} onCheckedChange={setInputIsHot} />
            </div>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Hủy</Button>
            <Button onClick={handleSave}>{editProduct ? "Cập nhật" : "Thêm"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
