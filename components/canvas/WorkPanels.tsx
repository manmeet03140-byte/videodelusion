'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useUIState } from '@/hooks/useUIState';
import * as THREE from 'three';
import { Text, Html } from '@react-three/drei';

interface PanelProps {
  position: [number, number, number];
  title: string;
  delay: number;
}

function FloatingPanel({ position, title, delay }: PanelProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const [hovered, setHovered] = useState(false);
  
  // Mouse tracking for tilt
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Subtle float animation
    const t = state.clock.elapsedTime + delay;
    meshRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.1;
    
    // Mouse interaction tilt
    if (hovered) {
      // Normalize mouse coordinates (-1 to +1)
      const mx = (state.pointer.x * Math.PI) / 6;
      const my = -(state.pointer.y * Math.PI) / 6;
      targetRotation.current.x = my;
      targetRotation.current.y = mx;
    } else {
      targetRotation.current.x = 0;
      targetRotation.current.y = 0;
    }

    // Smooth damp rotation
    meshRef.current.rotation.x += (targetRotation.current.x - meshRef.current.rotation.x) * 0.1;
    meshRef.current.rotation.y += (targetRotation.current.y - meshRef.current.rotation.y) * 0.1;
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[3, 1.7]} />
        <meshPhysicalMaterial 
          ref={materialRef}
          color={hovered ? '#ffffff' : '#222222'}
          metalness={0.9}
          roughness={0.1}
          transmission={0.9}
          thickness={0.5}
          clearcoat={1}
        />
        
        {/* HTML Video overlay on hover */}
        {hovered && (
          <Html transform distanceFactor={5} position={[0, 0, 0.05]} pointerEvents="none">
            <div className="w-[300px] h-[170px] bg-black rounded overflow-hidden shadow-2xl relative">
              <video 
                src="/reel.mp4" 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute bottom-2 left-2 font-mono text-[8px] text-[#00FFE0] bg-black/50 px-1 border border-[#00FFE0]/30 backdrop-blur">
                PLAYING: {title}
              </div>
            </div>
          </Html>
        )}
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.15}
        color={hovered ? '#00FFE0' : '#ffffff'}
        font="/fonts/geist-mono.woff" // Assuming a monospace font or standard
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.1}
      >
        {title.toUpperCase()}
      </Text>
    </group>
  );
}

export default function WorkPanels() {
  const { isWork3DActive } = useUIState();

  if (!isWork3DActive) return null;

  return (
    <group position={[0, 0, 1]}> {/* Move slightly in front of the VideoPlane */}
      {/* Dark overlay behind panels to focus attention */}
      <mesh position={[0, 0, -0.5]}>
        <planeGeometry args={[20, 10]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.7} />
      </mesh>

      <FloatingPanel position={[-3.5, 0, 0]} title="Motion Graphics" delay={0} />
      <FloatingPanel position={[0, 0, 0]} title="Color Grading" delay={1.2} />
      <FloatingPanel position={[3.5, 0, 0]} title="3D Animation" delay={2.4} />
    </group>
  );
}
