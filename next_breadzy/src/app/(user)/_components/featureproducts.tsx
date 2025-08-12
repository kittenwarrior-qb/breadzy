
import ProductCard from "@/components/shared/card/productCard";
import { getFirstVariantsFromProducts } from "@/api/variants/get";


export default async function FeatureProducts() {
  const { data: featureProducts } = await getFirstVariantsFromProducts();
  return (
    <section className="w-full py-12 bg-white">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featureProducts.map(({ product, variant }) => (
            <ProductCard
              key={product._id}
              product={product}
              variant={variant}
            />
          ))}

        </div>
      </div>
    </section>
  );
}
