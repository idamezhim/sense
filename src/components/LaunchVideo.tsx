import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
} from 'remotion';

// Sense Logo
function Logo({ size = 80 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#4F46E5"/>
      <path d="M8 20V22H24V20" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M11 18V14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M16 18V11" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      <path d="M21 18V8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

// Animated Gauge Ring
function GaugeRing({ percent, progress }: { percent: number; progress: number }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const animatedPercent = interpolate(progress, [0, 1], [0, percent], {
    extrapolateRight: 'clamp',
  });
  const offset = circumference - (animatedPercent / 100) * circumference;

  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="6"/>
      <circle
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="#4F46E5"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 50 50)"
      />
      <text
        x="50"
        y="50"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#4F46E5"
        fontSize="18"
        fontWeight="bold"
        fontFamily="system-ui"
      >
        {Math.round(animatedPercent)}%
      </text>
    </svg>
  );
}

// Typing text animation
function TypedText({ text, progress }: { text: string; progress: number }) {
  const charsToShow = Math.floor(progress * text.length);
  const displayText = text.slice(0, charsToShow);
  const showCursor = progress < 1;

  return (
    <span style={{ fontFamily: 'system-ui' }}>
      {displayText}
      {showCursor && (
        <span style={{
          display: 'inline-block',
          width: 2,
          height: '1em',
          backgroundColor: '#4F46E5',
          marginLeft: 2,
          verticalAlign: 'middle',
        }} />
      )}
    </span>
  );
}

