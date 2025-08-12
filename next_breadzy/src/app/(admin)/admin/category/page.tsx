"use client";

import React, { useState, useEffect, useRef } from "react";
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
import { Toaster, toast } from "sonner";
import slugify from "slugify";

import type { Category } from "@/types/category";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/api/categories/get";

export default function CategoryAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [total, setTotal] = useState(0);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"createdAt" | "name">("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [inputName, setInputName] = useState("");

  // Dropdown state
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
    setLoading(true);
    try {
      const searchSlug = slugify(searchTerm, { lower: true, strict: true });
      const data = await getAllCategories(searchSlug, page, pageSize, sortBy, sortOrder);
      setCategories(data.data);
      setTotal(data.pagination?.total ?? 0);
    } catch (error) {
      toast.error("Không thể tải danh mục.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, [page, searchTerm, sortBy, sortOrder]);

  function openAddModal() {
    setEditCategory(null);
    setInputName("");
    setIsModalOpen(true);
  }

  function openEditModal(category: Category) {
    setEditCategory(category);
    setInputName(category.name);
    setIsModalOpen(true);
  }

  async function handleSave() {
    const nameTrim = inputName.trim();
    if (!nameTrim) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }
    try {
      const slug = slugify(nameTrim, { lower: true, strict: true });
      if (editCategory) {
        await updateCategory(editCategory._id, nameTrim, slug);
        toast.success("Cập nhật danh mục thành công");
      } else {
        await createCategory(nameTrim, slug);
        toast.success("Thêm danh mục thành công");
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (error) {
      toast.error("Lỗi khi lưu danh mục");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Bạn có chắc muốn xóa danh mục này không?")) return;
    try {
      await deleteCategory(id);
      toast.success("Xóa danh mục thành công");
      if ((total - 1) <= (page - 1) * pageSize && page > 1) {
        setPage(page - 1);
      } else {
        fetchCategories();
      }
    } catch (error) {
      toast.error("Lỗi khi xóa danh mục");
    }
  }

  function onSelectSort(field: "name" | "createdAt", order: "asc" | "desc") {
    setSortBy(field);
    setSortOrder(order);
    setIsSortDropdownOpen(false);
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

  return (
    <div className="p-6 bg-white shadow rounded relative">
      <Toaster position="top-right" />
      <h2 className="text-xl font-bold mb-4">Quản lý danh mục</h2>

      <div className="mb-5 flex justify-between items-center">
        <div className="flex gap-4 items-center relative" ref={dropdownRef}>
          <button
            onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
            className="border border-gray-300 p-2 w-[300px] rounded cursor-pointer select-none "
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
            placeholder="Tìm kiếm danh mục"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 p-2 rounded max-w-sm"
          />
        </div>

        <button
          className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer select-none"
          onClick={openAddModal}
        >
          Thêm danh mục
        </button>
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
          {categories.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                Không có danh mục nào.
              </TableCell>
            </TableRow>
          )}
          {categories.map((cat, i) => (
            <TableRow key={cat._id}>
              <TableCell>{(page - 1) * pageSize + i + 1}</TableCell>
              <TableCell>{cat.name}</TableCell>
              <TableCell>{new Date(cat.createdAt).toLocaleString()}</TableCell>
              <TableCell className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => openEditModal(cat)}>
                  Sửa
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(cat._id)}
                >
                  Xóa
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="mt-4 flex justify-between items-center">
        <div>Tổng: {total}</div>
        <div className="flex items-center gap-2">
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </Button>
          <span>Page {page}</span>
          <Button
            disabled={page * pageSize >= total}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editCategory ? "Sửa danh mục" : "Thêm danh mục"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">Tên danh mục</label>
              <Input
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                autoFocus
              />
            </div>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave}>{editCategory ? "Cập nhật" : "Thêm"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
