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

function Step({ number, title, description, children }: {
  number: number;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center py-16">
      <div className={number % 2 === 0 ? 'lg:order-2' : ''}>
        <div className="flex items-center gap-3 mb-4">
          <span className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-semibold text-sm">
            {number}
          </span>
          <h2 className="text-2xl font-semibold">{title}</h2>
        </div>
        <p className="text-[#707070] text-lg leading-relaxed">{description}</p>
      </div>
      <div className={number % 2 === 0 ? 'lg:order-1' : ''}>
        {children}
      </div>
    </div>
  );
}

function CreateMock() {
  const fullText = "New onboarding flow will increase activation by 15%";
  const [displayText, setDisplayText] = useState("");
  const [step, setStep] = useState(0);
  // Steps: 0 = typing, 1 = done typing, 2 = button clicked, 3 = reset

  useEffect(() => {
    if (step === 0) {
      // Typing phase
      if (displayText.length < fullText.length) {
        const timeout = setTimeout(() => {
          setDisplayText(fullText.slice(0, displayText.length + 1));
        }, 50);
        return () => clearTimeout(timeout);
      } else {
        // Done typing, wait then click button
        const timeout = setTimeout(() => setStep(1), 800);
        return () => clearTimeout(timeout);
      }
    } else if (step === 1) {
      // Button hover/click
      const timeout = setTimeout(() => setStep(2), 600);
      return () => clearTimeout(timeout);
    } else if (step === 2) {
      // Button clicked, wait then reset
      const timeout = setTimeout(() => {
        setStep(3);
      }, 1500);
      return () => clearTimeout(timeout);
    } else if (step === 3) {
      // Reset
      setDisplayText("");
      setStep(0);
    }
  }, [displayText, step]);

  const isButtonHovered = step === 1;
  const isButtonClicked = step === 2;
  const showCursor = step === 0;

  return (
    <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
      <div className="p-6">
        <h3 className="text-white font-semibold mb-4">New Prediction</h3>
        <div className="space-y-4">
          <div>
            <label className="text-slate-400 text-sm block mb-1">What will happen?</label>
            <div className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-slate-300 min-h-[48px]">
              {displayText}
              {showCursor && (
                <span className="inline-block w-0.5 h-5 bg-indigo-400 ml-0.5 animate-pulse align-middle" />
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-slate-400 text-sm block mb-1">Probability</label>
              <div className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-indigo-400 font-semibold">
                80%
              </div>
            </div>
            <div>
              <label className="text-slate-400 text-sm block mb-1">Due date</label>
              <div className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-slate-300">
                Mar 15, 2025
              </div>
            </div>
          </div>
          <button
            className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ${
              isButtonClicked
                ? 'bg-indigo-500 text-white scale-95'
                : isButtonHovered
                  ? 'bg-indigo-500 text-white scale-[1.02]'
                  : 'bg-indigo-600 text-white'
            }`}
          >
            {isButtonClicked ? '✓ Created!' : 'Create Prediction'}
          </button>
        </div>
      </div>
    </div>
  );
}

function LogMock() {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [phase, setPhase] = useState<'scrolling' | 'paused' | 'resetting'>('scrolling');
  const maxScroll = 120; // Scroll until we see the last items

  const forecasts = [
    { text: 'New onboarding increases activation', prob: 80, status: 'open' },
    { text: 'Dark mode improves retention', prob: 65, status: 'open' },
    { text: 'API v2 reduces churn by 10%', prob: 70, status: 'closed', result: true },
    { text: 'Push notifications boost DAU', prob: 55, status: 'open' },
    { text: 'Search feature adoption > 40%', prob: 60, status: 'closed', result: false },
  ];

  useEffect(() => {
    if (phase === 'scrolling') {
      if (scrollOffset < maxScroll) {
        const timeout = setTimeout(() => {
          setScrollOffset(prev => prev + 1);
        }, 40);
        return () => clearTimeout(timeout);
      } else {
        // Reached end, pause then reset
        setPhase('paused');
      }
    } else if (phase === 'paused') {
      const timeout = setTimeout(() => {
        setPhase('resetting');
      }, 2000);
      return () => clearTimeout(timeout);
    } else if (phase === 'resetting') {
      setScrollOffset(0);
      setPhase('scrolling');
    }
  }, [scrollOffset, phase]);

  return (
    <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold">Forecast Log</h3>
          <span className="text-xs text-slate-500">3 open</span>
        </div>
        <div className="h-[180px] overflow-hidden relative">
          <div
            className="space-y-3"
            style={{
              transform: `translateY(-${scrollOffset}px)`,
              transition: phase === 'resetting' ? 'none' : 'transform 40ms linear'
            }}
          >
            {forecasts.map((item, i) => (
              <div key={i} className={`rounded-lg p-4 ${item.status === 'open' ? 'bg-slate-800 border border-slate-700' : 'bg-slate-800/50'}`}>
                <div className="flex items-center justify-between">
                  <p className={`text-sm ${item.status === 'open' ? 'text-slate-200' : 'text-slate-500'}`}>{item.text}</p>
                  <span className={`text-sm font-semibold ${item.status === 'open' ? 'text-indigo-400' : item.result ? 'text-emerald-500' : 'text-red-400'}`}>
                    {item.status === 'open' ? `${item.prob}%` : item.result ? '✓' : '✗'}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

function CloseMock() {
  const [step, setStep] = useState(0);
  const [notesText, setNotesText] = useState("");
  const fullNotes = "Activation improved from 42% to 51%...";
  // Steps: 0 = initial, 1 = hover didn't happen, 2 = hover happened, 3 = selected happened, 4 = typing notes, 5 = done

  useEffect(() => {
    if (step === 0) {
      const timeout = setTimeout(() => setStep(1), 1500);
      return () => clearTimeout(timeout);
    } else if (step === 1) {
      const timeout = setTimeout(() => setStep(2), 1000);
      return () => clearTimeout(timeout);
    } else if (step === 2) {
      const timeout = setTimeout(() => setStep(3), 1000);
      return () => clearTimeout(timeout);
    } else if (step === 3) {
      const timeout = setTimeout(() => setStep(4), 500);
      return () => clearTimeout(timeout);
    } else if (step === 4) {
      // Typing notes
      if (notesText.length < fullNotes.length) {
        const timeout = setTimeout(() => {
          setNotesText(fullNotes.slice(0, notesText.length + 1));
        }, 40);
        return () => clearTimeout(timeout);
      } else {
        setStep(5);
      }
    } else if (step === 5) {
      // Wait then reset
      const timeout = setTimeout(() => {
        setNotesText("");
        setStep(0);
      }, 2500);
      return () => clearTimeout(timeout);
    }
  }, [step, notesText]);

  const showNotesCursor = step === 4;

  return (
    <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
      <div className="p-6">
        <h3 className="text-white font-semibold mb-2">Close Prediction</h3>
        <p className="text-slate-400 text-sm mb-4">New onboarding increases activation by 15%</p>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button className={`py-3 rounded-lg font-medium transition-all duration-300 ${
            step >= 3
              ? 'bg-emerald-600 border border-emerald-500 text-white scale-[1.02]'
              : step === 2
                ? 'bg-emerald-600/30 border border-emerald-500 text-emerald-300'
                : 'bg-slate-800 border border-slate-600 text-slate-400'
          }`}>
            ✓ Happened
          </button>
          <button className={`py-3 rounded-lg font-medium transition-all duration-300 ${
            step === 1
              ? 'bg-red-600/30 border border-red-500 text-red-300'
              : 'bg-slate-800 border border-slate-600 text-slate-400'
          }`}>
            ✗ Didn't happen
          </button>
        </div>
        <div>
          <label className="text-slate-400 text-sm block mb-1">Notes (optional)</label>
          <div className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-slate-300 text-sm min-h-[44px]">
            {notesText}
            {showNotesCursor && (
              <span className="inline-block w-0.5 h-4 bg-indigo-400 ml-0.5 animate-pulse align-middle" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardMock() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => (prev >= 100 ? 0 : prev + 1));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  // Calculate path points based on progress
  const pathLength = 200;
  const visibleLength = (progress / 100) * pathLength;

  return (
    <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
      <div className="p-6">
        <h3 className="text-white font-semibold mb-4">Dashboard</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-slate-500 text-xs mb-1">Brier Score</p>
            <p className="text-2xl font-bold text-emerald-400">0.18</p>
          </div>
          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-slate-500 text-xs mb-1">Predictions</p>
            <p className="text-2xl font-bold text-slate-200">24</p>
          </div>
        </div>
        <div className="bg-slate-800 rounded-lg p-4">
          <p className="text-slate-500 text-xs mb-2">Accuracy trend</p>
          <svg className="w-full h-16" viewBox="0 0 200 60">
            {/* Background line */}
            <path
              d="M0 45 L40 42 L80 38 L120 30 L160 25 L200 20"
              fill="none"
              stroke="#334155"
              strokeWidth="2"
            />
            {/* Animated line */}
            <path
              d="M0 45 L40 42 L80 38 L120 30 L160 25 L200 20"
              fill="none"
              stroke="#4F46E5"
              strokeWidth="2"
              strokeDasharray={pathLength}
              strokeDashoffset={pathLength - visibleLength}
              className="transition-all duration-100"
            />
            {/* Animated dot */}
            {progress > 0 && (
              <circle
                cx={progress * 2}
                cy={45 - (progress * 0.25)}
                r="4"
                fill="#4F46E5"
                className="drop-shadow-lg"
              />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
}

function RomanCoin({ side }: { side: 'heads' | 'tails' | null }) {
  return (
    <svg viewBox="0 0 80 80" className="w-full h-full">
      {/* Outer rim with patina effect */}
      <circle cx="40" cy="40" r="38" fill="url(#coinGradient)" />
      <circle cx="40" cy="40" r="36" fill="none" stroke="#8B5A2B" strokeWidth="2" opacity="0.5" />
      <circle cx="40" cy="40" r="33" fill="none" stroke="#CD853F" strokeWidth="1" opacity="0.3" />

      {/* Inner detail ring */}
      <circle cx="40" cy="40" r="30" fill="none" stroke="#8B4513" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.4" />

      {side === 'heads' ? (
        // Emperor profile (simplified)
        <g>
          {/* Head silhouette */}
          <path
            d="M35 50 Q30 45 30 38 Q30 28 38 24 Q42 22 46 24 Q50 26 52 30 Q54 35 52 40 Q50 46 45 50 Z"
            fill="#654321"
            opacity="0.6"
          />
          {/* Laurel wreath */}
          <path
            d="M32 32 Q28 28 30 24 M34 30 Q30 26 32 22 M48 32 Q52 28 50 24 M46 30 Q50 26 48 22"
            stroke="#556B2F"
            strokeWidth="1.5"
            fill="none"
            opacity="0.5"
          />
          {/* CAESAR text arc */}
          <text x="40" y="18" textAnchor="middle" fontSize="6" fill="#654321" opacity="0.5" fontFamily="serif">CAESAR</text>
        </g>
      ) : side === 'tails' ? (
        // Eagle (Roman imperial symbol)
        <g>
          {/* Eagle body */}
          <path
            d="M40 25 L35 35 L30 32 L35 38 L28 45 L35 42 L38 55 L40 48 L42 55 L45 42 L52 45 L45 38 L50 32 L45 35 Z"
            fill="#654321"
            opacity="0.6"
          />
          {/* SPQR text */}
          <text x="40" y="65" textAnchor="middle" fontSize="7" fill="#654321" opacity="0.5" fontFamily="serif">SPQR</text>
        </g>
      ) : (
        // Question mark for unknown
        <text x="40" y="48" textAnchor="middle" fontSize="24" fill="#654321" opacity="0.5" fontFamily="serif">?</text>
      )}

      {/* Gradient definitions */}
      <defs>
        <radialGradient id="coinGradient" cx="35%" cy="35%">
          <stop offset="0%" stopColor="#D4A574" />
          <stop offset="40%" stopColor="#B8860B" />
          <stop offset="70%" stopColor="#8B7355" />
          <stop offset="100%" stopColor="#6B4423" />
        </radialGradient>
      </defs>
    </svg>
  );
}

function CoinFlip() {
  const [isFlipping, setIsFlipping] = useState(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // Auto-flip every 6 seconds (slower)
    const interval = setInterval(() => {
      setIsFlipping(true);
      setRotation(prev => prev + 1080 + (Math.random() > 0.5 ? 180 : 0)); // 3 full rotations

      setTimeout(() => {
        setResult(Math.random() > 0.5 ? 'heads' : 'tails');
        setIsFlipping(false);
      }, 1800); // Slower flip
    }, 6000);

    // Initial flip after delay
    setTimeout(() => {
      setIsFlipping(true);
      setRotation(1080);
      setTimeout(() => {
        setResult('heads');
        setIsFlipping(false);
      }, 1800);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="w-24 h-24 transition-transform duration-[1800ms] ease-out"
        style={{
          transform: `rotateY(${rotation}deg)`,
          transformStyle: 'preserve-3d',
          filter: 'drop-shadow(0 4px 8px rgba(107, 68, 35, 0.4))'
        }}
      >
        <RomanCoin side={result} />
      </div>
      <div className="text-center">
        <p className="text-sm text-[#707070]">
          {isFlipping ? 'Flipping...' : result ? `${result === 'heads' ? 'Heads' : 'Tails'}` : 'Watch the coin'}
        </p>
        <p className="text-xs text-[#909090] mt-1">
          50% prediction = Brier score of 0.25
        </p>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <div className="min-h-dvh bg-[#FAFAF9] text-[#1A1A1A]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF9]/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Logo />
            <span className="font-semibold text-lg">Sense</span>
          </Link>
          <div className="flex items-center gap-3 sm:gap-6">
            <Link to="/#features" className="hidden sm:block text-sm text-[#707070] hover:text-[#1A1A1A] transition-colors">Features</Link>
            <Link to="/how-it-works" className="hidden sm:block text-sm text-[#1A1A1A] font-medium">How it works</Link>
            <Link
              to="/app"
              className="bg-[#1A1A1A] hover:bg-[#333] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-medium transition-colors text-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="pt-32 pb-8 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
            How Sense works
          </h1>
          <p className="text-xl text-[#707070]">
            Track predictions, measure accuracy, and improve your product intuition over time.
          </p>
        </div>
      </section>

      {/* Steps */}
      <section className="px-6">
        <div className="max-w-5xl mx-auto divide-y divide-[#E5E5E5]">
          <Step
            number={1}
            title="Make a prediction"
            description="When you have a hypothesis about what will happen (a feature launch, metric change, or user behavior), record it with a probability. Be specific about what you expect and when you'll know the outcome."
          >
            <CreateMock />
          </Step>

          <Step
            number={2}
            title="Track your forecasts"
            description="Your predictions live in the forecast log. See what's open, what's due soon, and your history of past predictions. Each forecast shows your confidence level at a glance."
          >
            <LogMock />
          </Step>

          <Step
            number={3}
            title="Close with outcomes"
            description="When you know the result, close the prediction. Mark whether it happened or not, and add notes about what you learned. This creates a record of your reasoning over time."
          >
            <CloseMock />
          </Step>

          <Step
            number={4}
            title="See your accuracy"
            description="The dashboard shows your Brier score, a measure of how well-calibrated your predictions are. Lower is better. Track your improvement over time and identify patterns in where you're overconfident or underconfident."
          >
            <DashboardMock />
          </Step>
        </div>
      </section>

      {/* Understanding Brier Scores */}
      <section className="py-20 px-6 bg-slate-50 mt-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold mb-6">Understanding Brier scores</h2>
          <div className="space-y-4 text-[#707070] leading-relaxed">
            <p>
              The Brier score measures the accuracy of probabilistic predictions. It's calculated as the squared difference between your predicted probability and the actual outcome (1 for happened, 0 for didn't happen).
            </p>
            <div className="bg-white rounded-xl p-6 border border-[#E5E5E5] not-prose">
              <p className="font-mono text-sm mb-4">Score = (probability - outcome)²</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-4">
                  <span className="w-16 text-emerald-600 font-semibold">0.00</span>
                  <span>Perfect prediction</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-16 text-emerald-500 font-semibold">0.10</span>
                  <span>Excellent calibration</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-16 text-amber-500 font-semibold">0.25</span>
                  <span>No better than random</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-16 text-red-500 font-semibold">0.50+</span>
                  <span>Worse than guessing</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 border border-[#E5E5E5]">
              <h3 className="font-semibold text-[#1A1A1A] mb-4">The coin flip baseline</h3>
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <CoinFlip />
                <div className="flex-1 text-sm space-y-2">
                  <p>
                    Think of it like predicting a coin flip. If you always say "50% heads", you'll get a Brier score of <strong className="text-amber-600">0.25</strong> on average.
                  </p>
                  <p>
                    That's your baseline. Do better than 0.25, and you're adding real predictive value. Do worse, and you'd be better off flipping a coin.
                  </p>
                </div>
              </div>
            </div>
            <p>
              For example, if you predict something will happen with 80% confidence and it does happen, your score is (0.8 - 1)² = <strong className="text-emerald-600">0.04</strong>. If it doesn't happen, your score is (0.8 - 0)² = <strong className="text-red-600">0.64</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to measure your product sense?</h2>
          <p className="text-[#707070] mb-8">Start tracking predictions today. Your data stays in your browser.</p>
          <Link
            to="/app"
            className="inline-flex bg-[#1A1A1A] hover:bg-[#333] text-white px-8 py-4 rounded-full font-medium transition-colors text-lg"
          >
            Start Now
          </Link>
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