// Scene 1: Logo intro
function IntroScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12 } });
  const textOpacity = interpolate(frame, [15, 30], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const textY = interpolate(frame, [15, 30], [20, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAFAF9', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <div style={{ transform: `scale(${logoScale})` }}>
          <Logo size={100} />
        </div>
        <div style={{ opacity: textOpacity, transform: `translateY(${textY}px)` }}>
          <span style={{ fontSize: 36, fontWeight: 600, color: '#1A1A1A', fontFamily: 'system-ui' }}>
            Sense
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// Scene 2: Problem statement
function ProblemScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleProgress = spring({ frame, fps, config: { damping: 200 } });
  const subtitleOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAFAF9', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
      <div style={{ textAlign: 'center', maxWidth: 500 }}>
        <h2 style={{
          fontSize: 32,
          fontWeight: 600,
          color: '#1A1A1A',
          marginBottom: 16,
          opacity: titleProgress,
          transform: `translateY(${interpolate(titleProgress, [0, 1], [30, 0])}px)`,
          fontFamily: 'system-ui',
        }}>
          Is your product sense good?
        </h2>
        <p style={{
          fontSize: 18,
          color: '#707070',
          opacity: subtitleOpacity,
          lineHeight: 1.5,
          fontFamily: 'system-ui',
        }}>
          Most PMs guess. Few measure.
        </p>
      </div>
    </AbsoluteFill>
  );
}

// Scene 3: Make a prediction
function PredictionScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardScale = spring({ frame, fps, config: { damping: 15 } });
  const typingProgress = interpolate(frame, [20, 80], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const gaugeProgress = interpolate(frame, [60, 90], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAFAF9', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
      <div style={{
        transform: `scale(${cardScale})`,
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        border: '1px solid #E5E7EB',
        width: 400,
      }}>
        <div style={{ fontSize: 12, color: '#4F46E5', fontWeight: 600, marginBottom: 8, fontFamily: 'system-ui' }}>
          NEW PREDICTION
        </div>
        <div style={{
          display: 'flex',
          gap: 16,
          alignItems: 'center',
        }}>
          <GaugeRing percent={80} progress={gaugeProgress} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 16, color: '#1A1A1A', fontWeight: 500, marginBottom: 4, fontFamily: 'system-ui' }}>
              <TypedText
                text="New onboarding will increase activation by 15%"
                progress={typingProgress}
              />
            </p>
            <p style={{ fontSize: 13, color: '#909090', fontFamily: 'system-ui' }}>Due March 15, 2025</p>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// Scene 4: Close with outcome
function OutcomeScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardOpacity = spring({ frame, fps, config: { damping: 200 } });
  const buttonHover = interpolate(frame, [30, 40], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const buttonClick = interpolate(frame, [50, 55], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const resultShow = interpolate(frame, [60, 80], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAFAF9', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
      <div style={{
        opacity: cardOpacity,
        backgroundColor: 'white',
        borderRadius: 24,
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
        border: '1px solid #E5E7EB',
        width: 400,
      }}>
        <div style={{ padding: 24 }}>
          <div style={{ fontSize: 12, color: '#707070', fontWeight: 500, marginBottom: 8, fontFamily: 'system-ui' }}>
            CLOSE PREDICTION
          </div>
          <p style={{ fontSize: 14, color: '#1A1A1A', fontFamily: 'system-ui' }}>
            New onboarding will increase activation by 15%
          </p>
        </div>

        <div style={{ display: 'flex', borderTop: '1px solid #F0F0F0' }}>
          <div style={{
            flex: 1,
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            backgroundColor: buttonClick > 0.5 ? '#DCFCE7' : buttonHover > 0.5 ? '#F0FDF4' : 'white',
            transition: 'background-color 0.2s',
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#BBF7D0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: '#16A34A', fontSize: 18 }}>✓</span>
            </div>
            <span style={{ color: '#15803D', fontWeight: 600, fontFamily: 'system-ui' }}>Happened</span>
          </div>
          <div style={{
            flex: 1,
            padding: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            borderLeft: '1px solid #F0F0F0',
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: '#DC2626', fontSize: 18 }}>✗</span>
            </div>
            <span style={{ color: '#B91C1C', fontWeight: 600, fontFamily: 'system-ui' }}>Didn't happen</span>
          </div>
        </div>

        {resultShow > 0 && (
          <div style={{
            padding: 20,
            backgroundColor: '#DCFCE7',
            opacity: resultShow,
            transform: `translateY(${interpolate(resultShow, [0, 1], [10, 0])}px)`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                backgroundColor: '#BBF7D0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: '#15803D', fontFamily: 'system-ui' }}>0.04</span>
              </div>
              <div>
                <p style={{ fontWeight: 600, color: '#166534', fontFamily: 'system-ui' }}>Well calibrated!</p>
                <p style={{ fontSize: 13, color: '#15803D', fontFamily: 'system-ui' }}>Your confidence matched reality</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
}

// Scene 5: Dashboard
function DashboardScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardScale = spring({ frame, fps, config: { damping: 15 } });
  const scoreCount = interpolate(frame, [20, 60], [0.5, 0.18], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const lineProgress = interpolate(frame, [30, 80], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAFAF9', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
      <div style={{
        transform: `scale(${cardScale})`,
        backgroundColor: '#1E293B',
        borderRadius: 24,
        padding: 24,
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        width: 400,
      }}>
        <div style={{ fontSize: 14, color: 'white', fontWeight: 600, marginBottom: 16, fontFamily: 'system-ui' }}>
          Dashboard
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
          <div style={{ flex: 1, backgroundColor: '#334155', borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4, fontFamily: 'system-ui' }}>Brier Score</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: '#34D399', fontFamily: 'system-ui' }}>
              {scoreCount.toFixed(2)}
            </p>
          </div>
          <div style={{ flex: 1, backgroundColor: '#334155', borderRadius: 12, padding: 16 }}>
            <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 4, fontFamily: 'system-ui' }}>Predictions</p>
            <p style={{ fontSize: 28, fontWeight: 700, color: 'white', fontFamily: 'system-ui' }}>24</p>
          </div>
        </div>

        <div style={{ backgroundColor: '#334155', borderRadius: 12, padding: 16 }}>
          <p style={{ fontSize: 11, color: '#94A3B8', marginBottom: 8, fontFamily: 'system-ui' }}>Accuracy trend</p>
          <svg width="100%" height="60" viewBox="0 0 200 60">
            <path d="M0 50 L40 45 L80 40 L120 30 L160 22 L200 15" fill="none" stroke="#475569" strokeWidth="2"/>
            <path
              d="M0 50 L40 45 L80 40 L120 30 L160 22 L200 15"
              fill="none"
              stroke="#4F46E5"
              strokeWidth="2"
              strokeDasharray="250"
              strokeDashoffset={250 * (1 - lineProgress)}
            />
            {lineProgress > 0 && (
              <circle cx={200 * lineProgress} cy={50 - (35 * lineProgress)} r="4" fill="#4F46E5"/>
            )}
          </svg>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// Scene 6: Call to action
function CTAScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleScale = spring({ frame, fps, config: { damping: 12 } });
  const buttonScale = spring({ frame: frame - 20, fps, config: { damping: 15 } });

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAFAF9', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ transform: `scale(${titleScale})`, marginBottom: 24 }}>
          <Logo size={80} />
        </div>
        <h2 style={{
          fontSize: 28,
          fontWeight: 600,
          color: '#1A1A1A',
          marginBottom: 8,
          transform: `scale(${titleScale})`,
          fontFamily: 'system-ui',
        }}>
          Measure your product sense
        </h2>
        <p style={{
          fontSize: 16,
          color: '#707070',
          marginBottom: 24,
          fontFamily: 'system-ui',
        }}>
          Start tracking predictions today
        </p>
        <div style={{
          display: 'inline-block',
          backgroundColor: '#1A1A1A',
          color: 'white',
          padding: '14px 28px',
          borderRadius: 100,
          fontWeight: 600,
          fontSize: 16,
          transform: `scale(${Math.max(0, buttonScale)})`,
          fontFamily: 'system-ui',
        }}>
          Get Started Free
        </div>
      </div>
    </AbsoluteFill>
  );
}

// Main composition
export function LaunchVideoComposition() {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {/* Scene 1: Problem (0-2.5s) */}
      <Sequence from={0} durationInFrames={2.5 * fps}>
        <ProblemScene />
      </Sequence>

      {/* Scene 2: Make prediction (2.5-6s) */}
      <Sequence from={2.5 * fps} durationInFrames={3.5 * fps}>
        <PredictionScene />
      </Sequence>

      {/* Scene 3: Close with outcome (6-9.5s) */}
      <Sequence from={6 * fps} durationInFrames={3.5 * fps}>
        <OutcomeScene />
      </Sequence>

      {/* Scene 4: Dashboard (9.5-13s) */}
      <Sequence from={9.5 * fps} durationInFrames={3.5 * fps}>
        <DashboardScene />
      </Sequence>
    </AbsoluteFill>
  );
}

export const VIDEO_CONFIG = {
  fps: 30,
  durationInFrames: 13 * 30, // 13 seconds
  width: 600,
  height: 400,
};
