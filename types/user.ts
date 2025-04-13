export interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  role: UserRole;
  department?: string;
  position?: string;
  is_active: boolean;
  date_joined: string;
  last_login?: string;
  profile_image?: string;
}

export type UserRole = 'admin' | 'manager' | 'staff' | 'readonly';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface PasswordChange {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

export interface RegistrationData {
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  confirm_password: string;
  role: UserRole;
  department?: string;
  position?: string;
}

export interface UserFilter {
  query?: string;
  role?: UserRole;
  is_active?: boolean;
}

export interface QRCode {
  id: string;
  data: string;
  url: string;
  chemical_id?: string;
  location_id?: string;
  created_at: string;
}

// Mock data for users
export const mockUsers: User[] = [
  { 
    id: '1', 
    username: 'johndoe',
    email: 'john@example.com',
    first_name: 'John', 
    last_name: 'Doe', 
    full_name: 'John Doe',
    role: 'admin',
    department: 'IT',
    position: 'System Administrator',
    date_joined: new Date().toISOString(),
    is_active: true 
  },
  { 
    id: '2', 
    username: 'janesmith',
    email: 'jane@example.com',
    first_name: 'Jane', 
    last_name: 'Smith', 
    full_name: 'Jane Smith',
    role: 'staff',
    department: 'Chemistry',
    position: 'Lab Technician',
    date_joined: new Date().toISOString(),
    is_active: true 
  },
];

// Mock data for QR codes
export const mockQRCodes: QRCode[] = [
  {
    id: '1',
    data: 'NaCl-001',
    url: '/qrcodes/1',
    chemical_id: 'NaCl-001',
    created_at: '2023-06-15'
  },
  {
    id: '2',
    data: 'HCl-002',
    url: '/qrcodes/2',
    chemical_id: 'HCl-002',
    created_at: '2023-06-10'
  },
  {
    id: '3',
    data: 'C2H5OH-003',
    url: '/qrcodes/3',
    chemical_id: 'C2H5OH-003',
    created_at: '2023-06-12'
  },
  {
    id: '4',
    data: 'H2SO4-004',
    url: '/qrcodes/4',
    chemical_id: 'H2SO4-004',
    created_at: '2023-06-08'
  },
  {
    id: '5',
    data: 'NaOH-005',
    url: '/qrcodes/5',
    chemical_id: 'NaOH-005',
    created_at: '2023-06-14'
  }
];
