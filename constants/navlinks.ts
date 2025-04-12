import {
  Home,
  FlaskConical,
  QrCode,
  FileText,
  Users,
  Bell,
  Settings,
} from 'lucide-react';

export const navItems = [
  { href: '/chemoventry', label: 'Dashboard', icon: Home },
  {
    href: '/chemoventry/inventory',
    label: 'Chemical Inventory',
    icon: FlaskConical,
  },
  { href: '/chemoventry/qr-codes', label: 'QR Code Management', icon: QrCode },
  { href: '/chemoventry/reports', label: 'Reports', icon: FileText },
  { href: '/chemoventry/users', label: 'User Management', icon: Users },
  { href: '/chemoventry/notifications', label: 'Notifications', icon: Bell },
  { href: '/chemoventry/settings', label: 'Settings', icon: Settings },
];
