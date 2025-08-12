"use client";

import React, { useEffect, useState } from "react";
import slugify from "slugify";
import { Toaster, toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

import type { Variant } from "@/types/variant";
import {
  getVariantsByProductSlug,
  createVariant,
  updateVariant,
  deleteVariant,
} from "@/api/variants/get";

interface Pagination {
  total: number;
  page: number;
  pageSize: number;
  totalPages?: number;
}

export default function AdminVariantPage({ params }: { params: Promise<{ productSlug: string }> }) {
  const resolvedParams = React.use(params);
  const productSlug = resolvedParams.productSlug;

  const [variants, setVariants] = useState<Variant[]>([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<keyof Variant>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    pageSize,
  });

  // Modal state for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVariant, setEditVariant] = useState<Variant | null>(null);

  // Form state
  const [inputName, setInputName] = useState("");
  const [inputPrice, setInputPrice] = useState<number | "">("");
  const [inputGallery, setInputGallery] = useState<string[]>([]);

  // Preview modal state
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // --- Fetch variants for this productSlug
  async function fetchVariants() {
    if (!productSlug || productSlug.length < 3) {
      toast.error("Product slug không hợp lệ");
      setVariants([]);
      setPagination((p) => ({ ...p, total: 0 }));
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await getVariantsByProductSlug(productSlug);
      let filtered = res.data || [];

      // Client-side filter search
      if (searchTerm.trim()) {
        filtered = filtered.filter((v) =>
          v.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Client-side sort
      filtered.sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];

        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortOrder === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        }
        // Handle string dates if createdAt is string
        if (
          typeof aVal === "string" &&
          typeof bVal === "string" &&
          !isNaN(Date.parse(aVal)) &&
          !isNaN(Date.parse(bVal))
        ) {
          return sortOrder === "asc"
            ? new Date(aVal).getTime() - new Date(bVal).getTime()
            : new Date(bVal).getTime() - new Date(aVal).getTime();
        }
        return 0;
      });

      // Pagination on client side
      setPagination((p) => ({ ...p, total: filtered.length, page }));
      const start = (page - 1) * pageSize;
      setVariants(filtered.slice(start, start + pageSize));
    } catch (error) {
      console.error(error);
      toast.error("Lỗi tải danh sách biến thể");
    } finally {
      setLoading(false);
    }
  }

  // --- Effect reload data khi đổi page, tìm kiếm, sort, productSlug
  useEffect(() => {
    fetchVariants();
  }, [page, searchTerm, sortBy, sortOrder, productSlug]);

  // --- Mở modal thêm mới
  function openAddModal() {
    setEditVariant(null);
    setInputName("");
    setInputPrice("");
    setInputGallery([]);
    setIsModalOpen(true);
  }

  // --- Mở modal sửa
  function openEditModal(v: Variant) {
    setEditVariant(v);
    setInputName(v.name);
    setInputPrice(v.price);
    setInputGallery(v.gallery || []);
    setIsModalOpen(true);
  }

  // --- Lưu (thêm hoặc cập nhật)
  async function handleSave() {
    if (!inputName.trim()) {
      toast.error("Vui lòng nhập tên biến thể.");
      return;
    }
    if (inputPrice === "" || Number(inputPrice) <= 0) {
      toast.error("Vui lòng nhập giá hợp lệ.");
      return;
    }

    const slug = slugify(inputName.trim(), { lower: true, strict: true });

    const variantData: Partial<Variant> = {
      name: inputName.trim(),
      slug,
      price: Number(inputPrice),
      gallery: inputGallery,
      productSlug,
    };

    try {
      if (editVariant) {
        await updateVariant(editVariant._id!, variantData);
        toast.success("Cập nhật biến thể thành công.");
      } else {
        await createVariant(variantData);
        toast.success("Thêm biến thể thành công.");
      }
      setIsModalOpen(false);
      setPage(1); // Reset page to 1 after changes
      fetchVariants();
    } catch (error) {
      console.error(error);
      toast.error(editVariant ? "Cập nhật thất bại." : "Thêm thất bại.");
    }
  }

  // --- Xóa biến thể
  async function handleDelete(variant: Variant) {
    if (!confirm(`Bạn có chắc muốn xóa biến thể "${variant.name}"?`)) return;
    try {
      await deleteVariant(variant._id!);
      toast.success("Xóa biến thể thành công.");
      fetchVariants();
    } catch (error) {
      console.error(error);
      toast.error("Xóa biến thể thất bại.");
    }
  }

  // --- Upload ảnh demo (chuyển file thành base64)
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const promises = Array.from(files).map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (reader.result) resolve(reader.result.toString());
            else reject("Failed to read file");
          };
          reader.onerror = () => reject("Failed to read file");
          reader.readAsDataURL(file);
        })
    );

    try {
      const images = await Promise.all(promises);
      setInputGallery((prev) => [...prev, ...images]);
      toast.success("Upload ảnh thành công (demo).");
    } catch (error) {
      console.error(error);
      toast.error("Upload ảnh thất bại.");
    }
  }

  // --- Xóa ảnh khỏi gallery trong form
  function removeImage(idx: number) {
    setInputGallery((prev) => prev.filter((_, i) => i !== idx));
  }

  return (
    <div className="p-6 bg-white rounded shadow">
      <Toaster position="top-right" />
      <h2 className="text-xl font-bold mb-5">Quản lý biến thể của: {productSlug}</h2>

      <div className="flex justify-between items-center mb-5">
        <div className="flex gap-3 items-center">
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split("-");
              setSortBy(field as keyof Variant);
              setSortOrder(order as "asc" | "desc");
            }}
            className="border border-gray-300 rounded p-2"
          >
            <option value="name-asc">Theo bảng chữ cái (A - Z)</option>
            <option value="name-desc">Theo bảng chữ cái (Z - A)</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
            <option value="createdAt-desc">Mới nhất</option>
            <option value="createdAt-asc">Cũ nhất</option>
          </select>

          <Input
            placeholder="Tìm kiếm biến thể"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />

          <Button onClick={() => setPage(1)}>Tìm kiếm</Button>
        </div>

        <Button onClick={openAddModal}>Thêm biến thể</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Tên biến thể</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Hình ảnh</TableHead>
            <TableHead>Giá</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead>Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variants.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Không có biến thể nào.
              </TableCell>
            </TableRow>
          ) : (
            variants.map((v, i) => (
              <TableRow key={v._id}>
                <TableCell>{(page - 1) * pageSize + i + 1}</TableCell>
                <TableCell>{v.name}</TableCell>
                <TableCell>{v.slug}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {v.gallery?.map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt={`Gallery ${i}`}
                        width={40}
                        height={40}
                        className="rounded border shadow cursor-pointer"
                        onClick={() => setPreviewImage(img)}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {v.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                </TableCell>
                <TableCell>{new Date(v.createdAt).toLocaleString()}</TableCell>
                <TableCell className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditModal(v)}>
                    Sửa
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(v)}>
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <div>Tổng: {pagination.total}</div>
        <div className="flex items-center gap-2">
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </Button>
          <span>Page {page}</span>
          <Button
            disabled={page * pageSize >= pagination.total}
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Modal Add/Edit Variant */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editVariant ? "Chỉnh sửa biến thể" : "Thêm biến thể mới"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">Tên biến thể</label>
              <Input
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                autoFocus
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Giá</label>
              <Input
                type="number"
                value={inputPrice}
                onChange={(e) => {
                  const val = e.target.value;
                  setInputPrice(val === "" ? "" : Number(val));
                }}
                min={0}
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold">Hình ảnh</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="mb-2"
              />
              <div className="flex gap-2 flex-wrap">
                {inputGallery.map((img, idx) => (
                  <div key={idx} className="relative inline-block">
                    <img
                      src={img}
                      alt={`Hình ${idx}`}
                      width={60}
                      height={60}
                      className="rounded border"
                      style={{ objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-700"
                      aria-label="Xóa hình"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave}>{editVariant ? "Cập nhật" : "Thêm"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview image modal */}
      {previewImage && (
        <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
          <DialogContent className="max-w-lg p-0">
            <img src={previewImage} alt="Preview" className="w-full h-auto rounded" />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
