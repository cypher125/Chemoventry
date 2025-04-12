import React from 'react';

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {children}
    </div>
  );
}
