// BACKUP: Original PredictionDemo component from Landing.tsx
// To revert the video section, copy GaugeRing and PredictionDemo back to Landing.tsx
// and replace the video section with:
// {/* Demo */}
// <section className="py-16 px-6">
//   <div className="max-w-xl mx-auto">
//     <PredictionDemo />
//     <p className="text-center text-[#707070] text-sm mt-6">
//       Lower scores are better. 0 = perfect, 0.25 = random.
//     </p>
//   </div>
// </section>

import { useState, useEffect } from 'react';

export function GaugeRing({ percent, active }: { percent: number; active: boolean }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <svg className="w-32 h-32" viewBox="0 0 120 120">
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke="#F0F0F0"
        strokeWidth="8"
      />
      <circle
        cx="60"
        cy="60"
        r={radius}
        fill="none"
        stroke={active ? "#4F46E5" : "#E5E5E5"}
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={active ? offset : circumference}
        transform="rotate(-90 60 60)"
        className="transition-all duration-1000 ease-out"
      />
      <text
        x="60"
        y="60"
        textAnchor="middle"
        dominantBaseline="middle"
        className={`text-2xl font-bold transition-colors duration-500 ${active ? 'fill-indigo-600' : 'fill-[#A0A0A0]'}`}
        style={{ fontFamily: 'system-ui' }}
      >
        {percent}%
      </text>
    </svg>
  );
}

export function PredictionDemo() {
  const [step, setStep] = useState(0);
  const [outcome, setOutcome] = useState<'success' | 'fail' | null>(null);

  useEffect(() => {
    if (step < 2) {
      const timer = setTimeout(() => setStep(s => s + 1), 1500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  const reset = () => {
    setStep(0);
    setOutcome(null);
  };

  return (
    <div className="relative">
      {/* Main Card */}
      <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-[#E8E8E8] overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-8">
            <GaugeRing percent={80} active={step >= 1} />
            <div className="flex-1">
              <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">Prediction</span>
              <p className="text-[#1A1A1A] font-medium text-lg mt-1 leading-snug">
                New onboarding will increase activation by 15%
              </p>
              <p className="text-[#909090] text-sm mt-2">Due March 15, 2025</p>
            </div>
          </div>
        </div>

        {/* Outcome Section */}
        {step >= 2 && !outcome && (
          <div className="border-t border-[#F0F0F0] animate-fade-in">
            <div className="grid grid-cols-2 divide-x divide-[#F0F0F0]">
              <button
                onClick={() => setOutcome('success')}
                className="p-6 hover:bg-green-50/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-green-700">Happened</p>
                    <p className="text-xs text-green-600">Score: 0.04</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => setOutcome('fail')}
                className="p-6 hover:bg-red-50/50 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-red-700">Didn't happen</p>
                    <p className="text-xs text-red-600">Score: 0.64</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Result */}
        {outcome && (
          <div className={`p-6 animate-fade-in ${outcome === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  outcome === 'success' ? 'bg-green-200' : 'bg-red-200'
                }`}>
                  <span className={`text-xl font-bold tabular-nums ${
                    outcome === 'success' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {outcome === 'success' ? '0.04' : '0.64'}
                  </span>
                </div>
                <div>
                  <p className={`font-semibold ${outcome === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                    {outcome === 'success' ? 'Well calibrated' : 'Overconfident'}
                  </p>
                  <p className={`text-sm ${outcome === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {outcome === 'success' ? 'Your confidence matched reality' : 'High confidence, wrong outcome'}
                  </p>
                </div>
              </div>
              <button
                onClick={reset}
                className="text-sm text-[#707070] hover:text-[#1A1A1A] px-4 py-2 rounded-lg hover:bg-white/50 transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Caption */}
      <p className="text-center text-[#909090] text-sm mt-6">
        Lower scores = better calibration. 0 is perfect.
      </p>
    </div>
  );
}
