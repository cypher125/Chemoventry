import { create } from 'zustand';
import { inventoryAPI } from '@/lib/api';

export interface RecentActivity {
  action: string;
  chemical: string;
  quantity: string;
  user: string;
  timestamp: string;
}

export interface UsageTrend {
  month: string;
  usage: number;
}

export interface DashboardState {
  isLoading: boolean;
  error: string | null;
  totalChemicals: number;
  expiredChemicals: number;
  lowStockAlerts: number;
  monthlyUsageChange: number;
  recentActivity: RecentActivity[];
  usageTrends: UsageTrend[];
  fetchDashboardData: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  isLoading: false,
  error: null,
  totalChemicals: 0,
  expiredChemicals: 0,
  lowStockAlerts: 0,
  monthlyUsageChange: 0,
  recentActivity: [],
  usageTrends: [],
  fetchDashboardData: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await inventoryAPI.getDashboardOverview();
      set({
        totalChemicals: data.total_chemicals,
        expiredChemicals: data.expired_chemicals,
        lowStockAlerts: data.low_stock_alerts,
        monthlyUsageChange: data.monthly_usage_change,
        recentActivity: data.recent_activity,
        usageTrends: data.usage_trends,
        isLoading: false
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      set({ 
        error: 'Failed to fetch dashboard data', 
        isLoading: false 
      });
    }
  }
}));
