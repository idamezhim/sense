import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { Player } from '@remotion/player';
import { LaunchVideoComposition, VIDEO_CONFIG } from '../components/LaunchVideo';

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

function MobileNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAF9]/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <Logo />
          <span className="font-semibold text-lg">Sense</span>
        </div>
        <div className="flex items-center gap-3 sm:gap-6">
          <a href="#features" className="hidden sm:block text-sm text-[#707070] hover:text-[#1A1A1A] transition-colors">Features</a>
          <Link to="/how-it-works" className="hidden sm:block text-sm text-[#707070] hover:text-[#1A1A1A] transition-colors">How it works</Link>
          <Link
            to="/app"
            className="bg-[#1A1A1A] hover:bg-[#333] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full font-medium transition-colors text-sm"
          >
            Get Started
          </Link>
          {/* Hamburger button - mobile only */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="sm:hidden p-2 -mr-2 text-[#707070] hover:text-[#1A1A1A] transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <div className="sm:hidden bg-[#FAFAF9] border-t border-[#E5E5E5] animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            <a
              href="#features"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-sm text-[#707070] hover:text-[#1A1A1A] hover:bg-[#F0F0F0] rounded-lg transition-colors"
            >
              Features
            </a>
            <Link
              to="/how-it-works"
              onClick={() => setMenuOpen(false)}
              className="block px-3 py-2 text-sm text-[#707070] hover:text-[#1A1A1A] hover:bg-[#F0F0F0] rounded-lg transition-colors"
            >
              How it works
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

// Feature card with scroll-triggered animation for mobile
function FeatureCard({
  gradient,
  borderColor,
  iconColor,
  icon,
  title,
  description,
}: {
  gradient: string;
  borderColor: string;
  iconColor: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
          // Reset after animation completes
          setTimeout(() => {
            setIsVisible(false);
          }, 2000);
        }
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div
      ref={cardRef}
      className={`${gradient} ${borderColor} rounded-3xl p-8 aspect-square flex flex-col group`}
    >
      <div className="flex-1 flex items-center justify-center">
        <div
          className={`${iconColor} transition-transform duration-500 ${
            isVisible ? 'scale-110' : 'group-hover:scale-110'
          }`}
        >
          {icon}
        </div>
      </div>
      <div>
        <h3 className="font-semibold text-lg mb-1">{title}</h3>
        <p className="text-[#707070] text-sm">{description}</p>
      </div>
    </div>
  );
}

export function Landing() {
  return (
    <div className="min-h-dvh bg-[#FAFAF9] text-[#1A1A1A]">
      {/* Navigation */}
      <MobileNav />

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

      {/* Launch Video */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/10 border border-[#E8E8E8]">
            <Player
              component={LaunchVideoComposition}
              durationInFrames={VIDEO_CONFIG.durationInFrames}
              compositionWidth={VIDEO_CONFIG.width}
              compositionHeight={VIDEO_CONFIG.height}
              fps={VIDEO_CONFIG.fps}
              style={{ width: '100%', aspectRatio: '3/2' }}
              controls
              loop
              autoPlay
            />
          </div>
          <p className="text-center text-[#707070] text-sm mt-6">
            See how Sense helps you track and improve your prediction accuracy.
          </p>
        </div>
      </section>

      {/* Feature Cards - Linear style */}
      <section id="features" className="py-16 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-4">
            <FeatureCard
              gradient="bg-gradient-to-br from-indigo-50 to-white"
              borderColor="border border-indigo-100"
              iconColor="text-indigo-400"
              icon={
                <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="3" strokeDasharray="8 4" opacity="0.5"/>
                  <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="3"/>
                  <circle cx="50" cy="50" r="8" fill="currentColor"/>
                  <path d="M50 10 L50 25" stroke="currentColor" strokeWidth="2"/>
                  <path d="M50 75 L50 90" stroke="currentColor" strokeWidth="2"/>
                  <path d="M10 50 L25 50" stroke="currentColor" strokeWidth="2"/>
                  <path d="M75 50 L90 50" stroke="currentColor" strokeWidth="2"/>
                </svg>
              }
              title="Track predictions"
              description="Record what you think will happen with a probability and deadline."
            />

            <FeatureCard
              gradient="bg-gradient-to-br from-emerald-50 to-white"
              borderColor="border border-emerald-100"
              iconColor="text-emerald-400"
              icon={
                <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none">
                  <rect x="15" y="60" width="12" height="25" rx="2" fill="currentColor" opacity="0.3"/>
                  <rect x="32" y="45" width="12" height="40" rx="2" fill="currentColor" opacity="0.5"/>
                  <rect x="49" y="30" width="12" height="55" rx="2" fill="currentColor" opacity="0.7"/>
                  <rect x="66" y="20" width="12" height="65" rx="2" fill="currentColor"/>
                  <path d="M15 15 Q40 35, 78 12" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" opacity="0.5"/>
                </svg>
              }
              title="See your accuracy"
              description="Brier scores show exactly how good your forecasting is."
            />

            <FeatureCard
              gradient="bg-gradient-to-br from-amber-50 to-white"
              borderColor="border border-amber-100"
              iconColor="text-amber-400"
              icon={
                <svg className="w-24 h-24" viewBox="0 0 100 100" fill="none">
                  <rect x="20" y="20" width="60" height="60" rx="8" stroke="currentColor" strokeWidth="2" fill="currentColor" fillOpacity="0.1"/>
                  <path d="M35 45 L45 55 L65 35" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M30 70 L70 70" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
                  <path d="M35 78 L55 78" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
                </svg>
              }
              title="Learn from outcomes"
              description="Add notes when closing predictions. Build a knowledge base."
            />
          </div>
        </div>
      </section>

      {/* Feature List - Linear style */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
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
