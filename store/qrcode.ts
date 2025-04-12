import { create } from 'zustand';
import { QRCode } from '@/types/user';
import { persist } from 'zustand/middleware';
import { useInventoryStore } from './inventory';

interface QRCodeState {
  qrCodes: QRCode[];
  isLoadingQRCodes: boolean;
  error: string | null;
  
  // Actions
  fetchQRCodes: () => Promise<void>;
  fetchQRCodeById: (id: string) => Promise<QRCode | undefined>;
  generateQRCode: (chemicalId: string, chemicalName: string) => Promise<QRCode | undefined>;
  deleteQRCode: (id: string) => Promise<void>;
  syncWithInventory: () => Promise<void>; 
}

// Create the store with persistence to localStorage
export const useQRCodeStore = create<QRCodeState>()(
  persist(
    (set, get) => ({
      qrCodes: [],
      isLoadingQRCodes: false,
      error: null,
      
      fetchQRCodes: async () => {
        set({ isLoadingQRCodes: true, error: null });
        try {
          // No API call - just use the stored QR codes
          // Simulate a network delay for consistency
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // After fetching, sync with inventory
          await get().syncWithInventory();
          
          set({ isLoadingQRCodes: false });
        } catch (error: any) {
          console.error('Error fetching QR codes:', error);
          set({ 
            isLoadingQRCodes: false, 
            error: error.message || 'Failed to fetch QR codes'
          });
        }
      },
      
      fetchQRCodeById: async (id: string) => {
        set({ isLoadingQRCodes: true, error: null });
        try {
          // No API call - just find in the stored QR codes
          await new Promise(resolve => setTimeout(resolve, 200));
          const qrCode = get().qrCodes.find(qrCode => qrCode.id === id);
          set({ isLoadingQRCodes: false });
          return qrCode;
        } catch (error: any) {
          console.error(`Error fetching QR code ${id}:`, error);
          set({ 
            isLoadingQRCodes: false, 
            error: error.message || `Failed to fetch QR code ${id}`
          });
          return undefined;
        }
      },
      
      generateQRCode: async (chemicalId: string, chemicalName: string) => {
        set({ isLoadingQRCodes: true, error: null });
        try {
          // Generate QR code locally
          const newQRCode: QRCode = {
            id: Date.now().toString(), // Use timestamp as unique ID
            chemical_id: chemicalId,
            chemical_name: chemicalName,
            date_created: new Date().toISOString(),
            created_by: '1', // Assuming user ID 1 is the current user
          };
          
          // Update state with the new QR code
          const updatedQRCodes = [...get().qrCodes, newQRCode];
          set({ qrCodes: updatedQRCodes, isLoadingQRCodes: false });
          return newQRCode;
        } catch (error: any) {
          console.error('Error generating QR code:', error);
          set({ 
            isLoadingQRCodes: false, 
            error: error.message || 'Failed to generate QR code'
          });
          return undefined;
        }
      },
      
      deleteQRCode: async (id: string) => {
        set({ isLoadingQRCodes: true, error: null });
        try {
          // No API call - just remove from local state
          await new Promise(resolve => setTimeout(resolve, 300));
          const filteredQRCodes = get().qrCodes.filter(qrCode => qrCode.id !== id);
          set({ qrCodes: filteredQRCodes, isLoadingQRCodes: false });
        } catch (error: any) {
          console.error(`Error deleting QR code ${id}:`, error);
          set({ 
            isLoadingQRCodes: false, 
            error: error.message || `Failed to delete QR code ${id}`
          });
        }
      },
      
      syncWithInventory: async () => {
        try {
          const inventoryStore = useInventoryStore.getState();
          const { chemicals } = inventoryStore;
          
          // Get all chemical IDs from inventory
          const validChemicalIds = new Set(chemicals.map(chemical => chemical.id));
          
          // Filter out QR codes that reference non-existent chemicals
          const currentQRCodes = get().qrCodes;
          const validQRCodes = currentQRCodes.filter(qrCode => 
            validChemicalIds.has(qrCode.chemical_id)
          );
          
          // If there are QR codes that reference non-existent chemicals, update the state
          if (validQRCodes.length !== currentQRCodes.length) {
            set({ qrCodes: validQRCodes });
            console.log(`Removed ${currentQRCodes.length - validQRCodes.length} QR codes for non-existent chemicals`);
          }
        } catch (error) {
          console.error('Error syncing QR codes with inventory:', error);
        }
      }
    }),
    {
      name: 'qrcode-storage', // unique name for localStorage
      partialize: (state) => ({ qrCodes: state.qrCodes }), // only persist qrCodes
    }
  )
);
