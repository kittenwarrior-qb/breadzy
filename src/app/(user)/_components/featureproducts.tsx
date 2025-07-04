// src/components/FeatureProducts.tsx
import getAllProducts from "@/api/products/get";
import ProductCard from "@/components/shared/card/productCard";

export default async function FeatureProducts() {
  const products = await getAllProducts();

  return (
    <section className="w-full py-12 bg-white">
      <div className="max-w-[1280px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products?.map((product: any) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
