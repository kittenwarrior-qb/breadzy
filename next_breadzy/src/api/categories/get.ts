import type { Category } from "@/types/category";
import { Pagination } from "@/types/pagination";

interface CategoryResponse {
  data: Category[],
  msg: string,
  pagination?: Pagination
}

interface SingleCategoryResponse {
  data: Category;
  msg: string;
}

export const getAllCategories = async (
  search = "",
  page = 1,
  pageSize = 10,
  sortBy: "createdAt" | "name" = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
): Promise<CategoryResponse> => {
  const params = new URLSearchParams({
    search,
    page: page.toString(),
    pageSize: pageSize.toString(),
    sortBy,
    sortOrder,
  });

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
};

export const getCategoryBySlug = async (slug: string): Promise<SingleCategoryResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/slug/${slug}`);
  if (!res.ok) throw new Error("Failed to fetch category by slug");
  return res.json();
};

export const createCategory = async (name: string, slug: string): Promise<SingleCategoryResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, slug }),
  });
  if (!res.ok) throw new Error("Failed to create category");
  return res.json();
};

export const updateCategory = async (id: string, name: string, slug: string): Promise<SingleCategoryResponse> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, slug }),
  });
  if (!res.ok) throw new Error("Failed to update category");
  return res.json();
};

export const deleteCategory = async (id: string): Promise<{ msg: string }> => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete category");
  return res.json();
};
