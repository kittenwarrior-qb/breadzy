import AboutSection from "@/app/(user)/_components/aboutsection";
import FeatureProducts from "@/app/(user)/_components/featureproducts";

export default async function Home() {

  return (
    <div className="md:w-[1280px] mx-auto p-4">
      <AboutSection></AboutSection>
      <p className="w-full !font-allegreya text-center font-medium text-2xl mt-10">Những sản phẩm của chúng tôi</p>
      <FeatureProducts></FeatureProducts>
    </div>
  );
}
// cgatr