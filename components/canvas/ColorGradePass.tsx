'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { wrapEffect } from '@react-three/postprocessing';
import { Vector3 } from 'three';
import { ColorGradeEffect } from '@/lib/ColorGradeEffect';
import { useColorGrade } from '@/hooks/useColorGrade';

// Wrap our custom Effect class into a React component for EffectComposer
const WrappedColorGrade = wrapEffect(ColorGradeEffect);

/**
 * Reads the Zustand color grade store every frame and updates Effect uniforms.
 * Using useFrame ensures the uniforms stay in sync with React state.
 */
export default function ColorGradePass() {
  const effectRef = useRef<ColorGradeEffect | null>(null);
  const storeRef = useRef(useColorGrade.getState());

  // Subscribe to store changes imperatively (no re-renders)
  useMemo(() => {
    useColorGrade.subscribe((state) => {
      storeRef.current = state;
    });
  }, []);

  useFrame(() => {
    if (!effectRef.current) return;
    const { lift, gamma, gain } = storeRef.current;
    
    // Convert 2D balance (x,y) + 1D luminance (z) to RGB vector
    // A simple approximation: x drives red/cyan, y drives green/magenta, and z is the master offset
    const liftV = new Vector3(lift.z + lift.x, lift.z - lift.y, lift.z - lift.x + lift.y);
    const gammaV = new Vector3(gamma.z + gamma.x, gamma.z - gamma.y, gamma.z - gamma.x + gamma.y);
    const gainV = new Vector3(gain.z + gain.x, gain.z - gain.y, gain.z - gain.x + gain.y);

    effectRef.current.setLift(liftV);
    effectRef.current.setGamma(gammaV);
    effectRef.current.setGain(gainV);
  });

  return <WrappedColorGrade ref={effectRef} />;
}
