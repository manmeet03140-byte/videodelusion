'use client';

import { create } from 'zustand';

interface UIState {
  isBeforeAfterOpen: boolean;
  isStudioManagerOpen: boolean;
  isLabsOpen: boolean;
  isWork3DActive: boolean;
  
  setBeforeAfterOpen: (open: boolean) => void;
  setStudioManagerOpen: (open: boolean) => void;
  setLabsOpen: (open: boolean) => void;
  setWork3DActive: (active: boolean) => void;
  
  closeAll: () => void;
}

export const useUIState = create<UIState>((set) => ({
  isBeforeAfterOpen: false,
  isStudioManagerOpen: false,
  isLabsOpen: false,
  isWork3DActive: false,
  
  setBeforeAfterOpen: (open) => set({ isBeforeAfterOpen: open }),
  setStudioManagerOpen: (open) => set({ isStudioManagerOpen: open }),
  setLabsOpen: (open) => set({ isLabsOpen: open }),
  setWork3DActive: (active) => set({ isWork3DActive: active }),
  
  closeAll: () => set({
    isBeforeAfterOpen: false,
    isStudioManagerOpen: false,
    isLabsOpen: false,
    isWork3DActive: false,
  }),
}));
