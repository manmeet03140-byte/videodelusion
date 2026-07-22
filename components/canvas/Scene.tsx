'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerformanceMonitor, AdaptiveDpr } from '@react-three/drei';
import CameraRig from './CameraRig';
import VideoPlane from './VideoPlane';
import ParticleField from './ParticleField';
import TimelineObjects from './TimelineObjects';
import WorkPanels from './WorkPanels';
import { useColorGrade } from '@/hooks/useColorGrade';

interface SceneProps {
  scrollProgress: React.MutableRefObject<number>;
}

/**
 * Computes a CSS filter string from Lift/Gamma/Gain values.
 * This is applied directly to the canvas element for real-time grading.
 *
 * Lift  → brightness offset (mapped: 0 lift = 100%, +0.5 lift = 150%)
 * Gamma → contrast curve (mapped: 1.0 gamma = 100% contrast)
 * Gain  → overall brightness multiplier
 */
function useCanvasFilter() {
  const { lift, gamma, gain } = useColorGrade();
  const brightnessFromLift = 100 + lift.z * 100;   // -0.5→50%, 0→100%, 0.5→150%
  const contrast           = (1 / gamma.z) * 100;   // gamma 2 → contrast 50%, gamma 0.5 → 200%
  const brightnessFromGain = gain.z * 100;          // 0→0%, 1→100%, 2→200%
  const totalBrightness    = (brightnessFromLift / 100) * (brightnessFromGain / 100) * 100;
  return `brightness(${totalBrightness.toFixed(1)}%) contrast(${contrast.toFixed(1)}%)`;
}

export default function Scene({ scrollProgress }: SceneProps) {
  const filter = useCanvasFilter();

  return (
    <Canvas
      id="main-canvas"
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      dpr={[1, 2]}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        filter, // Real-time color grade via CSS filter
        transition: 'filter 0.05s linear',
      }}
    >
      {/* Scene background color */}
      <color attach="background" args={['#080808']} />

      {/* Adaptive DPR for performance */}
      <PerformanceMonitor>
        <AdaptiveDpr pixelated />
      </PerformanceMonitor>

      {/* Lights */}
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} color="#00FFE0" />
      <directionalLight position={[-5, -3, 2]} intensity={1.0} color="#FF6B00" />
      <pointLight position={[0, 0, 4]} intensity={3} color="#ffffff" distance={12} />
      <pointLight position={[0, 2, 2]} intensity={1.5} color="#6B7FFF" distance={8} />

      {/* Fog for depth */}
      <fog attach="fog" args={['#080808', 14, 40]} />

      <Suspense fallback={null}>
        {/* Camera scroll-driven rig */}
        <CameraRig scrollProgress={scrollProgress} />

        {/* Core 3D elements */}
        <VideoPlane />
        <ParticleField />
        <TimelineObjects scrollProgress={scrollProgress} />
        <WorkPanels />
      </Suspense>
    </Canvas>
  );
}
