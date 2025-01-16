import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Calculator = () => {
  const [carPrice, setCarPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [months, setMonths] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState<number | null>(null);

  const calculatePayment = () => {
    const price = parseFloat(carPrice);
    const down = parseFloat(downPayment);
    const period = parseFloat(months);
    
    if (price && down && period) {
      const loanAmount = price - down;
      const interestRate = 0.05; // 5% yearly interest rate
      const monthlyRate = interestRate / 12;
      const payment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, period)) / 
                     (Math.pow(1 + monthlyRate, period) - 1);
      setMonthlyPayment(Math.round(payment));
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl font-bold text-primary text-center mb-6">حاسبة التمويل</h2>
      <div className="space-y-4">
        <div>
          <Label htmlFor="carPrice">سعر السيارة</Label>
          <Input
            id="carPrice"
            type="number"
            value={carPrice}
            onChange={(e) => setCarPrice(e.target.value)}
            placeholder="أدخل سعر السيارة"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="downPayment">الدفعة الأولى</Label>
          <Input
            id="downPayment"
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            placeholder="أدخل الدفعة الأولى"
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="months">مدة التمويل (بالأشهر)</Label>
          <Input
            id="months"
            type="number"
            value={months}
            onChange={(e) => setMonths(e.target.value)}
            placeholder="أدخل عدد الأشهر"
            className="mt-1"
          />
        </div>
        <Button 
          onClick={calculatePayment}
          className="w-full bg-primary hover:bg-primary/90"
        >
          احسب القسط الشهري
        </Button>
        {monthlyPayment && (
          <div className="mt-4 p-4 bg-secondary/20 rounded-lg text-center">
            <p className="text-lg font-semibold">القسط الشهري التقريبي:</p>
            <p className="text-2xl font-bold text-primary">{monthlyPayment} ريال</p>
          </div>
        )}
      </div>
    </div>
  );
};