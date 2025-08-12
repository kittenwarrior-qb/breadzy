"use client";

import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="w-full py-12 bg-white">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">

        {/* Image 1 */}
        <div className="w-full h-[500px] relative">
          <Image
            src="/images/1.jpg"
            alt="Wheat"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        {/* Text */}
        <div className="flex flex-col justify-center p-4">
          <h2 className="text-xl font-semibold mb-4">What we’re about</h2>
          <p className="text-gray-700 leading-relaxed">
            With four ingredients, a few pieces of basic baking equipment, and ten minutes of work,
            you can bake healthy, nutritious, incredibly delicious loaves of oven-fresh bread in your kitchen at home.
            Whenever you want.
          </p>
          <p className="mt-4 text-gray-700">We’ll show you how.</p>
        </div>

        {/* Image 2 */}
        <div className="w-full h-[500px] relative">
          <Image
            src="/images/2.jpg"
            alt="Dough"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>

        {/* Image 3 */}
        <div className="w-full h-[500px] relative">
          <Image
            src="/images/3.jpg"
            alt="Bread"
            fill
            style={{ objectFit: "cover" }}
            priority
          />
        </div>
      </div>
    </section>
  );
}
