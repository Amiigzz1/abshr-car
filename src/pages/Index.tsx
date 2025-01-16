import { Hero } from "@/components/Hero";
import { Calculator } from "@/components/Calculator";
import { Features } from "@/components/Features";

const Index = () => {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <Hero />
      <Calculator />
      <Features />
    </div>
  );
};

export default Index;