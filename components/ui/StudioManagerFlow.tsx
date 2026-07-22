'use client';

import { useState } from 'react';
import { useUIState } from '@/hooks/useUIState';

const STEPS = [
  { id: 'scope', title: 'Project Scope', placeholder: 'e.g., Commercial, Music Video, Short Film...' },
  { id: 'length', title: 'Video Length', placeholder: 'e.g., 60 seconds, 5 minutes...' },
  { id: 'references', title: 'Stylistic References', placeholder: 'URLs or descriptions of the vibe...' },
  { id: 'timeline', title: 'Timeline & Budget', placeholder: 'When do you need it? Estimated budget?' },
];

export default function StudioManagerFlow() {
  const { isStudioManagerOpen, setStudioManagerOpen } = useUIState();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isStudioManagerOpen) return null;

  const handleNext = () => {
    const stepId = STEPS[currentStep].id;
    setFormData(prev => ({ ...prev, [stepId]: inputValue }));
    setInputValue('');

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Submit
      setIsSubmitted(true);
      const finalData = { ...formData, [stepId]: inputValue };
      console.log('--- STUDIO MANAGER PAYLOAD ---');
      console.log(JSON.stringify(finalData, null, 2));
      console.log('------------------------------');
    }
  };

  const handleClose = () => {
    setStudioManagerOpen(false);
    // Reset after transition
    setTimeout(() => {
      setCurrentStep(0);
      setFormData({});
      setInputValue('');
      setIsSubmitted(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md transition-opacity pointer-events-auto">
      <button 
        onClick={handleClose}
        className="absolute top-8 right-8 text-white/50 hover:text-white font-mono text-sm tracking-widest transition-colors uppercase"
      >
        [ Close ]
      </button>

      <div className="w-[90vw] max-w-2xl bg-[#111] border border-[#333] p-10 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        {isSubmitted ? (
          <div className="text-center animate-pulse">
            <h2 className="text-3xl font-light text-[#00FFE0] mb-4">Brief Generated</h2>
            <p className="text-gray-400 font-mono text-sm">JSON payload logged to console.</p>
            <p className="text-gray-500 font-mono text-xs mt-8">Awaiting backend integration...</p>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
              <span className="text-[#00FFE0] font-mono text-xs tracking-widest uppercase">
                Studio Manager // Step 0{currentStep + 1}
              </span>
              <span className="text-gray-500 font-mono text-xs">
                {currentStep + 1} / {STEPS.length}
              </span>
            </div>

            <h2 className="text-3xl font-light text-white mb-6">
              {STEPS[currentStep].title}
            </h2>

            <textarea
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  if (inputValue.trim()) handleNext();
                }
              }}
              placeholder={STEPS[currentStep].placeholder}
              className="w-full bg-black border border-[#333] focus:border-[#00FFE0] text-white p-4 rounded-md font-mono text-sm h-32 resize-none outline-none transition-colors"
            />

            <div className="mt-8 flex justify-end">
              <button
                onClick={handleNext}
                disabled={!inputValue.trim()}
                className="px-8 py-3 bg-[#00FFE0]/10 border border-[#00FFE0]/50 hover:bg-[#00FFE0]/20 text-[#00FFE0] font-mono uppercase tracking-widest text-sm rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentStep === STEPS.length - 1 ? 'Generate Brief' : 'Next Step →'}
              </button>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-[#222] h-1 mt-10 rounded overflow-hidden">
              <div 
                className="bg-[#00FFE0] h-full transition-all duration-300 ease-out" 
                style={{ width: `${((currentStep) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
