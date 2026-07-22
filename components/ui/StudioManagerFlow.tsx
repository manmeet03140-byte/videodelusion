'use client';

import { useState } from 'react';
import { useUIState } from '@/hooks/useUIState';

const STEPS = [
  { id: 'contact', title: 'Your Details', placeholder: 'Name & Email Address...' },
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
      // Finalize and show the submission screen
      const finalData = { ...formData, [stepId]: inputValue };
      setFormData(finalData);
      setIsSubmitted(true);
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
          <div className="flex flex-col items-center text-center animate-in fade-in duration-500">
            <h2 className="text-3xl font-light text-[#00FFE0] mb-4">Brief Ready to Send</h2>
            <p className="text-gray-400 font-mono text-sm max-w-md mb-8">
              Your project details have been compiled. Click below to open your email client and send the brief directly to me.
            </p>
            
            <a 
              href={`mailto:videodelusionn@gmail.com?subject=New Project Brief from ${encodeURIComponent(formData.contact || 'Client')}&body=${encodeURIComponent(
                `Contact Details: ${formData.contact}\n\n` +
                `Project Scope: ${formData.scope}\n\n` +
                `Video Length: ${formData.length}\n\n` +
                `Stylistic References: ${formData.references}\n\n` +
                `Timeline & Budget: ${formData.timeline}`
              )}`}
              className="px-8 py-3 mb-10 bg-[#00FFE0] text-black font-bold font-mono uppercase tracking-widest text-sm rounded hover:bg-white transition-colors"
            >
              Send via Email ↗
            </a>

            <div className="w-full h-px bg-white/10 mb-8" />
            
            <p className="text-gray-500 font-mono text-xs mb-2">URGENT INQUIRIES?</p>
            <p className="text-gray-300 font-mono text-sm mb-1">
              If your project is urgent, reach out directly:
            </p>
            <p className="text-white font-mono text-sm">
              Email: <a href="mailto:videodelusionn@gmail.com" className="text-[#00FFE0] hover:underline">videodelusionn@gmail.com</a>
            </p>
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
