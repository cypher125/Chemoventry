export interface MockUser {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: 'admin' | 'attendant';
  join_date: string;
  is_active: boolean;
}

export interface MockQRCode {
  id: string;
  chemical_id: string;
  chemical_name: string;
  date_created: string;
  created_by: string;
}

export const mockUsers: MockUser[] = [
  {
    id: '1',
    first_name: 'Admin',
    last_name: 'User',
    email: 'admin@example.com',
    role: 'admin',
    join_date: '2023-01-01T00:00:00Z',
    is_active: true
  },
  {
    id: '2',
    first_name: 'Lab',
    last_name: 'Attendant',
    email: 'attendant@example.com',
    role: 'attendant',
    join_date: '2023-01-02T00:00:00Z',
    is_active: true
  }
];

export const mockQRCodes: MockQRCode[] = [
  {
    id: '1',
    chemical_id: '101',
    chemical_name: 'Sodium Chloride',
    date_created: '2023-04-01T00:00:00Z',
    created_by: '1'
  },
  {
    id: '2',
    chemical_id: '102',
    chemical_name: 'Ethanol',
    date_created: '2023-04-02T00:00:00Z',
    created_by: '1'
  }
]; 