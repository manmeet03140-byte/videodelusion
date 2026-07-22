'use client';

import { useState, useRef, useEffect } from 'react';
import { useUIState } from '@/hooks/useUIState';

export default function BeforeAfterSlider() {
  const { isBeforeAfterOpen, setBeforeAfterOpen } = useUIState();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isBeforeAfterOpen) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDragging, isBeforeAfterOpen]);

  if (!isBeforeAfterOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm transition-opacity pointer-events-auto"
      style={{ opacity: isBeforeAfterOpen ? 1 : 0 }}
    >
      <button 
        onClick={() => setBeforeAfterOpen(false)}
        className="absolute top-8 right-8 text-white/50 hover:text-white font-mono text-sm tracking-widest transition-colors z-50 uppercase"
      >
        [ Close ]
      </button>

      <div 
        ref={containerRef}
        className="relative w-[90vw] max-w-6xl aspect-video bg-[#0a0a0a] rounded-lg overflow-hidden shadow-2xl cursor-ew-resize border border-white/10"
        onPointerDown={(e) => {
          setIsDragging(true);
          // Initial jump to click position
          const rect = e.currentTarget.getBoundingClientRect();
          const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
          setSliderPosition((x / rect.width) * 100);
        }}
      >
        {/* Right side (Final Grade) - Base Layer */}
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <video 
            src="/reel.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-[#00FFE0] font-mono text-xs border border-[#00FFE0]/30 tracking-widest uppercase">
            Final Grade
          </div>
        </div>

        {/* Left side (LOG / Flat) - Clipped Layer */}
        <div 
          className="absolute inset-0 h-full pointer-events-none border-r-2 border-[#00FFE0]"
          style={{ 
            width: `${sliderPosition}%`, 
            filter: 'contrast(0.7) saturate(0.3) brightness(1.2)' // Simulating LOG
          }}
        >
          <video 
            src="/reel.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="absolute top-0 left-0 w-[90vw] max-w-6xl aspect-video object-cover"
          />
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-white/70 font-mono text-xs border border-white/20 tracking-widest uppercase">
            Raw (LOG)
          </div>
        </div>

        {/* Custom Slider Handle */}
        <div 
          className="absolute top-0 bottom-0 w-1 flex items-center justify-center pointer-events-none"
          style={{ left: `calc(${sliderPosition}% - 2px)` }}
        >
          <div className="w-8 h-16 bg-[#1a1a1a] border-2 border-[#00FFE0] rounded-sm flex items-center justify-center shadow-[0_0_15px_rgba(0,255,224,0.3)]">
            <div className="w-1 h-8 flex gap-[2px]">
              <div className="w-[1px] h-full bg-[#00FFE0]/50" />
              <div className="w-[1px] h-full bg-[#00FFE0]/50" />
              <div className="w-[1px] h-full bg-[#00FFE0]/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
