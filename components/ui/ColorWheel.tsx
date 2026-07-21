'use client';

import React, { useRef, useState, useEffect } from 'react';
import { ColorWheelData } from '@/hooks/useColorGrade';

interface ColorWheelProps {
  label: string;
  sub: string;
  value: ColorWheelData;
  minZ: number;
  maxZ: number;
  neutralZ: number;
  accentColor: string;
  onChange: (data: Partial<ColorWheelData>) => void;
  id: string;
}

export default function ColorWheel({
  label,
  sub,
  value,
  minZ,
  maxZ,
  neutralZ,
  accentColor,
  onChange,
  id,
}: ColorWheelProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  // Drag states
  const [isDraggingInner, setIsDraggingInner] = useState(false);
  const [isDraggingOuter, setIsDraggingOuter] = useState(false);
  
  // To calculate delta for outer ring (Master wheel)
  const lastMousePos = useRef<{ x: number, y: number } | null>(null);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isDraggingInner && svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        let dx = e.clientX - centerX;
        let dy = e.clientY - centerY;
        
        // Inner circle radius limit (e.g., radius of 50 in our local SVG coords, but we need it in screen coords)
        const screenRadius = rect.width * 0.35; // 70 / 200 = 0.35
        
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > screenRadius) {
          dx = (dx / dist) * screenRadius;
          dy = (dy / dist) * screenRadius;
        }

        // Normalize to -1 to 1
        onChange({ x: dx / screenRadius, y: dy / screenRadius });
      }

      if (isDraggingOuter && lastMousePos.current) {
        // Simple horizontal drag to adjust Z, like a jog wheel
        const deltaX = e.clientX - lastMousePos.current.x;
        // Increase sensitivity, mapping pixel drag to Z range
        const zRange = maxZ - minZ;
        const deltaZ = (deltaX * zRange) / 200; // 200px drag = full range
        
        let newZ = value.z + deltaZ;
        newZ = Math.max(minZ, Math.min(maxZ, newZ));
        
        onChange({ z: newZ });
        lastMousePos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handlePointerUp = () => {
      setIsDraggingInner(false);
      setIsDraggingOuter(false);
      lastMousePos.current = null;
    };

    if (isDraggingInner || isDraggingOuter) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDraggingInner, isDraggingOuter, minZ, maxZ, value.z, onChange]);

  const handleOuterPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDraggingOuter(true);
    lastMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handleInnerPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDraggingInner(true);
    // Also apply initial jump
    if (svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      let dx = e.clientX - centerX;
      let dy = e.clientY - centerY;
      const screenRadius = rect.width * 0.35;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > screenRadius) {
        dx = (dx / dist) * screenRadius;
        dy = (dy / dist) * screenRadius;
      }
      onChange({ x: dx / screenRadius, y: dy / screenRadius });
    }
  };

  // Convert normalized inner x/y (-1 to 1) to SVG coordinates (-70 to 70)
  const innerMarkerX = value.x * 70;
  const innerMarkerY = value.y * 70;

  // Calculate outer ring dial rotation based on Z value
  const zPct = (value.z - minZ) / (maxZ - minZ);
  // Dial rotation from -135deg to +135deg (270 degree sweep)
  const outerRotation = -135 + (zPct * 270);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
      
      {/* Label Headers */}
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: '11px', fontFamily: 'monospace', letterSpacing: '0.1em', color: accentColor, fontWeight: 700 }}>
          {label.toUpperCase()}
        </span>
        <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.35)' }}>{sub}</span>
        <div style={{ display: 'flex', gap: '8px' }}>
           <span style={{ fontSize: '10px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)' }}>Z</span>
           <span style={{ fontSize: '12px', fontFamily: 'monospace', color: 'rgba(255,255,255,0.9)', fontVariantNumeric: 'tabular-nums', width: '40px', textAlign: 'right' }}>
             {value.z.toFixed(2)}
           </span>
        </div>
      </div>

      {/* SVG Color Wheel */}
      <svg 
        id={id}
        ref={svgRef}
        viewBox="-100 -100 200 200" 
        style={{ width: '120px', height: '120px', overflow: 'visible', touchAction: 'none' }}
      >
        {/* Outer Ring Background (Master / Luminance) */}
        <circle 
          r="86" 
          cx="0" cy="0" 
          fill="none" 
          stroke="rgba(255,255,255,0.05)" 
          strokeWidth="16" 
        />
        
        {/* Outer Ring Active Arc */}
        {/* Circumference = 2 * PI * 86 = 540.35 */}
        <circle 
          r="86" 
          cx="0" cy="0" 
          fill="none" 
          stroke={accentColor} 
          strokeWidth="4" 
          strokeDasharray="540.35"
          strokeDashoffset={540.35 - (540.35 * (270 / 360) * zPct)}
          transform="rotate(135)"
          style={{ opacity: 0.6 }}
          pointerEvents="none"
        />

        {/* Outer Ring Drag Handle */}
        <g 
          transform={`rotate(${outerRotation})`} 
          onPointerDown={handleOuterPointerDown}
          style={{ cursor: isDraggingOuter ? 'grabbing' : 'grab' }}
        >
          <line x1="0" y1="-78" x2="0" y2="-94" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
          {/* Invisible hit area for easier grabbing */}
          <circle cx="0" cy="-86" r="16" fill="transparent" />
        </g>

        {/* Inner Circle Background */}
        <circle 
          r="70" 
          cx="0" cy="0" 
          fill="#1E1E1E" 
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
          onPointerDown={handleInnerPointerDown}
          style={{ cursor: 'crosshair' }}
        />

        {/* Gradient Spectral Background (like DaVinci) */}
        <defs>
          <radialGradient id="colorWheelGrad">
            <stop offset="0%" stopColor="#888" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        
        {/* Spectral colors mockup - simplified using concentric rings or a gradient */}
        <circle r="70" cx="0" cy="0" fill="url(#colorWheelGrad)" opacity="0.4" pointerEvents="none" />

        {/* Inner Crosshairs */}
        <line x1="-70" y1="0" x2="70" y2="0" stroke="rgba(255,255,255,0.1)" strokeWidth="1" pointerEvents="none" />
        <line x1="0" y1="-70" x2="0" y2="70" stroke="rgba(255,255,255,0.1)" strokeWidth="1" pointerEvents="none" />

        {/* Inner Drag Marker (X/Y balance) */}
        <g transform={`translate(${innerMarkerX}, ${innerMarkerY})`} pointerEvents="none">
          <circle r="4" fill={accentColor} />
          <circle r="8" fill="none" stroke={accentColor} strokeWidth="1.5" />
          <line x1="-10" y1="0" x2="10" y2="0" stroke="rgba(0,0,0,0.5)" strokeWidth="1" />
          <line x1="0" y1="-10" x2="0" y2="10" stroke="rgba(0,0,0,0.5)" strokeWidth="1" />
        </g>
      </svg>
      
      {/* X / Y Display */}
      <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', gap: '8px', padding: '0 4px' }}>
        <div style={{ display: 'flex', flex: 1, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', padding: '4px 6px', alignItems: 'center' }}>
          <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginRight: '6px' }}>X</span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontFamily: 'monospace', marginLeft: 'auto' }}>
            {value.x.toFixed(2)}
          </span>
        </div>
        <div style={{ display: 'flex', flex: 1, border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', padding: '4px 6px', alignItems: 'center' }}>
          <span style={{ fontSize: '9px', color: 'rgba(255,255,255,0.4)', marginRight: '6px' }}>Y</span>
          <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.8)', fontFamily: 'monospace', marginLeft: 'auto' }}>
            {(-value.y).toFixed(2)} {/* Invert Y for typical Cartesian display */}
          </span>
        </div>
      </div>

    </div>
  );
}
