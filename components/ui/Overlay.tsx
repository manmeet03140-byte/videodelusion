'use client';

import { useState } from 'react';
import NavBar from './NavBar';
import ColorGrader from './ColorGrader';
import Playhead from './Playhead';
import SkillsInspector from './SkillsInspector';
import BeforeAfterSlider from './BeforeAfterSlider';
import StudioManagerFlow from './StudioManagerFlow';
import LabsPanel from './LabsPanel';

/**
 * Transparent HUD layer that sits above the WebGL canvas.
 * Contains all 2D UI elements.
 *
 * IMPORTANT: The root div has pointer-events:none so the WebGL canvas below
 * can receive mouse events for the VideoPlane glitch effect. Each interactive
 * UI element (NavBar, ColorGrader, SkillsInspector) re-enables pointer-events explicitly.
 */
export default function Overlay() {
  const [isSkillsOpen, setIsSkillsOpen] = useState(false);

  return (
    <>
      {/* Scan-line CRT overlay — purely decorative, no pointer events */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.035) 2px, rgba(0,0,0,0.035) 4px)',
          pointerEvents: 'none',
          zIndex: 15,
        }}
      />

      {/* Vignette — purely decorative */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background:
            'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.7) 100%)',
          pointerEvents: 'none',
          zIndex: 16,
        }}
      />

      {/* NavBar — interactive */}
      <NavBar onOpenSkills={() => setIsSkillsOpen(true)} />

      {/* Skills Inspector Panel */}
      <SkillsInspector isOpen={isSkillsOpen} onClose={() => setIsSkillsOpen(false)} />

      {/* New Portfolio Upgrades */}
      <BeforeAfterSlider />
      <StudioManagerFlow />
      <LabsPanel />

      {/* Scroll hint */}
      <div
        id="scroll-hint"
        style={{
          position: 'fixed',
          bottom: '6rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          pointerEvents: 'none',
          zIndex: 20,
          animation: 'live-pulse 2s ease-in-out infinite',
        }}
      >
        <span style={{ fontSize: '10px', fontFamily: 'monospace', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase' }}>
          Scroll to Scrub
        </span>
        <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)' }} />
      </div>

      {/* Color Grader panel — interactive, sits above everything */}
      <ColorGrader />

      {/* Playhead timeline — display-only, no pointer events needed */}
      <div style={{ pointerEvents: 'none', zIndex: 50, position: 'relative' }}>
        <Playhead />
      </div>
    </>
  );
}
