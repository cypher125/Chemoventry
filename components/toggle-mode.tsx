'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect, useMemo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import clsx from 'clsx';

export function ModeToggle({ className }: { className?: ReactNode }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure the component is only rendered after it has mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  // Memoize the icon JSX to prevent unnecessary re-renders
  const icon = useMemo(() => {
    return theme === 'dark' ? (
      <Moon className="h-[1.2rem] w-[1.2rem] transition-transform" />
    ) : (
      <Sun className="h-[1.2rem] w-[1.2rem] transition-transform" />
    );
  }, [theme]);

  if (!mounted) {
    return null; // Prevent rendering until the client-side has mounted
  }

  const handleThemeChange = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <Button
      className={clsx(className)}
      variant="outline"
      size="icon"
      onClick={handleThemeChange}
    >
      {icon}
    </Button>
  );
}
