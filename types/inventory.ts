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
  is_active?: boolean;
}

export interface Chemical {
  id: string;
  name: string;
  quantity: number;
  description: string;
  vendor: string;
  hazard_information: string;
  molecular_formula: string;
  reactivity_group: 'Alkali' | 'Alkaline Earth' | 'Transition Metal' | 'Lanthanide' | 'Actinide' | 'Metal' | 'Nonmetal' | 'Halogen' | 'Noble Gas' | 'Other';
  chemical_type: 'Organic' | 'Inorganic' | 'Both';
  chemical_state: 'Solid' | 'Liquid' | 'Gas' | 'Plasma' | 'Other';
  location: Location | string;
  location_id?: string;
  expires: string;
  expiry_date?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  
  // Add compatibility fields for existing code
  formula?: string;
  cas_number?: string;
  state?: 'solid' | 'liquid' | 'gas';
  hazard_class?: string;
  storage_conditions?: string;
  initial_quantity?: number;
  current_quantity?: number;
  unit?: string;
  date_registered?: string;
  supplier?: string;
  msds_url?: string;
  comments?: string;
  is_active?: boolean;
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
  { id: '1', name: 'Lab A', is_active: true },
  { id: '2', name: 'Lab B', is_active: true },
  { id: '3', name: 'Storage Room 1', is_active: true },
  { id: '4', name: 'Storage Room 2', is_active: true },
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

// Helper type for reactivity groups
export type ReactivityGroup = 'Alkali' | 'Alkaline Earth' | 'Transition Metal' | 'Lanthanide' | 'Actinide' | 'Metal' | 'Nonmetal' | 'Halogen' | 'Noble Gas' | 'Other';

// Helper type for chemical states
export type ChemicalState = 'Solid' | 'Liquid' | 'Gas' | 'Plasma' | 'Other';

// Helper type for chemical types
export type ChemicalType = 'Organic' | 'Inorganic' | 'Both';
