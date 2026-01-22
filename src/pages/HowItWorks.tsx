import { Link } from 'react-router-dom';

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

function MockInterface({ type }: { type: 'create' | 'log' | 'close' | 'dashboard' }) {
  if (type === 'create') {
    return (
      <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        <div className="p-6">
          <h3 className="text-white font-semibold mb-4">New Prediction</h3>
          <div className="space-y-4">
            <div>
              <label className="text-slate-400 text-sm block mb-1">What will happen?</label>
              <div className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-slate-300">
                New onboarding flow will increase activation by 15%
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
            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium">
              Create Prediction
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'log') {
    return (
      <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Forecast Log</h3>
            <span className="text-xs text-slate-500">3 open</span>
          </div>
          <div className="space-y-3">
            {[
              { text: 'New onboarding increases activation', prob: 80, status: 'open' },
              { text: 'Dark mode improves retention', prob: 65, status: 'open' },
              { text: 'API v2 reduces churn by 10%', prob: 70, status: 'closed', result: true },
            ].map((item, i) => (
              <div key={i} className={`rounded-lg p-4 ${item.status === 'open' ? 'bg-slate-800 border border-slate-700' : 'bg-slate-800/50'}`}>
                <div className="flex items-center justify-between">
                  <p className={`text-sm ${item.status === 'open' ? 'text-slate-200' : 'text-slate-500'}`}>{item.text}</p>
                  <span className={`text-sm font-semibold ${item.status === 'open' ? 'text-indigo-400' : 'text-emerald-500'}`}>
                    {item.status === 'open' ? `${item.prob}%` : '✓'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'close') {
    return (
      <div className="bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
        <div className="p-6">
          <h3 className="text-white font-semibold mb-2">Close Prediction</h3>
          <p className="text-slate-400 text-sm mb-4">New onboarding increases activation by 15%</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <button className="bg-emerald-600/20 border border-emerald-600 text-emerald-400 py-3 rounded-lg font-medium">
              ✓ Happened
            </button>
            <button className="bg-slate-800 border border-slate-600 text-slate-400 py-3 rounded-lg font-medium">
              ✗ Didn't happen
            </button>
          </div>
          <div>
            <label className="text-slate-400 text-sm block mb-1">Notes (optional)</label>
            <div className="bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-slate-500 text-sm">
              Activation improved from 42% to 51%...
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <path d="M0 45 L40 42 L80 38 L120 30 L160 25 L200 20" fill="none" stroke="#4F46E5" strokeWidth="2"/>
            <circle cx="200" cy="20" r="3" fill="#4F46E5"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <div className="min-h-dvh bg-[#FAFAF9] text-[#1A1A1A]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF9]/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <Logo />
            <span className="font-semibold text-lg">Sense</span>
          </Link>
          <div className="flex items-center gap-6">
            <Link to="/#features" className="text-sm text-[#707070] hover:text-[#1A1A1A] transition-colors">Features</Link>
            <Link to="/how-it-works" className="text-sm text-[#1A1A1A] font-medium">How it works</Link>
            <Link
              to="/app"
              className="bg-[#1A1A1A] hover:bg-[#333] text-white px-5 py-2.5 rounded-full font-medium transition-colors text-sm"
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
            description="When you have a hypothesis about what will happen—a feature launch, metric change, or user behavior—record it with a probability. Be specific about what you expect and when you'll know the outcome."
          >
            <MockInterface type="create" />
          </Step>

          <Step
            number={2}
            title="Track your forecasts"
            description="Your predictions live in the forecast log. See what's open, what's due soon, and your history of past predictions. Each forecast shows your confidence level at a glance."
          >
            <MockInterface type="log" />
          </Step>

          <Step
            number={3}
            title="Close with outcomes"
            description="When you know the result, close the prediction. Mark whether it happened or not, and add notes about what you learned. This creates a record of your reasoning over time."
          >
            <MockInterface type="close" />
          </Step>

          <Step
            number={4}
            title="See your accuracy"
            description="The dashboard shows your Brier score—a measure of how well-calibrated your predictions are. Lower is better. Track your improvement over time and identify patterns in where you're overconfident or underconfident."
          >
            <MockInterface type="dashboard" />
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
            <p>
              For example, if you predict something will happen with 80% confidence and it does happen, your score is (0.8 - 1)² = 0.04. If it doesn't happen, your score is (0.8 - 0)² = 0.64.
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
            Get started — it's free
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
