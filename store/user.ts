import { create } from 'zustand';
import { User, mockUsers } from '@/types/user';
import { usersAPI } from '@/lib/api';

interface UserState {
  users: User[];
  currentUser: User | null;
  isLoadingUsers: boolean;
  error: string | null;
  
  // Actions
  fetchUsers: () => Promise<void>;
  fetchUserById: (id: string) => Promise<User | undefined>;
  addUser: (user: Partial<User>) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  getCurrentUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
  users: [],
  currentUser: null,
  isLoadingUsers: false,
  error: null,
  
  fetchUsers: async () => {
    set({ isLoadingUsers: true, error: null });
    try {
      const users = await usersAPI.getUsers();
      set({ users, isLoadingUsers: false });
    } catch (error: any) {
      console.error('Error fetching users:', error);
      // Always fall back to mock data when in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Using mock user data');
        set({ 
          users: mockUsers,
          isLoadingUsers: false,
          error: null // Don't show error in development when we have mock data
        });
      } else {
        set({ 
          isLoadingUsers: false, 
          error: error.message || 'Failed to fetch users',
          users: []
        });
      }
    }
  },
  
  fetchUserById: async (id: string) => {
    set({ isLoadingUsers: true, error: null });
    try {
      const user = await usersAPI.getUserById(id);
      set({ isLoadingUsers: false });
      return user;
    } catch (error: any) {
      console.error(`Error fetching user ${id}:`, error);
      set({ 
        isLoadingUsers: false, 
        error: error.message || `Failed to fetch user ${id}`
      });
    }
  },
  
  addUser: async (userData: Partial<User>) => {
    set({ isLoadingUsers: true, error: null });
    try {
      await usersAPI.createUser(userData);
      // Refresh the user list
      await get().fetchUsers();
    } catch (error: any) {
      console.error('Error adding user:', error);
      
      // In development, add to mock data instead of showing error
      if (process.env.NODE_ENV === 'development') {
        const newUser = {
          ...userData,
          id: (get().users.length + 1).toString(),
          join_date: new Date().toISOString(),
          is_active: userData.is_active ?? true,
        } as User;
        const updatedUsers = [...get().users, newUser];
        set({ 
          users: updatedUsers,
          isLoadingUsers: false,
          error: null
        });
      } else {
        set({ 
          isLoadingUsers: false, 
          error: error.message || 'Failed to add user'
        });
      }
    }
  },
  
  updateUser: async (id: string, userData: Partial<User>) => {
    set({ isLoadingUsers: true, error: null });
    try {
      await usersAPI.updateUser(id, userData);
      // Refresh the user list
      await get().fetchUsers();
    } catch (error: any) {
      console.error(`Error updating user ${id}:`, error);
      
      // In development, update mock data instead of showing error
      if (process.env.NODE_ENV === 'development') {
        const updatedUsers = get().users.map(user => 
          user.id === id ? { ...user, ...userData } : user
        );
        set({ 
          users: updatedUsers,
          isLoadingUsers: false,
          error: null
        });
      } else {
        set({ 
          isLoadingUsers: false, 
          error: error.message || `Failed to update user ${id}`
        });
      }
    }
  },
  
  deleteUser: async (id: string) => {
    set({ isLoadingUsers: true, error: null });
    try {
      await usersAPI.deleteUser(id);
      // Refresh the user list
      await get().fetchUsers();
    } catch (error: any) {
      console.error(`Error deleting user ${id}:`, error);
      
      // In development, delete from mock data instead of showing error
      if (process.env.NODE_ENV === 'development') {
        const filteredUsers = get().users.filter(user => user.id !== id);
        set({ 
          users: filteredUsers,
          isLoadingUsers: false,
          error: null
        });
      } else {
        set({ 
          isLoadingUsers: false, 
          error: error.message || `Failed to delete user ${id}`
        });
      }
    }
  },
  
  getCurrentUser: async () => {
    set({ isLoadingUsers: true, error: null });
    try {
      const user = await usersAPI.getCurrentUser();
      set({ currentUser: user, isLoadingUsers: false });
    } catch (error: any) {
      console.error('Error fetching current user:', error);
      
      // In development, use mock admin user instead of showing error
      if (process.env.NODE_ENV === 'development') {
        set({ 
          currentUser: mockUsers.find(user => user.role === 'admin') || mockUsers[0],
          isLoadingUsers: false,
          error: null
        });
      } else {
        set({ 
          isLoadingUsers: false, 
          error: error.message || 'Failed to fetch current user',
          currentUser: null
        });
      }
    }
  }
}));
