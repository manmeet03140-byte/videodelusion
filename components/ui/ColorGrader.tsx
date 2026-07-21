'use client';

import { useState } from 'react';
import { useColorGrade } from '@/hooks/useColorGrade';
import ColorWheel from './ColorWheel';

export default function ColorGrader() {
  const { lift, gamma, gain, setLift, setGamma, setGain, reset } = useColorGrade();
  const [isVisible, setIsVisible] = useState(true);

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          #color-grader-panel {
            bottom: 12px !important;
            right: 12px !important;
            left: 12px !important;
            width: calc(100vw - 24px) !important;
            max-width: 420px;
          }
          .color-wheels-container {
            flex-wrap: wrap;
            justify-content: center !important;
          }
        }
      `}</style>
      <div
        id="color-grader-panel"
        style={{
        position: 'fixed',
        bottom: '72px',
        right: '24px',
        zIndex: 200,
        width: isVisible ? '420px' : 'auto',
        borderRadius: '8px',
        overflow: 'hidden',
        background: '#1c1c1c',
        border: '1px solid #333',
        boxShadow: '0 8px 30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.05)',
        pointerEvents: 'auto',
      } as React.CSSProperties}
    >
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 12px', background: '#242424', borderBottom: isVisible ? '1px solid #111' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => setIsVisible(!isVisible)}
            style={{
              background: 'none', border: 'none', color: '#ccc', cursor: 'pointer',
              fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '2px 4px', transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#ccc')}
            title={isVisible ? "Collapse panel" : "Expand panel"}
          >
            {isVisible ? '▼' : '▲'}
          </button>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff4d4d', boxShadow: '0 0 4px #ff4d4d' }} />
          <span style={{ fontSize: '11px', fontFamily: 'sans-serif', fontWeight: 600, letterSpacing: '0.05em', color: '#ccc' }}>
            Primary Wheels
          </span>
        </div>
        <button
          id="reset-grade-btn"
          onClick={reset}
          style={{
            fontSize: '10px', fontFamily: 'sans-serif', letterSpacing: '0.1em',
            textTransform: 'uppercase', color: '#888',
            background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px',
            transition: 'color 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#888')}
        >
          Reset All
        </button>
      </div>

      {isVisible && (
        <>
          {/* Wheels Container */}
          <div className="color-wheels-container" style={{ 
            padding: '20px 16px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            gap: '12px' 
          }}>
            <ColorWheel
              id="wheel-lift"
              label="Lift"
              sub="Shadows"
              value={lift}
              minZ={-0.5}
              maxZ={0.5}
              neutralZ={0}
              accentColor="#6B7FFF"
              onChange={setLift}
            />
            
            <div style={{ width: '1px', background: '#333', margin: '0 4px' }} />

            <ColorWheel
              id="wheel-gamma"
              label="Gamma"
              sub="Midtones"
              value={gamma}
              minZ={0.1}
              maxZ={3.0}
              neutralZ={1}
              accentColor="#00FFE0"
              onChange={setGamma}
            />
            
            <div style={{ width: '1px', background: '#333', margin: '0 4px' }} />

            <ColorWheel
              id="wheel-gain"
              label="Gain"
              sub="Highlights"
              value={gain}
              minZ={0.0}
              maxZ={2.0}
              neutralZ={1}
              accentColor="#FF6B00"
              onChange={setGain}
            />
          </div>

          {/* Footer / Status */}
          <div style={{
            padding: '6px 12px', borderTop: '1px solid #111', background: '#1a1a1a',
            fontSize: '9px', fontFamily: 'monospace', letterSpacing: '0.1em',
            color: '#666', textAlign: 'center',
          }}>
            DaVinci Resolve · YRGB Science
          </div>
        </>
      )}
      </div>
    </>
  );
}
