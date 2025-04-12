import { create } from 'zustand';
import { Chemical, Location } from '@/types/inventory';
import { inventoryAPI } from '@/lib/api';
import { mockChemicals, mockLocations } from '@/types/inventory';

interface InventoryState {
  // Chemical data
  chemicals: Chemical[];
  isLoadingChemicals: boolean;
  chemicalsError: string | null;
  fetchChemicals: (filters?: object) => Promise<void>;
  
  // Selected chemical data
  selectedChemical: Chemical | null;
  isLoadingChemical: boolean;
  chemicalError: string | null;
  fetchChemical: (id: string) => Promise<void>;
  
  // Location data
  locations: Location[];
  isLoadingLocations: boolean;
  locationsError: string | null;
  fetchLocations: () => Promise<void>;
  
  // Data management methods
  addChemical: (chemical: Partial<Chemical>) => Promise<void>;
  updateChemical: (id: string, updates: Partial<Chemical>) => Promise<void>;
  deleteChemical: (id: string) => Promise<void>;
  
  addLocation: (location: Partial<Location>) => Promise<void>;
  updateLocation: (id: string, updates: Partial<Location>) => Promise<void>;
  deleteLocation: (id: string) => Promise<void>;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  // Initial state for chemicals
  chemicals: [],
  isLoadingChemicals: false,
  chemicalsError: null,
  
  // Initial state for selected chemical
  selectedChemical: null,
  isLoadingChemical: false,
  chemicalError: null,
  
  // Initial state for locations
  locations: [],
  isLoadingLocations: false,
  locationsError: null,
  
  // Fetch all chemicals
  fetchChemicals: async (filters = {}) => {
    set({ isLoadingChemicals: true, chemicalsError: null });
    
    try {
      const chemicals = await inventoryAPI.getChemicals(filters);
      set({ chemicals, isLoadingChemicals: false });
    } catch (error) {
      console.error('Failed to fetch chemicals:', error);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        set({
          chemicals: mockChemicals,
          isLoadingChemicals: false,
          chemicalsError: 'Failed to fetch chemicals from API. Using mock data.'
        });
      } else {
        set({
          isLoadingChemicals: false,
          chemicalsError: 'Failed to fetch chemicals. Please try again later.'
        });
      }
    }
  },
  
  // Fetch a single chemical by ID
  fetchChemical: async (id: string) => {
    set({ isLoadingChemical: true, chemicalError: null, selectedChemical: null });
    
    try {
      const chemical = await inventoryAPI.getChemicalById(id);
      set({ selectedChemical: chemical, isLoadingChemical: false });
    } catch (error) {
      console.error(`Failed to fetch chemical with ID ${id}:`, error);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        const mockChemical = mockChemicals.find(c => c.id === id);
        if (mockChemical) {
          set({
            selectedChemical: mockChemical,
            isLoadingChemical: false,
            chemicalError: 'Failed to fetch from API. Using mock data.'
          });
        } else {
          set({
            isLoadingChemical: false,
            chemicalError: `Chemical with ID ${id} not found.`
          });
        }
      } else {
        set({
          isLoadingChemical: false,
          chemicalError: 'Failed to fetch chemical details. Please try again later.'
        });
      }
    }
  },
  
  // Fetch all locations
  fetchLocations: async () => {
    set({ isLoadingLocations: true, locationsError: null });
    
    try {
      const locations = await inventoryAPI.getLocations();
      set({ locations, isLoadingLocations: false });
    } catch (error) {
      console.error('Failed to fetch locations:', error);
      
      // Fallback to mock data in development
      if (process.env.NODE_ENV === 'development') {
        set({
          locations: mockLocations,
          isLoadingLocations: false,
          locationsError: 'Failed to fetch locations from API. Using mock data.'
        });
      } else {
        set({
          isLoadingLocations: false,
          locationsError: 'Failed to fetch locations. Please try again later.'
        });
      }
    }
  },
  
  // Add a new chemical
  addChemical: async (chemical: Partial<Chemical>) => {
    try {
      const newChemical = await inventoryAPI.addChemical(chemical);
      set(state => ({
        chemicals: [...state.chemicals, newChemical]
      }));
    } catch (error) {
      console.error('Failed to add chemical:', error);
      throw error;
    }
  },
  
  // Update an existing chemical
  updateChemical: async (id: string, updates: Partial<Chemical>) => {
    try {
      const updatedChemical = await inventoryAPI.updateChemical(id, updates);
      set(state => ({
        chemicals: state.chemicals.map(c => 
          c.id === id ? { ...c, ...updatedChemical } : c
        ),
        selectedChemical: state.selectedChemical?.id === id 
          ? { ...state.selectedChemical, ...updatedChemical }
          : state.selectedChemical
      }));
    } catch (error) {
      console.error(`Failed to update chemical with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a chemical
  deleteChemical: async (id: string) => {
    try {
      await inventoryAPI.deleteChemical(id);
      set(state => ({
        chemicals: state.chemicals.filter(c => c.id !== id),
        selectedChemical: state.selectedChemical?.id === id ? null : state.selectedChemical
      }));
    } catch (error) {
      console.error(`Failed to delete chemical with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Add a new location
  addLocation: async (location: Partial<Location>) => {
    try {
      const newLocation = await inventoryAPI.addLocation(location);
      set(state => ({
        locations: [...state.locations, newLocation]
      }));
    } catch (error) {
      console.error('Failed to add location:', error);
      throw error;
    }
  },
  
  // Update an existing location
  updateLocation: async (id: string, updates: Partial<Location>) => {
    try {
      const updatedLocation = await inventoryAPI.updateLocation(id, updates);
      set(state => ({
        locations: state.locations.map(l => 
          l.id === id ? { ...l, ...updatedLocation } : l
        )
      }));
    } catch (error) {
      console.error(`Failed to update location with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Delete a location
  deleteLocation: async (id: string) => {
    try {
      await inventoryAPI.deleteLocation(id);
      set(state => ({
        locations: state.locations.filter(l => l.id !== id)
      }));
    } catch (error) {
      console.error(`Failed to delete location with ID ${id}:`, error);
      throw error;
    }
  }
}));
