'use client';

import { useUIState } from '@/hooks/useUIState';

export default function LabsPanel() {
  const { isLabsOpen, setLabsOpen } = useUIState();

  if (!isLabsOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-lg transition-opacity pointer-events-auto overflow-y-auto py-20">
      <button 
        onClick={() => setLabsOpen(false)}
        className="fixed top-8 right-8 text-white/50 hover:text-white font-mono text-sm tracking-widest transition-colors uppercase z-50 bg-black/50 px-4 py-2 rounded border border-white/10"
      >
        [ Close ]
      </button>

      <div className="w-[90vw] max-w-5xl">
        <header className="mb-16 text-center border-b border-white/10 pb-8">
          <h1 className="text-4xl md:text-6xl font-light text-white mb-4 tracking-wide">
            VFX <span className="text-[#00FFE0]">&</span> PIPELINE
          </h1>
          <p className="text-gray-400 font-mono tracking-widest uppercase text-sm">
            Architecting Visual Realities
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-[#0a0a0a] border border-[#222] hover:border-[#00FFE0]/50 transition-colors p-8 rounded-lg group">
            <div className="text-[#00FFE0] font-mono text-xs mb-6 tracking-widest border border-[#00FFE0]/30 inline-block px-2 py-1 rounded bg-[#00FFE0]/10">
              01 // NODE COMPOSITING
            </div>
            <h3 className="text-xl text-white font-light mb-4 group-hover:text-[#00FFE0] transition-colors">
              Nuke & Fusion Workflows
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Advanced multi-pass compositing using node-based architectures. Seamlessly integrating CG renders with live-action plates, handling deep data, and managing complex matte extractions for pixel-perfect integration.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-[#0a0a0a] border border-[#222] hover:border-[#FF6B00]/50 transition-colors p-8 rounded-lg group">
            <div className="text-[#FF6B00] font-mono text-xs mb-6 tracking-widest border border-[#FF6B00]/30 inline-block px-2 py-1 rounded bg-[#FF6B00]/10">
              02 // AI ENHANCEMENT
            </div>
            <h3 className="text-xl text-white font-light mb-4 group-hover:text-[#FF6B00] transition-colors">
              Neural Upscaling & Roto
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Leveraging custom AI models for sub-pixel frame interpolation, automated rotoscoping, and upscaling archival footage to 4K/8K. Reducing manual labor while increasing fidelity using Topaz and custom PyTorch pipelines.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-[#0a0a0a] border border-[#222] hover:border-[#6B7FFF]/50 transition-colors p-8 rounded-lg group">
            <div className="text-[#6B7FFF] font-mono text-xs mb-6 tracking-widest border border-[#6B7FFF]/30 inline-block px-2 py-1 rounded bg-[#6B7FFF]/10">
              03 // LIGHTING & CG
            </div>
            <h3 className="text-xl text-white font-light mb-4 group-hover:text-[#6B7FFF] transition-colors">
              Environment Relighting
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Reconstructing lighting environments using HDRIs and normal maps extracted from flat plates. Adding volumetric fog, realistic light wraps, and dynamic shadow casting to match completely virtual environments.
            </p>
          </div>
        </div>
        
        {/* Decorative Grid */}
        <div className="mt-20 h-64 border border-[#222] rounded-lg relative overflow-hidden bg-[linear-gradient(to_right,#111_1px,transparent_1px),linear-gradient(to_bottom,#111_1px,transparent_1px)] bg-[size:2rem_2rem]">
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
          <div className="absolute bottom-4 left-4 font-mono text-xs text-[#333]">SYSTEM_READY</div>
        </div>
      </div>
    </div>
  );
}
