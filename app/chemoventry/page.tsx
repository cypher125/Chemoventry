'use client';

import PageTitle from '@/components/pageTitle';
import { DashboardCharts } from '@/components/dashboard/dashboard-chart';
import { RecentActivity } from '@/components/dashboard/recent-activity';
import { QuickActions } from '@/components/dashboard/quick-actions';
import DashboardHeader from '@/components/dashboard/dashboard-header';
import { useAuth } from '@/contexts/AuthContext';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { useDashboardStore } from '@/store/dashboard';

// Use dynamic import to avoid module resolution errors
const WelcomeMessage = dynamic(
  () => import('@/components/dashboard/welcome-message'),
  { ssr: false, loading: () => <div className="h-24 bg-slate-200 animate-pulse rounded-lg"></div> }
);

const Dashboard = () => {
  const { user } = useAuth();
  const { fetchDashboardData } = useDashboardStore();

  // Fetch dashboard data when the component mounts
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return (
    <>
      <div className="mb-4">
        {user && <WelcomeMessage firstName={user.first_name} />}
      </div>
      <PageTitle title="Dashboard" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <DashboardHeader />
      </div>
      <div className="mt-16 grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <DashboardCharts />
        <RecentActivity />
        <QuickActions />
      </div>
    </>
  );
};

export default Dashboard;
