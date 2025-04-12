import { format } from 'date-fns';
import api from '@/lib/apiClient';
import { saveAs } from 'file-saver';

export type ReportFormat = 'pdf' | 'excel';
export type ReportType = 'inventory' | 'usage' | 'expiry' | 'low-stock';

interface DateRange {
  from?: Date;
  to?: Date;
}

interface ReportOptions {
  format: ReportFormat;
  dateRange?: DateRange;
  days?: number;
  threshold?: number;
  location?: string;
  chemical_id?: string;
  user_id?: string;
}

class ReportService {
  /**
   * Generate and download a report
   */
  async generateReport(type: ReportType, options: ReportOptions): Promise<void> {
    try {
      // Build the query parameters
      const params = new URLSearchParams();
      params.append('format', options.format);
      
      // Add date range if provided
      if (options.dateRange?.from && options.dateRange?.to) {
        params.append('start_date', format(options.dateRange.from, 'yyyy-MM-dd'));
        params.append('end_date', format(options.dateRange.to, 'yyyy-MM-dd'));
      }
      
      // Add other optional parameters
      if (options.days) {
        params.append('days', options.days.toString());
      }
      
      if (options.threshold) {
        params.append('threshold', options.threshold.toString());
      }
      
      if (options.location) {
        params.append('location', options.location);
      }
      
      if (options.chemical_id) {
        params.append('chemical_id', options.chemical_id);
      }
      
      if (options.user_id) {
        params.append('user_id', options.user_id);
      }
      
      // Make the API request
      const response = await api.get(`/api/reports/${type}/`, {
        params,
        responseType: 'blob',
      });
      
      // Get filename from content-disposition or use default
      let filename = `${type}-report.${options.format === 'pdf' ? 'pdf' : 'xlsx'}`;
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/"/g, '');
        }
      }
      
      // Save the file
      saveAs(new Blob([response.data]), filename);
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error generating report:', error);
      return Promise.reject(error);
    }
  }
  
  /**
   * Generate an inventory report
   */
  async inventoryReport(options: ReportOptions): Promise<void> {
    return this.generateReport('inventory', options);
  }
  
  /**
   * Generate a usage report
   */
  async usageReport(options: ReportOptions): Promise<void> {
    return this.generateReport('usage', options);
  }
  
  /**
   * Generate an expiry report
   */
  async expiryReport(options: ReportOptions): Promise<void> {
    return this.generateReport('expiry', options);
  }
  
  /**
   * Generate a low stock report
   */
  async lowStockReport(options: ReportOptions): Promise<void> {
    return this.generateReport('low-stock', options);
  }
}

export default new ReportService(); 