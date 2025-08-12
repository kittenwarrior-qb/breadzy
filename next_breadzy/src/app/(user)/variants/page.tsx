import { getAllVariants } from "@/api/variants/get";
import Link from "next/link";
import Image from "next/image";

interface Props {
  searchParams: {
    page?: string;
    search?: string;
  };
}

export default async function AllVariantsPage({ searchParams }: Props) {
  const page = parseInt(searchParams.page || "1");
  const search = searchParams.search || "";

  const { data: variants, pagination } = await getAllVariants(page, 12, search);

  return (
    <main className="w-full py-12 bg-white min-h-screen">
      <div className="max-w-[1280px] mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6 text-center">Tất cả biến thể sản phẩm</h1>

        {/* Search bar */}
        <form className="mb-6 flex justify-center" action="/variants" method="get">
          <input
            type="text"
            name="search"
            defaultValue={search}
            placeholder="Tìm kiếm biến thể..."
            className="border p-2 rounded-l-md w-80"
          />
          <button type="submit" className="bg-black text-white px-4 rounded-r-md">Tìm</button>
        </form>

        {variants.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {variants.map((variant) => (
                <Link
                  key={variant._id}
                  href={`/products/${variant.productSlug}/${variant.slug}`}
                  className="border rounded-md overflow-hidden shadow-sm hover:shadow-md transition"
                >
                  <Image
                    src={variant.gallery?.[0] || "/placeholder.png"}
                    alt={variant.name}
                    width={300}
                    height={300}
                    className="w-full h-60 object-cover"
                  />
                  <div className="p-3">
                    <h2 className="font-medium text-lg mb-1">{variant.name}</h2>
                    <p className="text-orange-600 font-semibold">{variant.price.toLocaleString()}₫</p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-10">
              {pagination.page > 1 && (
                <Link
                  href={`/variants?page=${pagination.page - 1}&search=${search}`}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Trang trước
                </Link>
              )}
              <span>
                Trang {pagination.page} / {pagination.totalPages}
              </span>
              {pagination.page < pagination.totalPages && (
                <Link
                  href={`/variants?page=${pagination.page + 1}&search=${search}`}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Trang sau
                </Link>
              )}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-500">Không tìm thấy biến thể phù hợp.</p>
        )}
      </div>
    </main>
  );
}
