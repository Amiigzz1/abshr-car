import { Hero } from "@/components/Hero";
import { Calculator } from "@/components/Calculator";
import { Features } from "@/components/Features";
import { AIChat } from "@/components/AIChat";
import { AvailableCars } from "@/components/cars/AvailableCars";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { LogIn } from "lucide-react";

const Index = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-secondary/20" dir="rtl">
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">
            أبشر كار
          </h1>
          {!user && (
            <Link to="/login">
              <Button variant="outline" className="gap-2">
                <LogIn className="h-4 w-4" />
                تسجيل الدخول للموظفين
              </Button>
            </Link>
          )}
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