'use client';

import { useState } from 'react';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ReportCard } from '@/components/reports/ReportCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PageTitle from '@/components/pageTitle';
import reportService, { ReportFormat } from '@/services/reportService';
import { 
  BarChart3, 
  Calendar, 
  ClipboardList, 
  FileBarChart,
  History,
  AlertTriangle,
  Beaker
} from 'lucide-react';
import { toast } from 'sonner';
import { inventoryAPI } from '@/lib/api';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

// Interface for date range
interface DateRange {
  from?: Date;
  to?: Date;
}

export default function ReportsPage() {
  const { user } = useAuth();
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [daysAhead, setDaysAhead] = useState('90');
  const [threshold, setThreshold] = useState('100');
  const [locations, setLocations] = useState<any[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [activeTab, setActiveTab] = useState('general');

  // Fetch locations for filtering
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await inventoryAPI.getLocations();
        setLocations(data);
      } catch (error) {
        console.error('Failed to fetch locations:', error);
        toast.error('Failed to load locations');
      }
    };

    fetchLocations();
  }, []);

  // Handlers for different report types
  const handleInventoryReport = async (format: ReportFormat) => {
    if (!dateRange.from || !dateRange.to) {
      toast.error('Please select a date range');
      return;
    }

    try {
      await reportService.inventoryReport({
        format,
        dateRange,
        location: selectedLocation === 'all' ? undefined : selectedLocation
      });
    } catch (error: any) {
      console.error('Inventory report error:', error);
      throw new Error(error.message || 'Failed to generate inventory report');
    }
  };

  const handleUsageReport = async (format: ReportFormat) => {
    if (!dateRange.from || !dateRange.to) {
      toast.error('Please select a date range');
      return;
    }

    try {
      await reportService.usageReport({
        format,
        dateRange,
      });
    } catch (error: any) {
      console.error('Usage report error:', error);
      throw new Error(error.message || 'Failed to generate usage report');
    }
  };

  const handleExpiryReport = async (format: ReportFormat) => {
    try {
      await reportService.expiryReport({
        format,
        days: parseInt(daysAhead)
      });
    } catch (error: any) {
      console.error('Expiry report error:', error);
      throw new Error(error.message || 'Failed to generate expiry report');
    }
  };

  const handleLowStockReport = async (format: ReportFormat) => {
    try {
      await reportService.lowStockReport({
        format,
        threshold: parseFloat(threshold)
      });
    } catch (error: any) {
      console.error('Low stock report error:', error);
      throw new Error(error.message || 'Failed to generate low stock report');
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <PageTitle title="Reports" />
      
      <Tabs 
        defaultValue="general" 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General Reports</TabsTrigger>
          <TabsTrigger value="stock">Stock Reports</TabsTrigger>
          <TabsTrigger value="advanced" disabled={!isAdmin}>Advanced Reports</TabsTrigger>
        </TabsList>
        
        {/* General Reports Tab */}
        <TabsContent value="general" className="space-y-6">
      <Card>
        <CardHeader>
              <CardTitle className="text-xl">Generate Reports</CardTitle>
          <CardDescription>
                Generate comprehensive reports for your chemical inventory
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
                {/* Date Range Filter */}
            <div className="space-y-2">
                  <Label>Date Range</Label>
              <DatePickerWithRange 
                onDateRangeChange={setDateRange} 
                placeholderText="Select date range"
                className="w-full"
                    initialDateRange={dateRange}
                  />
                  <p className="text-xs text-muted-foreground">
                    Required for inventory and usage reports
                  </p>
                </div>
                
                {/* Location Filter */}
                <div className="space-y-2">
                  <Label>Location Filter (Optional)</Label>
                  <Select 
                    value={selectedLocation} 
                    onValueChange={setSelectedLocation}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Filter inventory report by location
                  </p>
            </div>
          </div>
          
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Inventory Report */}
                <ReportCard
                  title="Inventory Report"
                  description="Complete inventory with details on all chemicals"
                  icon={<ClipboardList className="h-6 w-6" />}
                  onGenerateReport={handleInventoryReport}
                  disabled={!dateRange.from || !dateRange.to}
                />
                
                {/* Usage Report */}
                <ReportCard
                  title="Usage Report"
                  description="Track chemical usage over time"
                  icon={<History className="h-6 w-6" />}
                  onGenerateReport={handleUsageReport}
                  disabled={!dateRange.from || !dateRange.to}
                />
                
                {/* Expiry Report */}
                <ReportCard
                  title="Expiry Report"
                  description="Chemicals expiring soon"
                  icon={<Calendar className="h-6 w-6" />}
                  onGenerateReport={handleExpiryReport}
                />
              </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
        {/* Stock Reports Tab */}
        <TabsContent value="stock" className="space-y-6">
                <Card>
            <CardHeader>
              <CardTitle className="text-xl">Stock Management Reports</CardTitle>
              <CardDescription>
                Generate reports to help manage chemical stock levels
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Days Ahead for Expiry */}
                <div className="space-y-2">
                  <Label>Days Ahead for Expiry Report</Label>
                  <Input
                    type="number"
                    value={daysAhead}
                    onChange={(e) => setDaysAhead(e.target.value)}
                    min="1"
                    max="365"
                  />
                  <p className="text-xs text-muted-foreground">
                    Show chemicals expiring within this many days
                  </p>
                </div>
                
                {/* Threshold for Low Stock */}
                <div className="space-y-2">
                  <Label>Low Stock Threshold</Label>
                  <Input
                    type="number"
                    value={threshold}
                    onChange={(e) => setThreshold(e.target.value)}
                    min="0"
                    step="0.1"
                  />
                  <p className="text-xs text-muted-foreground">
                    Show chemicals with quantity below this threshold
                  </p>
                </div>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                {/* Expiry Report */}
                <ReportCard
                  title="Detailed Expiry Report"
                  description={`Chemicals expiring in the next ${daysAhead} days`}
                  icon={<AlertTriangle className="h-6 w-6" />}
                  onGenerateReport={handleExpiryReport}
                />
                
                {/* Low Stock Report */}
                <ReportCard
                  title="Low Stock Report"
                  description={`Chemicals with quantity below ${threshold}`}
                  icon={<Beaker className="h-6 w-6" />}
                  onGenerateReport={handleLowStockReport}
                />
              </div>
                  </CardContent>
                </Card>
              </TabsContent>
      
        {/* Advanced Reports Tab - Admin Only */}
        <TabsContent value="advanced" className="space-y-6">
      <Card>
        <CardHeader>
              <CardTitle className="text-xl">Advanced Analysis Reports</CardTitle>
          <CardDescription>
                Generate comprehensive analytical reports (Admin only)
          </CardDescription>
        </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Usage Trends */}
                <ReportCard
                  title="Usage Trends"
                  description="Advanced analysis of chemical usage patterns"
                  icon={<BarChart3 className="h-6 w-6" />}
                  onGenerateReport={handleUsageReport}
                  disabled={!dateRange.from || !dateRange.to}
                />
                
                {/* Stock Level Analysis */}
                <ReportCard
                  title="Stock Analysis"
                  description="Detailed analysis of current inventory"
                  icon={<FileBarChart className="h-6 w-6" />}
                  onGenerateReport={handleInventoryReport}
                  disabled={!dateRange.from || !dateRange.to}
                />
              </div>
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 