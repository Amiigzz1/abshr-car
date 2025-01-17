import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Application {
  id: string;
  customerName: string;
  carModel: string;
  status: string;
  monthlyPayment: number;
  duration: number;
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    // TODO: Fetch real data from backend
    const mockData: Application[] = [
      {
        id: "1",
        customerName: "أحمد محمد",
        carModel: "تويوتا كامري 2024",
        status: "تحت المراجعة",
        monthlyPayment: 2500,
        duration: 5
      },
      // ... المزيد من البيانات
    ];
    setApplications(mockData);
  }, []);

  return (
    <div className="p-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-primary">لوحة تحكم المدير</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>إجمالي الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{applications.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>قيد المراجعة</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {applications.filter(app => app.status === "تحت المراجعة").length}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>تم الموافقة</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {applications.filter(app => app.status === "تمت الموافقة").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>طلبات التمويل</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>رقم الطلب</TableHead>
                <TableHead>اسم العميل</TableHead>
                <TableHead>السيارة</TableHead>
                <TableHead>القسط الشهري</TableHead>
                <TableHead>المدة</TableHead>
                <TableHead>الحالة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell>{app.id}</TableCell>
                  <TableCell>{app.customerName}</TableCell>
                  <TableCell>{app.carModel}</TableCell>
                  <TableCell>{app.monthlyPayment} ريال</TableCell>
                  <TableCell>{app.duration} سنوات</TableCell>
                  <TableCell>
                    <Badge variant="outline">{app.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}