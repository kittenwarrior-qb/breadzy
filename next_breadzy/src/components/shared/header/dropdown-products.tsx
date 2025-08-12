"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllProducts } from "@/api/products/get";
import { getVariantsByProductSlug } from "@/api/variants/get";
import Link from "next/link";
import type { Product } from "@/types/product";
import type { Variant } from "@/types/variant";


export function DropdownProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [variantsMap, setVariantsMap] = useState<Record<string, Variant[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAllProducts();
        const productList = res.data;
        setProducts(productList);

        const map: Record<string, Variant[]> = {};

        await Promise.all(
          productList.map(async (product) => {
            try {
              const res = await getVariantsByProductSlug(product.slug);
              map[product._id] = Array.isArray(res.data) ? res.data : [];
            } catch {
              map[product._id] = [];
            }
          })
        );

        setVariantsMap(map);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy sản phẩm hoặc biến thể:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1">
          SẢN PHẨM <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2">
        {loading && <DropdownMenuItem>Đang tải...</DropdownMenuItem>}
        {!loading &&
          products.map((product) => (
            <DropdownMenuSub key={product._id}>
              <DropdownMenuSubTrigger className="justify-between">
                <span>{product.name}</span>
                <span className="text-xs text-muted-foreground">
                  ({variantsMap[product._id]?.length || 0})
                </span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {variantsMap[product._id]?.length > 0 ? (
                  variantsMap[product._id].map((variant) => (
                    <DropdownMenuItem asChild key={variant._id}>
                      <Link
                        href={`/product/${product.category}/${product.slug}/${variant.slug}`}
                        className="w-full"
                      >
                        {variant.name}
                      </Link>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>Không có biến thể</DropdownMenuItem>
                )}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
