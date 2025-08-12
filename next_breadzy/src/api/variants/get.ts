import type { Variant } from "@/types/variant";
import type { Product } from "@/types/product";
import { Pagination } from "@/types/pagination";

interface VariantsResponse {
  data: Variant[];
  msg: string;
  pagination: Pagination;
}

interface FirstVariantsFromProducts {
  data: {
    product: Product;
    variant: Variant;
  }[];
  msg: string;
  pagination: Pagination;
}

interface SingleVariantResponse {
  data: Variant;
  msg: string;
}

export const getVariantsByProductSlug = async (slug: string): Promise<VariantsResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/variants/product/${slug}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getFirstVariantsFromProducts = async (): Promise<FirstVariantsFromProducts> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/variants/get-first-variant`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getAllVariants = async (
  page = 1,
  pageSize = 12,
  search = ""
): Promise<VariantsResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
      search: search,
    });

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/variants?${params.toString()}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    const json = await res.json();
    return json;
  } catch (err) {
    console.error("Failed to fetch variants", err);
    throw err;
  }
};

// Thêm variant mới
export const createVariant = async (variant: Partial<Variant>): Promise<SingleVariantResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/variants`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(variant),
    });
    if (!res.ok) throw new Error("Failed to create variant");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Cập nhật variant theo id
export const updateVariant = async (id: string, variant: Partial<Variant>): Promise<SingleVariantResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/variants/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(variant),
    });
    if (!res.ok) throw new Error("Failed to update variant");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Xóa variant theo id
export const deleteVariant = async (id: string): Promise<{ msg: string }> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/variants/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete variant");
    return await res.json();
  } catch (err) {
    console.error(err);
    throw err;
  }
};
