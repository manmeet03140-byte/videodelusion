'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Returns a ref containing the normalized scroll progress (0 → 1).
 * The value is written imperatively so it can be consumed inside
 * R3F's useFrame without triggering React re-renders.
 * The scrollable height is provided by the 600vh spacer div in ClientRoot.
 */
export function useScrollTimeline() {
  const progress = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        onUpdate: (self) => {
          progress.current = self.progress;
        },
      });
    });

    return () => {
      ctx.revert();
    };
  }, []);

  return progress;
}
