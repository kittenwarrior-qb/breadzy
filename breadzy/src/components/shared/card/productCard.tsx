// src/components/ProductCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

type Product = {
  _id: string;
  name: string;
  image?: string;
  slug: string;
  price: number;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden p-0 hover:shadow-lg transition duration-200 cursor-pointer">
      <CardContent className="px-0">
        <Link href={`/product/${product.slug}`} className="flex flex-col items-center">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-40 object-cover rounded mb-3"
          />
        )}
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-gray-600">{product.price.toLocaleString()}₫</p>
        </Link>
      </CardContent>
    </Card>
  );
}
