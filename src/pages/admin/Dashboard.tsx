import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Users, FileText, UserCheck, AlertCircle } from "lucide-react";
import { EmployeeRegistrationForm } from "@/components/admin/EmployeeRegistrationForm";

export default function AdminDashboard() {
  const { toast } = useToast();

  const { data: requests, isLoading } = useQuery({
    queryKey: ['financeRequests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('finance_requests')
        .select(`
          *,
          sales_agent:sales_agent_id (
            profiles (
              full_name
            )
          ),
          car:car_id (
            brand,
            model,
            year
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">جاري التحميل...</div>;
  }

  return (
    <div className="p-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-8 text-primary">لوحة تحكم المدير</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الطلبات</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{requests?.length || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">قيد المراجعة</CardTitle>
            <AlertCircle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests?.filter(req => req.status === 'pending').length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">تم الموافقة</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {requests?.filter(req => req.status === 'approved').length || 0}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">المندوبين النشطين</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(requests?.map(req => req.sales_agent?.profiles?.full_name)).size || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Registration Form */}
      <div className="mb-8">
        <EmployeeRegistrationForm />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>طلبات التمويل</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>العميل</TableHead>
                  <TableHead>رقم الجوال</TableHead>
                  <TableHead>السيارة</TableHead>
                  <TableHead>المندوب</TableHead>
                  <TableHead>تاريخ الطلب</TableHead>
                  <TableHead>الحالة</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests?.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.customer_name}</TableCell>
                    <TableCell>{request.customer_phone}</TableCell>
                    <TableCell>
                      {request.car?.brand} {request.car?.model} {request.car?.year}
                    </TableCell>
                    <TableCell>{request.sales_agent?.profiles?.full_name || 'غير محدد'}</TableCell>
                    <TableCell>{new Date(request.created_at).toLocaleDateString('ar-SA')}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status === 'pending' ? 'قيد المراجعة' : 
                         request.status === 'approved' ? 'تمت الموافقة' : 
                         request.status === 'rejected' ? 'مرفوض' : request.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}