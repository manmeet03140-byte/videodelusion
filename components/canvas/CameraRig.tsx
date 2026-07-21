'use client';

import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MathUtils } from 'three';

interface CameraRigProps {
  scrollProgress: React.MutableRefObject<number>;
}

/**
 * Reads the normalized scroll progress and smoothly drives the camera
 * along a cinematic path — like a dolly move in an NLE timeline.
 *
 * Progress 0 → 1 maps across 3 "chapters":
 *   0.00 – 0.33  Hero   : camera pulls back, slight tilt
 *   0.33 – 0.66  Work   : camera cranes left + up
 *   0.66 – 1.00  Contact: camera pushes in on the video plane
 */
export default function CameraRig({ scrollProgress }: CameraRigProps) {
  const { camera } = useThree();
  const targetX = useRef(0);
  const targetY = useRef(0);
  const targetZ = useRef(5);

  useFrame(() => {
    const p = scrollProgress.current;

    // Chapter 1: pull back
    if (p < 0.33) {
      const t = p / 0.33;
      targetX.current = MathUtils.lerp(0, -1.5, t);
      targetY.current = MathUtils.lerp(0, 0.5, t);
      targetZ.current = MathUtils.lerp(5, 8, t);
    }
    // Chapter 2: crane left + rise
    else if (p < 0.66) {
      const t = (p - 0.33) / 0.33;
      targetX.current = MathUtils.lerp(-1.5, 2, t);
      targetY.current = MathUtils.lerp(0.5, -0.8, t);
      targetZ.current = MathUtils.lerp(8, 6, t);
    }
    // Chapter 3: push into the video plane
    else {
      const t = (p - 0.66) / 0.34;
      targetX.current = MathUtils.lerp(2, 0, t);
      targetY.current = MathUtils.lerp(-0.8, 0, t);
      targetZ.current = MathUtils.lerp(6, 3.2, t);
    }

    // Smooth damping (cinematic inertia)
    camera.position.x = MathUtils.lerp(camera.position.x, targetX.current, 0.04);
    camera.position.y = MathUtils.lerp(camera.position.y, targetY.current, 0.04);
    camera.position.z = MathUtils.lerp(camera.position.z, targetZ.current, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return null;
}
