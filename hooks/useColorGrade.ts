'use client';

import { create } from 'zustand';

export interface ColorWheelData {
  x: number;
  y: number;
  z: number;
}

export interface ColorGradeState {
  lift: ColorWheelData;    // z: -0.5 → 0.5  (neutral = 0)
  gamma: ColorWheelData;   // z:  0.1 → 3.0  (neutral = 1)
  gain: ColorWheelData;    // z:  0.0 → 2.0  (neutral = 1)
  setLift: (data: Partial<ColorWheelData>) => void;
  setGamma: (data: Partial<ColorWheelData>) => void;
  setGain: (data: Partial<ColorWheelData>) => void;
  reset: () => void;
}

const defaultLift = { x: 0, y: 0, z: 0 };
const defaultGamma = { x: 0, y: 0, z: 1 };
const defaultGain = { x: 0, y: 0, z: 1 };

export const useColorGrade = create<ColorGradeState>((set) => ({
  lift: { ...defaultLift },
  gamma: { ...defaultGamma },
  gain: { ...defaultGain },
  setLift: (data) => set((state) => ({ lift: { ...state.lift, ...data } })),
  setGamma: (data) => set((state) => ({ gamma: { ...state.gamma, ...data } })),
  setGain: (data) => set((state) => ({ gain: { ...state.gain, ...data } })),
  reset: () => set({ lift: { ...defaultLift }, gamma: { ...defaultGamma }, gain: { ...defaultGain } }),
}));
