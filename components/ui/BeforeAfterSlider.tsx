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

      <div className="relative w-[90vw] max-w-6xl flex flex-col gap-6 items-center">
        {/* Video Container */}
        <div className="relative w-full aspect-video bg-[#0a0a0a] rounded-lg overflow-hidden shadow-2xl border border-white/10 pointer-events-none">
          <video 
            src="/16-10_1.mp4" 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover transition-all duration-75"
            style={{ 
              filter: `contrast(${0.7 + 0.3 * (sliderPosition / 100)}) saturate(${0.3 + 0.7 * (sliderPosition / 100)}) brightness(${1.2 - 0.2 * (sliderPosition / 100)})` 
            }}
          />
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-[#00FFE0] font-mono text-xs border border-[#00FFE0]/30 tracking-widest uppercase transition-opacity" style={{ opacity: sliderPosition / 100 }}>
            Final Grade
          </div>
          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur px-3 py-1 rounded text-white/70 font-mono text-xs border border-white/20 tracking-widest uppercase transition-opacity" style={{ opacity: 1 - (sliderPosition / 100) }}>
            Raw (LOG)
          </div>
        </div>

        {/* Global Color Grade Slider */}
        <div className="w-full max-w-2xl px-6 py-4 flex items-center gap-6 bg-black/80 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl">
          <span className="text-white/50 font-mono text-xs uppercase tracking-widest w-12 text-right">RAW</span>
          
          <div 
            ref={containerRef}
            className="relative flex-1 h-10 flex items-center cursor-pointer touch-none group"
            onPointerDown={(e) => {
              setIsDragging(true);
              const rect = e.currentTarget.getBoundingClientRect();
              const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
              setSliderPosition((x / rect.width) * 100);
            }}
          >
            {/* Track Background */}
            <div className="absolute left-0 right-0 h-1.5 bg-white/10 rounded-full overflow-hidden">
              {/* Active Track */}
              <div 
                className="h-full bg-gradient-to-r from-white/20 to-[#00FFE0]"
                style={{ width: `${sliderPosition}%` }}
              />
            </div>
            
            {/* Thumb */}
            <div 
              className="absolute w-6 h-6 bg-[#00FFE0] rounded-full shadow-[0_0_15px_rgba(0,255,224,0.6)] flex items-center justify-center -ml-3 pointer-events-none group-hover:scale-110 transition-transform"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="w-2 h-2 bg-black rounded-full" />
            </div>
          </div>

          <span className="text-[#00FFE0] font-mono text-xs uppercase tracking-widest w-12 text-left">GRADED</span>
        </div>
      </div>
    </div>
  );
}
