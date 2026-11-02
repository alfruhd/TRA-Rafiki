import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/i18n';

interface JourneyStepsProps {
  currentStep: number | null;
  onSelectStep: (stepNumber: number) => void;
  lang: Language;
}

export const JourneySteps: React.FC<JourneyStepsProps> = ({
  currentStep,
  onSelectStep,
  lang,
}) => {
  const t = translations[lang];

  const steps = [
    { num: 1, title: t.steps.step1Title, desc: t.steps.step1Desc },
    { num: 2, title: t.steps.step2Title, desc: t.steps.step2Desc },
    { num: 3, title: t.steps.step3Title, desc: t.steps.step3Desc },
    { num: 4, title: t.steps.step4Title, desc: t.steps.step4Desc },
    { num: 5, title: t.steps.step5Title, desc: t.steps.step5Desc },
    { num: 6, title: t.steps.step6Title, desc: t.steps.step6Desc },
  ];

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-xs w-full">
      {/* Header */}
      <div className="pb-3.5 border-b border-zinc-100">
        <div className="flex items-center space-x-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
          <h2 className="text-sm font-bold text-black tracking-tight">
            {t.journeyTitle}
          </h2>
        </div>
        <p className="text-xs text-zinc-500 leading-relaxed">
          {t.journeySubtitle}
        </p>
        <div className="mt-2.5 inline-block text-[11px] font-mono font-bold text-black bg-zinc-100 px-2 py-0.5 rounded">
          {currentStep ? `${t.stepOf} ${currentStep} ${t.of} ${steps.length}` : `${steps.length} Steps Overview`}
        </div>
      </div>

      {/* Vertical Steps List */}
      <div className="space-y-2 pt-3.5">
        {steps.map((s) => {
          const isActive = currentStep === s.num;
          return (
            <button
              key={s.num}
              onClick={() => onSelectStep(s.num)}
              className={`w-full p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between group ${
                isActive
                  ? 'bg-black text-white border-black shadow-xs ring-2 ring-amber-400/40'
                  : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-800'
              }`}
            >
              <div className="flex items-start space-x-3">
                <span
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                    isActive ? 'bg-amber-400 text-black' : 'bg-zinc-200 text-zinc-700'
                  }`}
                >
                  {s.num}
                </span>
                <div>
                  <div className={`text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-black'}`}>
                    {s.title}
                  </div>
                  <div className={`text-[11px] mt-0.5 leading-snug ${isActive ? 'text-zinc-300' : 'text-zinc-500'}`}>
                    {s.desc}
                  </div>
                </div>
              </div>

              {isActive ? (
                <Check className="w-4 h-4 text-amber-400 shrink-0 ml-2" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
