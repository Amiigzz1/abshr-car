import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Car {
  model: string;
  price: number;
  monthlyPayment: {
    years1: number;
    years3: number;
    years5: number;
  };
  image: string;
}

const cars: Car[] = [
  {
    model: "تويوتا كامري 2024 LE ستاندر",
    price: 119000,
    monthlyPayment: {
      years1: 10500,
      years3: 3800,
      years5: 2450
    },
    image: "/placeholder.svg"
  },
  {
    model: "تويوتا كورولا 2024 XLI ستاندر",
    price: 89900,
    monthlyPayment: {
      years1: 7900,
      years3: 2850,
      years5: 1850
    },
    image: "/placeholder.svg"
  },
  // يمكن إضافة المزيد من السيارات هنا
];

export function AvailableCars() {
  return (
    <div className="py-12 px-4" dir="rtl">
      <h2 className="text-3xl font-bold text-center mb-8">السيارات المتاحة للتمويل</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cars.map((car, index) => (
          <Card key={index}>
            <CardHeader>
              <img src={car.image} alt={car.model} className="w-full h-48 object-cover rounded-t-lg" />
              <CardTitle className="mt-4">{car.model}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-lg font-semibold">السعر الكاش</p>
                  <p className="text-2xl font-bold text-primary">{car.price.toLocaleString()} ريال</p>
                </div>
                <div>
                  <p className="text-lg font-semibold mb-2">القسط الشهري التقريبي:</p>
                  <div className="space-y-2">
                    <Badge variant="outline" className="block w-full text-center py-2">
                      سنة: {car.monthlyPayment.years1.toLocaleString()} ريال
                    </Badge>
                    <Badge variant="outline" className="block w-full text-center py-2">
                      3 سنوات: {car.monthlyPayment.years3.toLocaleString()} ريال
                    </Badge>
                    <Badge variant="outline" className="block w-full text-center py-2">
                      5 سنوات: {car.monthlyPayment.years5.toLocaleString()} ريال
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}