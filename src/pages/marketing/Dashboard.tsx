import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function MarketingDashboard() {
  return (
    <div className="p-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-primary">لوحة تحكم التسويق</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>إجمالي الزيارات</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,234</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>معدل التحويل</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">5.2%</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>الطلبات المكتملة</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">45</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>أداء المسوقين</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>المسوق</TableHead>
                <TableHead>كود المسوق</TableHead>
                <TableHead>عدد الطلبات</TableHead>
                <TableHead>نسبة التحويل</TableHead>
                <TableHead>العمولة المستحقة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>أحمد محمد</TableCell>
                <TableCell>MKT001</TableCell>
                <TableCell>25</TableCell>
                <TableCell>4.8%</TableCell>
                <TableCell>2,500 ريال</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}