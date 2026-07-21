'use client';

import dynamic from 'next/dynamic';
import { useScrollTimeline } from '@/hooks/useScrollTimeline';
import Overlay from '@/components/ui/Overlay';
import CustomCursor from '@/components/ui/CustomCursor';

// Dynamically import Scene with SSR disabled (Three.js requires a browser)
const Scene = dynamic(() => import('@/components/canvas/Scene'), { ssr: false });

/**
 * Root client component — composes the WebGL canvas + UI overlay.
 * Exported from here so app/page.tsx (a Server Component) can import it cleanly.
 */
export default function ClientRoot() {
  const scrollProgress = useScrollTimeline();

  return (
    <>
      {/* Custom compositor cursor (hides OS cursor via CSS in globals.css) */}
      <CustomCursor />

      {/* Fixed fullscreen WebGL background */}
      <Scene scrollProgress={scrollProgress} />

      {/* 2D HUD overlay */}
      <Overlay />

      {/*
        Tall scroll container so GSAP ScrollTrigger has room to scrub.
        The actual content is the 3D canvas — this is only needed for scrollability.
      */}
      <div style={{ height: '600vh', position: 'relative', zIndex: -1 }} aria-hidden="true" />
    </>
  );
}
