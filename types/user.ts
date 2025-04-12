export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'admin' | 'attendant';
  is_active: boolean;
  join_date: string; // ISO date string
  last_login?: string; // ISO date string
}

export interface QRCode {
  id: string;
  chemical_id: string;
  chemical_name: string;
  date_created: string; // ISO date string
  created_by: string; // User ID
}

// Mock data for users
export const mockUsers: User[] = [
  { 
    id: '1', 
    first_name: 'John', 
    last_name: 'Doe', 
    email: 'john@example.com', 
    role: 'admin',
    join_date: new Date().toISOString(),
    is_active: true 
  },
  { 
    id: '2', 
    first_name: 'Jane', 
    last_name: 'Smith', 
    email: 'jane@example.com', 
    role: 'attendant',
    join_date: new Date().toISOString(),
    is_active: true 
  },
];

// Mock data for QR codes
export const mockQRCodes: QRCode[] = [
  {
    id: '1',
    chemical_id: 'NaCl-001',
    chemical_name: 'Sodium Chloride',
    date_created: '2023-06-15',
    created_by: '1'
  },
  {
    id: '2',
    chemical_id: 'HCl-002',
    chemical_name: 'Hydrochloric Acid',
    date_created: '2023-06-10',
    created_by: '2'
  },
  {
    id: '3',
    chemical_id: 'C2H5OH-003',
    chemical_name: 'Ethanol',
    date_created: '2023-06-12',
    created_by: '1'
  },
  {
    id: '4',
    chemical_id: 'H2SO4-004',
    chemical_name: 'Sulfuric Acid',
    date_created: '2023-06-08',
    created_by: '2'
  },
  {
    id: '5',
    chemical_id: 'NaOH-005',
    chemical_name: 'Sodium Hydroxide',
    date_created: '2023-06-14',
    created_by: '1'
  }
];
