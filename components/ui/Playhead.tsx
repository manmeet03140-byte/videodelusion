'use client';

import { useEffect, useRef, useState } from 'react';

const CHAPTERS = [
  { pct: 0,    label: 'HERO',    tc: '01:00:00:00' },
  { pct: 0.33, label: 'WORK',    tc: '01:30:00:00' },
  { pct: 0.66, label: 'CONTACT', tc: '02:00:00:00' },
];

export default function Playhead() {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const p = scrollable > 0 ? window.scrollY / scrollable : 0;
      setProgress(p);
      rafRef.current = requestAnimationFrame(update);
    };
    rafRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Derive timecode from progress
  const totalSeconds = progress * 3600; // 1-hour "film"
  const hours   = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const frames  = Math.floor((totalSeconds % 1) * 24);
  const tc = `${String(hours + 1).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(frames).padStart(2, '0')}`;

  // Active chapter
  const chapter = [...CHAPTERS].reverse().find((c) => progress >= c.pct) ?? CHAPTERS[0];

  return (
    <div
      id="playhead-bar"
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: 'rgba(8,8,8,0.85)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center gap-2 px-2 md:gap-4 md:px-6 py-2.5">
        {/* Play icon + TC */}
        <div className="flex items-center gap-2 shrink-0">
          <svg width="10" height="10" viewBox="0 0 10 10" className="text-cyan-400 fill-current">
            <polygon points="0,0 10,5 0,10" />
          </svg>
          <span className="text-xs font-mono tracking-widest text-white/80 tabular-nums">{tc}</span>
        </div>

        {/* Timeline track */}
        <div className="relative flex-1 h-1.5 bg-white/10 rounded-full overflow-visible">
          {/* Chapter markers */}
          {CHAPTERS.map((c) => (
            <div
              key={c.label}
              className="absolute top-0 bottom-0 w-px bg-white/20"
              style={{ left: `${c.pct * 100}%` }}
            >
              <span
                className="absolute -top-5 left-1 text-[9px] font-mono tracking-widest text-white/30 uppercase whitespace-nowrap"
              >
                {c.label}
              </span>
            </div>
          ))}

          {/* Progress fill */}
          <div
            className="absolute top-0 left-0 h-full rounded-full"
            style={{
              width: `${progress * 100}%`,
              background: 'linear-gradient(90deg, #6B7FFF, #00FFE0, #FF6B00)',
              transition: 'width 0.05s linear',
            }}
          />

          {/* Playhead cursor */}
          <div
            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white"
            style={{
              left: `${progress * 100}%`,
              transform: 'translateX(-50%) translateY(-50%)',
              background: '#00FFE0',
              boxShadow: '0 0 8px #00FFE0',
            }}
          />
        </div>

        {/* Current chapter */}
        <div className="shrink-0 text-[10px] font-mono tracking-widest text-white/40 uppercase">
          {chapter.label}
        </div>
      </div>
    </div>
  );
}
