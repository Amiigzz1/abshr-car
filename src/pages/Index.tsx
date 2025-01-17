import { Hero } from "@/components/Hero";
import { Calculator } from "@/components/Calculator";
import { Features } from "@/components/Features";
import { AIChat } from "@/components/AIChat";
import { AvailableCars } from "@/components/cars/AvailableCars";

const Index = () => {
  return (
    <div className="min-h-screen bg-white" dir="rtl">
      <Hero />
      <Calculator />
      <AvailableCars />
      <AIChat />
      <Features />
    </div>
  );
};

export default Index;