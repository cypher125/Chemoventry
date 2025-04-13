export interface Location {
  id: string;
  name: string;
  description?: string;
  building?: string;
  room_number?: string;
  storage_type?: string;
  storage_conditions?: string;
  max_capacity?: number;
  current_capacity?: number;
  is_active: boolean;
}

export interface Chemical {
  id: string;
  cas_number: string;
  name: string;
  formula: string;
  state?: 'solid' | 'liquid' | 'gas';
  hazard_class?: string;
  storage_conditions?: string;
  initial_quantity: number;
  current_quantity: number;
  unit: string;
  location_id: string;
  location_name?: string;
  date_registered: string;
  expiry_date?: string;
  supplier?: string;
  msds_url?: string;
  comments?: string;
  is_active: boolean;
}

export interface ChemicalFilter {
  name?: string;
  cas_number?: string;
  location_id?: string;
  state?: string;
  hazard_class?: string;
  low_stock?: boolean;
  expired?: boolean;
  is_active?: boolean;
}

export interface DashboardOverview {
  total_chemicals: number;
  low_stock_count: number;
  expired_count: number;
  chemicals_by_state: {
    solid: number;
    liquid: number;
    gas: number;
  };
  chemicals_by_hazard: Record<string, number>;
  recent_activities: {
    id: string;
    activity_type: string;
  description: string;
    timestamp: string;
    user_id: string;
    user_name: string;
  }[];
}

// Mock data based on the schema
export const mockLocations: Location[] = [
  { id: '1', name: 'Lab A' },
  { id: '2', name: 'Lab B' },
  { id: '3', name: 'Storage Room 1' },
  { id: '4', name: 'Storage Room 2' },
];

export const mockChemicals: Chemical[] = [
  {
    id: '1',
    name: 'Sodium Chloride',
    quantity: 500,
    description: 'Common table salt',
    vendor: 'Sigma-Aldrich',
    hazard_information: 'Low hazard',
    molecular_formula: 'NaCl',
    reactivity_group: 'Alkali',
    chemical_type: 'Inorganic',
    chemical_state: 'Solid',
    location: mockLocations[0],
    expires: '2025-12-31',
    created_by: '1',
    created_at: '2024-03-04T12:00:00Z',
    updated_at: '2024-03-04T12:00:00Z',
  },
  {
    id: '2',
    name: 'Ethanol',
    quantity: 1000,
    description: 'Pure ethanol for laboratory use',
    vendor: 'Merck',
    hazard_information: 'Flammable liquid',
    molecular_formula: 'C2H5OH',
    reactivity_group: 'Other',
    chemical_type: 'Organic',
    chemical_state: 'Liquid',
    location: mockLocations[1],
    expires: '2026-01-31',
    created_by: '1',
    created_at: '2024-03-04T12:00:00Z',
    updated_at: '2024-03-04T12:00:00Z',
  },
];
