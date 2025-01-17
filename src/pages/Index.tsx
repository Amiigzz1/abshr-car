import { Hero } from "@/components/Hero";
import { Calculator } from "@/components/Calculator";
import { Features } from "@/components/Features";
import { AIChat } from "@/components/AIChat";
import { AvailableCars } from "@/components/cars/AvailableCars";

const Index = () => {
  return (
    <div className="min-h-screen bg-secondary/20" dir="rtl">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-primary text-center">
            أبشر كار
          </h1>
        </div>
      </header>
      <Hero />
      <Calculator />
      <AvailableCars />
      <AIChat />
      <Features />
    </div>
  );
};

export default Index;