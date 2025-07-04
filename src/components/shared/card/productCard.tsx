// src/components/ProductCard.tsx
import { Card, CardContent } from "@/components/ui/card";

type Product = {
  _id: string;
  name: string;
  image?: string;
  price: number;
};

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition duration-200 cursor-pointer">
      <CardContent className="">
        {product.image && (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-40 object-cover rounded mb-3"
          />
        )}
        <h3 className="font-semibold text-lg">{product.name}</h3>
        <p className="text-gray-600">{product.price.toLocaleString()}₫</p>
      </CardContent>
    </Card>
  );
}
