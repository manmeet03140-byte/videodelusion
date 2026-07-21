'use client';

import { useEffect, useRef } from 'react';

/**
 * Custom compositor-style crosshair cursor.
 * Replaces the default OS cursor with a neon crosshair that lags slightly.
 */
export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const pos = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', onMove);

    let raf: number;
    const animate = () => {
      smooth.current.x += (pos.current.x - smooth.current.x) * 0.12;
      smooth.current.y += (pos.current.y - smooth.current.y) * 0.12;

      if (outerRef.current) {
        outerRef.current.style.transform =
          `translate(${smooth.current.x}px, ${smooth.current.y}px)`;
      }
      if (innerRef.current) {
        innerRef.current.style.transform =
          `translate(${pos.current.x}px, ${pos.current.y}px)`;
      }
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      {/* Lagging outer ring */}
      <div
        ref={outerRef}
        id="cursor-outer"
        style={{
          position: 'fixed',
          top: -20,
          left: -20,
          width: 40,
          height: 40,
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
        }}
      >
        {/* Crosshair arms */}
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(0,255,224,0.5)', marginTop: -0.5 }} />
        <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'rgba(0,255,224,0.5)', marginLeft: -0.5 }} />
        {/* Corner brackets */}
        {[
          { top: 0, left: 0, borderTop: '1px solid #00FFE0', borderLeft: '1px solid #00FFE0' },
          { top: 0, right: 0, borderTop: '1px solid #00FFE0', borderRight: '1px solid #00FFE0' },
          { bottom: 0, left: 0, borderBottom: '1px solid #00FFE0', borderLeft: '1px solid #00FFE0' },
          { bottom: 0, right: 0, borderBottom: '1px solid #00FFE0', borderRight: '1px solid #00FFE0' },
        ].map((style, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: 8, height: 8,
              ...style,
            }}
          />
        ))}
      </div>

      {/* Precise inner dot */}
      <div
        ref={innerRef}
        id="cursor-inner"
        style={{
          position: 'fixed',
          top: -3,
          left: -3,
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#00FFE0',
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform',
          boxShadow: '0 0 6px #00FFE0',
        }}
      />
    </>
  );
}
