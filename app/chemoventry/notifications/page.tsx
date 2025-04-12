'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import PageTitle from '@/components/pageTitle';

type Notification = {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
};

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Chemical Added',
    description: 'Sodium Chloride has been added to the inventory.',
    type: 'success',
    timestamp: new Date(2023, 5, 20, 10, 30),
  },
  {
    id: '2',
    title: 'User Updated',
    description: "User John Doe's information has been updated.",
    type: 'info',
    timestamp: new Date(2023, 5, 19, 15, 45),
  },
  {
    id: '3',
    title: 'Low Stock Alert',
    description: 'Ethanol is running low in stock.',
    type: 'warning',
    timestamp: new Date(2023, 5, 18, 9, 0),
  },
  {
    id: '4',
    title: 'Chemical Deleted',
    description: 'Hydrochloric Acid has been removed from the inventory.',
    type: 'error',
    timestamp: new Date(2023, 5, 17, 14, 20),
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // In a real application, you would fetch notifications from an API
    setNotifications(mockNotifications);
  }, []);

  const getTypeColor = (type: Notification['type']) => {
    switch (type) {
      case 'info':
        return 'dark:text-gray-800 dark:bg-blue-500 bg-blue-500';
      case 'success':
        return 'dark:text-gray-800 dark:bg-green-500 bg-green-500';
      case 'warning':
        return 'dark:text-gray-800 dark:bg-yellow-500 bg-yellow-500';
      case 'error':
        return 'dark:text-gray-800 dark:bg-red-500 bg-red-500';
      default:
        return 'dark:text-gray-800 dark:bg-gray-500 bg-gray-500';
    }
  };

  return (
    <div className="container mx-auto py-10">
      <PageTitle title="Notifications" />
      <Card className=" dark:bg-gray-900/60">
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>
            Stay updated with the latest changes in your chemical inventory and
            user management.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] w-full rounded-md border p-4">
            {notifications.map((notification) => (
              <div key={notification.id} className="mb-4 last:mb-0">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {notification.title}
                  </h3>
                  <Badge className={getTypeColor(notification.type)}>
                    {notification.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {notification.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {notification.timestamp.toLocaleString()}
                </p>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
