import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, QrCode, FileText, AlertTriangle } from 'lucide-react';

export function QuickActions() {
  return (
    <Card className="dark:bg-gray-900 dark:border-none">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <Button className="w-full bg-[#727D73] dark:hover:bg-gray-500">
          <Plus className="mr-2 h-4 w-4" /> Add New Chemical
        </Button>
        <Button className="w-full dark:bg-gray-100 dark:text-gray-800">
          <QrCode className="mr-2 h-4 w-4" /> Generate QR Code
        </Button>
        <Button className="w-full dark:bg-gray-100 dark:text-gray-800">
          <FileText className="mr-2 h-4 w-4" /> Generate Report
        </Button>
        <Button className="w-full dark:bg-gray-100 dark:text-gray-800">
          <AlertTriangle className="mr-2 h-4 w-4" /> View Alerts
        </Button>
      </CardContent>
    </Card>
  );
}
