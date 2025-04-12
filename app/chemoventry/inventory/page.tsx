'use client';

import React, { useEffect } from 'react';
import { ChemicalInventory } from '@/components/inventory/chemical-inventory';
import PageTitle from '@/components/pageTitle';
import { useInventoryStore } from '@/store/inventory';

export default function InventoryPage() {
  const { fetchChemicals, fetchLocations } = useInventoryStore();

  useEffect(() => {
    // Fetch all chemicals and locations on page load
    fetchChemicals();
    fetchLocations();
  }, [fetchChemicals, fetchLocations]);

  return (
    <div className="space-y-4">
      <PageTitle title="Inventory" />
      <ChemicalInventory />
    </div>
  );
}
