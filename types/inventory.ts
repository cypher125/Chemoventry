export interface Location {
  id: string;
  name: string;
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
  location: Location;
  expires: string; // ISO date string
  created_by: string; // User ID
  created_at: string; // ISO datetime string
  updated_at: string; // ISO datetime string
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
