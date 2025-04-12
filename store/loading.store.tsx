// useNavigationStore.ts
import { create } from 'zustand';

interface NavigationState {
  isPending: boolean;
  setPending: (state: boolean) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  isPending: false,
  setPending: (state) => set({ isPending: state }),
}));
