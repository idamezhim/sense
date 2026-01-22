import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="#4F46E5"/>
      <path d="M8 20V22H24V20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M11 18V14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 18V11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M21 18V8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function GaugeRing({ percent, active }: { percent: number; active: boolean }) {
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

function PredictionDemo() {
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

export function Landing() {
  return (
    <div className="min-h-dvh bg-[#FAFAF9] text-[#1A1A1A]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF9]/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="font-semibold text-lg">Sense</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-[#707070] hover:text-[#1A1A1A] transition-colors">Features</a>
            <Link to="/how-it-works" className="text-sm text-[#707070] hover:text-[#1A1A1A] transition-colors">How it works</Link>
            <Link
              to="/app"
              className="bg-[#1A1A1A] hover:bg-[#333] text-white px-5 py-2.5 rounded-full font-medium transition-colors text-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-semibold tracking-tight leading-[1.1] mb-6">
            Measure your product sense.
          </h1>
          <p className="text-xl text-[#707070] max-w-lg mb-8">
            Record predictions. Track outcomes.<br />
            See if your intuition is actually good.
          </p>
          <Link
            to="/app"
            className="inline-flex bg-[#1A1A1A] hover:bg-[#333] text-white px-6 py-3 rounded-full font-medium transition-colors"
          >
            Start tracking
          </Link>
        </div>
      </section>

      {/* Demo */}
      <section className="py-16 px-6">
        <div className="max-w-xl mx-auto">
          <PredictionDemo />
          <p className="text-center text-[#707070] text-sm mt-6">
            Lower scores are better. 0 = perfect, 0.25 = random.
          </p>
        </div>
      </section>

      {/* Feature Cards - Linear style */}
      <section id="features" className="py-16 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-3xl p-8 aspect-square flex flex-col group">
              <div className="flex-1 flex items-center justify-center">
                <svg className="w-24 h-24 text-indigo-400 group-hover:scale-110 transition-transform duration-500" viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="3" strokeDasharray="8 4" opacity="0.5"/>
                  <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="3"/>
                  <circle cx="50" cy="50" r="8" fill="currentColor"/>
                  <path d="M50 10 L50 25" stroke="currentColor" strokeWidth="2"/>
                  <path d="M50 75 L50 90" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 50 L25 50" stroke="currentColor" strokeWidth="2"/>
                  <path d="M75 50 L90 50" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Track predictions</h3>
                <p className="text-[#707070] text-sm">Record what you think will happen with a probability and deadline.</p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-3xl p-8 aspect-square flex flex-col group">
              <div className="flex-1 flex items-center justify-center">
                <svg className="w-24 h-24 text-emerald-400 group-hover:scale-110 transition-transform duration-500" viewBox="0 0 100 100" fill="none">
                  <rect x="15" y="60" width="12" height="25" rx="2" fill="currentColor" opacity="0.3"/>
                  <rect x="32" y="45" width="12" height="40" rx="2" fill="currentColor" opacity="0.5"/>
                  <rect x="49" y="30" width="12" height="55" rx="2" fill="currentColor" opacity="0.7"/>
                  <rect x="66" y="20" width="12" height="65" rx="2" fill="currentColor"/>
                  <path d="M15 15 Q40 35, 78 12" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" opacity="0.5"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">See your accuracy</h3>
                <p className="text-[#707070] text-sm">Brier scores show exactly how good your forecasting is.</p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-3xl p-8 aspect-square flex flex-col group">
              <div className="flex-1 flex items-center justify-center">
                <svg className="w-24 h-24 text-amber-400 group-hover:scale-110 transition-transform duration-500" viewBox="0 0 100 100" fill="none">
                  <rect x="20" y="20" width="60" height="60" rx="8" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                  <path d="M35 45 L45 55 L65 35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M30 70 L70 70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                  <path d="M35 78 L55 78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Learn from outcomes</h3>
                <p className="text-[#707070] text-sm">Add notes when closing predictions. Build a knowledge base.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature List - Linear style */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center mb-3">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v18M3 12h18" strokeLinecap="round"/>
                </svg>
              </div>
              <h4 className="font-medium mb-1">Bet types</h4>
              <p className="text-sm text-[#707070]">Categorize by type and novelty.</p>
            </div>

            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 3v18h18" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 14l4-4 4 4 5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4 className="font-medium mb-1">Metrics</h4>
              <p className="text-sm text-[#707070]">Track Growth, Retention, and more.</p>
            </div>

            <div>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center mb-3">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2"/>
                  <path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </div>
              <h4 className="font-medium mb-1">Local-first</h4>
              <p className="text-sm text-[#707070]">Data stays in your browser.</p>
            </div>

            <div>
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h4 className="font-medium mb-1">Export</h4>
              <p className="text-sm text-[#707070]">Back up and transfer data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#E5E5E5]">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-[#707070]">
          <div className="flex items-center gap-2">
            <Logo className="w-5 h-5" />
            <span>Sense</span>
          </div>
          <p>
            Made by{' '}
            <a
              href="https://twitter.com/idamezhim"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#1A1A1A] hover:underline"
            >
              Franklin Douglas
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
