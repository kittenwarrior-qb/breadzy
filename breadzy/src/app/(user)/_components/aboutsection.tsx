"use client";

export default function AboutSection() {
  return (
    <section className="w-full py-12 bg-white">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 items-stretch">
        
        {/* Image 1 */}
        <div className="w-full h-[500px]">
          <img
            src="https://theobroma.in/cdn/shop/files/FrenchBaguette.jpg?v=1710837211"
            alt="Wheat"
            className="w-full h-full object-cover"
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
        <div className="w-full h-[500px]">
          <img
            src="https://cdn.hswstatic.com/gif/french-baguette.jpg"
            alt="Dough"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Image 3 */}
        <div className="w-full h-full">
          <img
            src="https://suckhoedoisong.qltns.mediacdn.vn/Images/duylinh/2021/05/24/Den%20Vau_resize.jpg"
            alt="Bread"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </section>
  );
}
