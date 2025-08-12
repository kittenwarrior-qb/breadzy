// src/components/ProductCard.tsx

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

type Product = {
  _id: string;
  name: string;
  slug: string;
  category: string;
};

type Variant = {
  price: number;
  slug: string;
  gallery: string[];
};

interface ProductCardProps {
  product: Product;
  variant: Variant;
}

export default function ProductCard({ product, variant }: ProductCardProps) {
  const detailHref = `/product/${product.category}/${product.slug}/${variant.slug}`;

  return (
    <Card className="overflow-hidden p-0 hover:shadow-lg transition duration-200 cursor-pointer">
      <CardContent className="px-0">
        <Link href={detailHref} className="flex flex-col items-center">
          {variant.gallery?.[0] && (
            <img
              src={variant.gallery[0]}
              alt={product.name}
              className="w-full aspect-square object-cover"
            />
          )}
          <div className="p-4 w-full">
            <h3 className="text-base font-semibold">{product.name}</h3>
            <p className="text-sm text-muted-foreground">
              {variant.price.toLocaleString()}₫
            </p>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
