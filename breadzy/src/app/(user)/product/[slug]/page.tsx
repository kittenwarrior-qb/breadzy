// app/products/[slug]/page.tsx
import ProductDetailClient from "./_components/productdetail";
import { getProductBySlug } from "@/api/products/get";

interface Props {
  params: { slug: string };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);

  return (
    <div className="md:w-[1280px] mx-auto p-4">
      <ProductDetailClient product={product} />
    </div>
  );
}
