'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2, FileText, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { ReportFormat } from '@/services/reportService';

interface ReportCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onGenerateReport: (format: ReportFormat) => Promise<void>;
  disabled?: boolean;
}

export function ReportCard({
  title,
  description,
  icon,
  onGenerateReport,
  disabled = false
}: ReportCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [format, setFormat] = useState<ReportFormat>('pdf');

  const handleGenerateReport = async () => {
    if (disabled) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    try {
      await onGenerateReport(format);
      toast.success(`${title} generated successfully`);
    } catch (error: any) {
      console.error('Report generation error:', error);
      toast.error(error.message || 'Failed to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-full bg-primary/10 text-primary">{icon}</div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 justify-center">
          <Button 
            variant={format === 'pdf' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFormat('pdf')}
            disabled={isLoading || disabled}
            className="flex items-center gap-1"
          >
            <FileText className="h-4 w-4" />
            PDF
          </Button>
          <Button 
            variant={format === 'excel' ? 'default' : 'outline'} 
            size="sm"
            onClick={() => setFormat('excel')}
            disabled={isLoading || disabled}
            className="flex items-center gap-1"
          >
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </Button>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleGenerateReport}
          disabled={isLoading || disabled}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileDown className="mr-2 h-4 w-4" />
              Generate {format.toUpperCase()}
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
} 