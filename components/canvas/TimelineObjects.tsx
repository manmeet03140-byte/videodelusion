'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface TimelineObjectsProps {
  scrollProgress: React.MutableRefObject<number>;
}

/**
 * 3D typography + wire objects that animate in/out at specific scroll chapters.
 * Timecode labels mimic an NLE chapter marker UI.
 */
export default function TimelineObjects({ scrollProgress }: TimelineObjectsProps) {
  const nameRef = useRef<any>(null);
  const roleRef = useRef<any>(null);
  const workRef = useRef<any>(null);
  const ctaRef = useRef<any>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const torusRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock, viewport }) => {
    const p = scrollProgress.current;
    const t = clock.elapsedTime;

    // Chapter 1: Hero text fades in, ring spins
    const heroAlpha = THREE.MathUtils.smoothstep(p, 0, 0.12);
    const heroOut   = 1 - THREE.MathUtils.smoothstep(p, 0.25, 0.32);
    const heroOpacity = heroAlpha * heroOut;

    if (nameRef.current) {
      nameRef.current.fillOpacity = heroOpacity;
      nameRef.current.position.y = THREE.MathUtils.lerp(nameRef.current.position.y, 0.8 - p * 2, 0.05);
    }
    if (roleRef.current) {
      roleRef.current.fillOpacity = heroOpacity * 0.7;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = t * 0.4;
      ringRef.current.rotation.x = t * 0.15;
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity = heroOpacity * 0.5;
    }

    // Chapter 2: Work label
    const workAlpha = THREE.MathUtils.smoothstep(p, 0.33, 0.44);
    const workOut   = 1 - THREE.MathUtils.smoothstep(p, 0.60, 0.66);
    if (workRef.current) {
      workRef.current.fillOpacity = workAlpha * workOut;
    }
    if (torusRef.current) {
      torusRef.current.rotation.y = t * 0.6;
      torusRef.current.rotation.x = t * 0.25;
      (torusRef.current.material as THREE.MeshBasicMaterial).opacity = workAlpha * workOut * 0.4;
    }

    // Chapter 3: CTA
    const ctaAlpha = THREE.MathUtils.smoothstep(p, 0.70, 0.85);
    if (ctaRef.current) {
      ctaRef.current.fillOpacity = ctaAlpha;
    }

    // Scale for vertical screens to prevent cropping text
    if (groupRef.current) {
      const aspect = viewport.aspect;
      const scale = aspect < 1 ? aspect * 1.5 : 1; 
      groupRef.current.scale.setScalar(Math.min(scale, 1));
    }
  });

  return (
    <group ref={groupRef}>
      {/* ── Hero chapter ── */}
      <Text
        ref={nameRef}
        // font="/fonts/Inter-Bold.woff"
        fontSize={0.55}
        position={[0, 0.8, 0.5]}
        color="#FFFFFF"
        fillOpacity={0}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
      >
        Manmeet singh
      </Text>

      <Text
        ref={roleRef}
        // font="/fonts/Inter-Bold.woff"
        fontSize={0.18}
        position={[0, 0.18, 0.5]}
        color="#00FFE0"
        fillOpacity={0}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.25}
      >
        MOTION DESIGNER · VIDEO EDITOR · COMPOSITOR
      </Text>

      {/* Decorative ring — hero */}
      <mesh ref={ringRef} position={[0, 0, -1]}>
        <torusGeometry args={[3.5, 0.008, 8, 120]} />
        <meshBasicMaterial color="#00FFE0" transparent wireframe />
      </mesh>

      {/* ── Work chapter ── */}
      <Text
        ref={workRef}
        // font="/fonts/Inter-Bold.woff"
        fontSize={0.14}
        position={[-3, 0, 0]}
        color="#FF6B00"
        fillOpacity={0}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.3}
        rotation={[0, 0.4, 0]}
      >
        {`SELECTED WORK\n01:00:00:00 – 02:00:00:00`}
      </Text>

      {/* Decorative torus — work */}
      <mesh ref={torusRef} position={[3.5, 0, -2]}>
        <torusGeometry args={[1.2, 0.006, 6, 80]} />
        <meshBasicMaterial color="#FF6B00" transparent wireframe />
      </mesh>

      {/* ── CTA chapter ── */}
      <Text
        ref={ctaRef}
        // font="/fonts/Inter-Bold.woff"
        fontSize={0.22}
        position={[0, -0.5, 1]}
        color="#FFFFFF"
        fillOpacity={0}
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        {`GET IN TOUCH\nmanmeet03140@gmail.com`}
      </Text>
    </group>
  );
}
