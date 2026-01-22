import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Audio,
} from 'remotion';

// Typing animation for text
function TypedText({ text, progress, color }: { text: string; progress: number; color?: string }) {
  const charsToShow = Math.floor(progress * text.length);
  const displayText = text.slice(0, charsToShow);

  return (
    <span style={{ color: color || '#1A1A1A', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>
      {displayText}
    </span>
  );
}

// Light card component matching website
function LightCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: 'white',
      boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
      borderRadius: 24,
      border: '1px solid #E8E8E8',
      ...style,
    }}>
      {children}
    </div>
  );
}

// Scene 1: Problem hook
function HookScene() {
  const frame = useCurrentFrame();

  const text1Opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const text1Y = interpolate(frame, [0, 15], [20, 0], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAFAF9', justifyContent: 'center', alignItems: 'center', padding: 60 }}>
      <p style={{
        fontSize: 44,
        fontWeight: 400,
        color: '#1A1A1A',
        textAlign: 'center',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        opacity: text1Opacity,
        transform: `translateY(${text1Y}px)`,
        lineHeight: 1.4,
      }}>
        is your product sense actually <span style={{ color: '#DC2626' }}>good</span>?
      </p>
    </AbsoluteFill>
  );
}

// Scene 2: Problem elaboration with word swap
function ProblemScene() {
  const frame = useCurrentFrame();

  const showFirst = frame < 45;
  const text1Opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const text2Opacity = interpolate(frame, [45, 60], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAFAF9', justifyContent: 'center', alignItems: 'center', padding: 60 }}>
      <p style={{
        fontSize: 44,
        fontWeight: 400,
        color: '#1A1A1A',
        textAlign: 'center',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        lineHeight: 1.4,
      }}>
        {showFirst ? (
          <span style={{ opacity: text1Opacity }}>
            most PMs <span style={{ color: '#F59E0B' }}>guess</span>.
          </span>
        ) : (
          <span style={{ opacity: text2Opacity }}>
            few actually <span style={{ color: '#10B981' }}>measure</span>.
          </span>
        )}
      </p>
    </AbsoluteFill>
  );
}

// Scene 3: Slack chat - two people arguing about a feature
function SlackChatScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const containerOpacity = spring({ frame, fps, config: { damping: 200 } });
  const msg1Opacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const msg2Opacity = interpolate(frame, [35, 50], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const msg3Opacity = interpolate(frame, [60, 75], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const msg4Opacity = interpolate(frame, [85, 100], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAFAF9', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
      <LightCard style={{ opacity: containerOpacity, width: '100%', maxWidth: 600, padding: 24 }}>
        {/* Slack header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 20,
          paddingBottom: 16,
          borderBottom: '1px solid #E5E5E5',
        }}>
          <span style={{ color: '#707070', fontSize: 14 }}>#</span>
          <span style={{ color: '#1A1A1A', fontWeight: 600, fontSize: 16, fontFamily: 'system-ui' }}>product-team</span>
        </div>

        {/* Messages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Message 1 - Sarah */}
          <div style={{ display: 'flex', gap: 12, opacity: msg1Opacity }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #EC4899, #F472B6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              flexShrink: 0,
            }}>
              👩
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                <span style={{ color: '#1A1A1A', fontWeight: 700, fontSize: 15, fontFamily: 'system-ui' }}>Sarah</span>
                <span style={{ color: '#9CA3AF', fontSize: 12, fontFamily: 'system-ui' }}>2:34 PM</span>
              </div>
              <p style={{ color: '#374151', fontSize: 15, fontFamily: 'system-ui', lineHeight: 1.5, margin: 0 }}>
                I think dark mode will increase retention by at least 20%
              </p>
            </div>
          </div>

          {/* Message 2 - Mike */}
          <div style={{ display: 'flex', gap: 12, opacity: msg2Opacity }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              flexShrink: 0,
            }}>
              👨
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                <span style={{ color: '#1A1A1A', fontWeight: 700, fontSize: 15, fontFamily: 'system-ui' }}>Mike</span>
                <span style={{ color: '#9CA3AF', fontSize: 12, fontFamily: 'system-ui' }}>2:35 PM</span>
              </div>
              <p style={{ color: '#374151', fontSize: 15, fontFamily: 'system-ui', lineHeight: 1.5, margin: 0 }}>
                No way, maybe 5% at most. Users don't care about dark mode that much
              </p>
            </div>
          </div>

          {/* Message 3 - Sarah */}
          <div style={{ display: 'flex', gap: 12, opacity: msg3Opacity }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #EC4899, #F472B6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              flexShrink: 0,
            }}>
              👩
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                <span style={{ color: '#1A1A1A', fontWeight: 700, fontSize: 15, fontFamily: 'system-ui' }}>Sarah</span>
                <span style={{ color: '#9CA3AF', fontSize: 12, fontFamily: 'system-ui' }}>2:36 PM</span>
              </div>
              <p style={{ color: '#374151', fontSize: 15, fontFamily: 'system-ui', lineHeight: 1.5, margin: 0 }}>
                Want to bet on it? 😏
              </p>
            </div>
          </div>

          {/* Message 4 - Mike */}
          <div style={{ display: 'flex', gap: 12, opacity: msg4Opacity }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 8,
              background: 'linear-gradient(135deg, #3B82F6, #60A5FA)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              flexShrink: 0,
            }}>
              👨
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                <span style={{ color: '#1A1A1A', fontWeight: 700, fontSize: 15, fontFamily: 'system-ui' }}>Mike</span>
                <span style={{ color: '#9CA3AF', fontSize: 12, fontFamily: 'system-ui' }}>2:36 PM</span>
              </div>
              <p style={{ color: '#374151', fontSize: 15, fontFamily: 'system-ui', lineHeight: 1.5, margin: 0 }}>
                How would we even track that?
              </p>
            </div>
          </div>
        </div>
      </LightCard>
    </AbsoluteFill>
  );
}

// Scene 4: Product demo - Creating a prediction (light theme)
function CreatePredictionScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardScale = spring({ frame, fps, config: { damping: 15 } });
  const typingProgress = interpolate(frame, [20, 80], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const sliderProgress = interpolate(frame, [60, 90], [50, 75], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const fieldsOpacity = interpolate(frame, [70, 85], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const buttonClick = interpolate(frame, [120, 130], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  const predictionText = "Dark mode will increase retention by 20%";
  const probability = Math.round(sliderProgress);

  // Emoji feedback based on probability
  const getEmoji = (p: number) => {
    if (p <= 40) return '⚖️';
    if (p <= 60) return '🎯';
    if (p <= 75) return '📈';
    return '💪';
  };

  const getFeedback = (p: number) => {
    if (p <= 40) return { text: 'Possible', color: '#F59E0B' };
    if (p <= 60) return { text: 'Toss-up', color: '#3B82F6' };
    if (p <= 75) return { text: 'Likely', color: '#10B981' };
    return { text: 'Confident', color: '#059669' };
  };

  const feedback = getFeedback(probability);

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAFAF9', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
      <LightCard style={{ transform: `scale(${cardScale})`, width: 500, padding: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h3 style={{ color: '#1A1A1A', fontSize: 20, fontWeight: 700, fontFamily: 'system-ui', margin: 0 }}>
            New Forecast
          </h3>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: '#F3F4F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{ color: '#9CA3AF', fontSize: 18 }}>×</span>
          </div>
        </div>

        {/* Bet Type chips */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ color: '#707070', fontSize: 13, display: 'block', marginBottom: 8, fontFamily: 'system-ui' }}>
            Bet Type
          </label>
          <div style={{ display: 'flex', gap: 8 }}>
            {['Feature', 'Experiment', 'Iteration'].map((type, i) => (
              <div key={type} style={{
                padding: '8px 16px',
                borderRadius: 8,
                backgroundColor: i === 0 ? '#4F46E5' : '#F3F4F6',
                color: i === 0 ? 'white' : '#707070',
                fontSize: 14,
                fontFamily: 'system-ui',
                fontWeight: 500,
              }}>
                {type}
              </div>
            ))}
          </div>
        </div>

        {/* Prediction text */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ color: '#707070', fontSize: 13, display: 'block', marginBottom: 8, fontFamily: 'system-ui' }}>
            What are you predicting?
          </label>
          <div style={{
            backgroundColor: '#F9FAFB',
            border: '1px solid #E5E7EB',
            borderRadius: 12,
            padding: '16px 18px',
            minHeight: 60,
          }}>
            <TypedText text={predictionText} progress={typingProgress} color="#1A1A1A" />
            {typingProgress < 1 && (
              <span style={{
                display: 'inline-block',
                width: 2,
                height: 20,
                backgroundColor: '#4F46E5',
                marginLeft: 2,
                verticalAlign: 'middle',
              }} />
            )}
          </div>
        </div>

        {/* Probability slider with emoji */}
        <div style={{ marginBottom: 20, opacity: fieldsOpacity }}>
          <label style={{ color: '#707070', fontSize: 13, display: 'block', marginBottom: 8, fontFamily: 'system-ui' }}>
            Your Probability
          </label>
          <div style={{
            backgroundColor: '#F3F4F6',
            borderRadius: 12,
            padding: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 32 }}>{getEmoji(probability)}</span>
                <div>
                  <span style={{ fontSize: 28, fontWeight: 700, color: '#1A1A1A', fontFamily: 'system-ui' }}>{probability}%</span>
                  <p style={{ fontSize: 14, fontWeight: 500, color: feedback.color, margin: 0, fontFamily: 'system-ui' }}>{feedback.text}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: 11, color: '#9CA3AF', fontFamily: 'system-ui' }}>Bucket</span>
                <p style={{ fontSize: 13, fontWeight: 500, color: '#6B7280', margin: 0, fontFamily: 'system-ui' }}>70-80%</p>
              </div>
            </div>
            {/* Slider track */}
            <div style={{
              height: 8,
              backgroundColor: '#E5E7EB',
              borderRadius: 4,
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: '100%',
                width: `${probability}%`,
                backgroundColor: '#4F46E5',
                borderRadius: 4,
              }} />
              <div style={{
                position: 'absolute',
                left: `${probability}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: 16,
                height: 16,
                backgroundColor: '#4F46E5',
                borderRadius: '50%',
                border: '2px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }} />
            </div>
          </div>
        </div>

        {/* Target & Date */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, opacity: fieldsOpacity }}>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#707070', fontSize: 13, display: 'block', marginBottom: 8, fontFamily: 'system-ui' }}>
              Target
            </label>
            <div style={{
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: 12,
              padding: '14px 16px',
              color: '#1A1A1A',
              fontSize: 15,
              fontFamily: 'system-ui',
            }}>
              +20% retention
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ color: '#707070', fontSize: 13, display: 'block', marginBottom: 8, fontFamily: 'system-ui' }}>
              By When
            </label>
            <div style={{
              backgroundColor: '#F9FAFB',
              border: '1px solid #E5E7EB',
              borderRadius: 12,
              padding: '14px 16px',
              color: '#1A1A1A',
              fontSize: 15,
              fontFamily: 'system-ui',
            }}>
              Mar 30, 2025
            </div>
          </div>
        </div>

        {/* Button */}
        <button style={{
          width: '100%',
          padding: '16px 24px',
          borderRadius: 12,
          border: 'none',
          background: buttonClick > 0.5 ? '#3730A3' : '#4F46E5',
          color: 'white',
          fontSize: 16,
          fontWeight: 600,
          fontFamily: 'system-ui',
          transform: buttonClick > 0.5 ? 'scale(0.98)' : 'scale(1)',
          boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)',
        }}>
          {buttonClick > 0.5 ? '✓ Forecast Created!' : 'Create Forecast'}
        </button>
      </LightCard>
    </AbsoluteFill>
  );
}

// Scene 5: Close prediction with result
function ClosePredictionScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardOpacity = spring({ frame, fps, config: { damping: 200 } });
  const hoverHappened = interpolate(frame, [30, 45], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const clickHappened = interpolate(frame, [50, 60], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const resultShow = interpolate(frame, [70, 90], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAFAF9', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
      <LightCard style={{ opacity: cardOpacity, width: 500, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: 24, paddingBottom: 20 }}>
          <p style={{
            fontSize: 12,
            fontWeight: 600,
            color: '#6B7280',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 12,
            fontFamily: 'system-ui'
          }}>
            Close Prediction
          </p>
          <h3 style={{
            color: '#1A1A1A',
            fontSize: 18,
            fontWeight: 600,
            fontFamily: 'system-ui',
            lineHeight: 1.4,
            margin: 0
          }}>
            New onboarding will increase activation by 15%
          </h3>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', borderTop: '1px solid #E5E7EB' }}>
          <div style={{
            flex: 1,
            padding: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            backgroundColor: clickHappened > 0.5 ? '#D1FAE5' : hoverHappened > 0.5 ? '#ECFDF5' : 'transparent',
            cursor: 'pointer',
          }}>
            <div style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#10B981',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: 'white', fontSize: 18, fontWeight: 700 }}>✓</span>
            </div>
            <span style={{ color: '#10B981', fontWeight: 600, fontSize: 16, fontFamily: 'system-ui' }}>Happened</span>
          </div>
          <div style={{
            flex: 1,
            padding: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            borderLeft: '1px solid #E5E7EB',
            cursor: 'pointer',
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
              <span style={{ color: '#EF4444', fontSize: 18 }}>✗</span>
            </div>
            <span style={{ color: '#EF4444', fontWeight: 600, fontSize: 16, fontFamily: 'system-ui' }}>Didn't happen</span>
          </div>
        </div>

        {/* Result */}
        {resultShow > 0 && (
          <div style={{
            padding: 24,
            background: 'linear-gradient(135deg, #D1FAE5, #ECFDF5)',
            borderTop: '1px solid #A7F3D0',
            opacity: resultShow,
            transform: `translateY(${interpolate(resultShow, [0, 1], [10, 0])}px)`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{
                fontSize: 32,
                fontWeight: 700,
                color: '#10B981',
                fontFamily: 'system-ui'
              }}>
                0.04
              </span>
              <div>
                <p style={{ fontWeight: 600, color: '#065F46', fontSize: 17, fontFamily: 'system-ui', marginBottom: 4, margin: 0 }}>Well calibrated!</p>
                <p style={{ fontSize: 14, color: '#059669', fontFamily: 'system-ui', margin: 0 }}>Your confidence matched reality</p>
              </div>
            </div>
          </div>
        )}
      </LightCard>
    </AbsoluteFill>
  );
}

// Scene 6: Features tagline 1
function FeatureTagline1() {
  const frame = useCurrentFrame();

  const line1Opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const line2Opacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAFAF9', justifyContent: 'center', alignItems: 'center', padding: 60 }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontSize: 40,
          fontWeight: 400,
          color: '#1A1A1A',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          opacity: line1Opacity,
          marginBottom: 16,
        }}>
          record predictions.
        </p>
        <p style={{
          fontSize: 40,
          fontWeight: 400,
          color: '#1A1A1A',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          opacity: line2Opacity,
        }}>
          track outcomes.
        </p>
      </div>
    </AbsoluteFill>
  );
}

// Scene 6: Features tagline 2
function FeatureTagline2() {
  const frame = useCurrentFrame();

  const line1Opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const line2Opacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const line3Opacity = interpolate(frame, [40, 55], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAFAF9', justifyContent: 'center', alignItems: 'center', padding: 60 }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontSize: 32,
          fontWeight: 400,
          color: '#9CA3AF',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          opacity: line1Opacity,
          marginBottom: 12,
        }}>
          brier scores for accuracy.
        </p>
        <p style={{
          fontSize: 32,
          fontWeight: 400,
          color: '#9CA3AF',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          opacity: line2Opacity,
          marginBottom: 12,
        }}>
          local-first. your data stays private.
        </p>
        <p style={{
          fontSize: 34,
          fontWeight: 600,
          color: '#1A1A1A',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          opacity: line3Opacity,
        }}>
          your intuition. measured.
        </p>
      </div>
    </AbsoluteFill>
  );
}

// Scene 7: Dashboard preview
function DashboardScene() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardScale = spring({ frame, fps, config: { damping: 15 } });
  const scoreCount = interpolate(frame, [20, 60], [0.5, 0.18], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });
  const lineProgress = interpolate(frame, [30, 80], [0, 1], { extrapolateRight: 'clamp', extrapolateLeft: 'clamp' });

  const score = scoreCount.toFixed(2);
  const isGood = scoreCount < 0.25;

  return (
    <AbsoluteFill style={{ backgroundColor: '#FAFAF9', justifyContent: 'center', alignItems: 'center', padding: 40 }}>
      <LightCard style={{ transform: `scale(${cardScale})`, width: 500, padding: 28 }}>
        <h3 style={{ color: '#1A1A1A', fontSize: 20, fontWeight: 700, marginBottom: 24, fontFamily: 'system-ui' }}>
          Dashboard
        </h3>

        <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
          {/* Brier Score card */}
          <div style={{
            flex: 1,
            padding: 20,
            background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)',
            borderRadius: 16,
            border: '1px solid #E0E7FF',
          }}>
            <p style={{ fontSize: 12, color: '#6366F1', marginBottom: 8, fontFamily: 'system-ui', fontWeight: 500 }}>Overall Brier Score</p>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
              <p style={{ fontSize: 40, fontWeight: 700, color: '#1A1A1A', fontFamily: 'system-ui', margin: 0 }}>
                {score}
              </p>
              <span style={{
                padding: '4px 12px',
                borderRadius: 20,
                backgroundColor: isGood ? '#D1FAE5' : '#FEF3C7',
                color: isGood ? '#059669' : '#D97706',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'system-ui',
              }}>
                {isGood ? 'Strong' : 'Good'}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              padding: 16,
              flex: 1,
              backgroundColor: '#F3F4F6',
              borderRadius: 12,
            }}>
              <p style={{ fontSize: 11, color: '#6B7280', marginBottom: 4, fontFamily: 'system-ui' }}>Total</p>
              <p style={{ fontSize: 28, fontWeight: 700, color: '#1A1A1A', fontFamily: 'system-ui', margin: 0 }}>24</p>
            </div>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ padding: 12, flex: 1, backgroundColor: '#EFF6FF', borderRadius: 10 }}>
                <p style={{ fontSize: 10, color: '#3B82F6', marginBottom: 2, fontFamily: 'system-ui' }}>Open</p>
                <p style={{ fontSize: 20, fontWeight: 600, color: '#2563EB', fontFamily: 'system-ui', margin: 0 }}>8</p>
              </div>
              <div style={{ padding: 12, flex: 1, backgroundColor: '#F3F4F6', borderRadius: 10 }}>
                <p style={{ fontSize: 10, color: '#6B7280', marginBottom: 2, fontFamily: 'system-ui' }}>Closed</p>
                <p style={{ fontSize: 20, fontWeight: 600, color: '#374151', fontFamily: 'system-ui', margin: 0 }}>16</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div style={{ padding: 20, backgroundColor: '#F9FAFB', borderRadius: 16, border: '1px solid #E5E7EB' }}>
          <p style={{ fontSize: 13, color: '#6B7280', marginBottom: 16, fontFamily: 'system-ui' }}>Accuracy Trend</p>
          <svg width="100%" height="90" viewBox="0 0 220 90">
            {/* Grid lines */}
            <line x1="0" y1="22" x2="220" y2="22" stroke="#E5E7EB" strokeWidth="1"/>
            <line x1="0" y1="45" x2="220" y2="45" stroke="#E5E7EB" strokeWidth="1"/>
            <line x1="0" y1="68" x2="220" y2="68" stroke="#E5E7EB" strokeWidth="1"/>

            {/* Background path */}
            <path d="M10 65 L50 60 L90 52 L130 40 L170 32 L210 22" fill="none" stroke="#E5E7EB" strokeWidth="2"/>

            {/* Animated gradient path */}
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#6366F1"/>
                <stop offset="100%" stopColor="#10B981"/>
              </linearGradient>
            </defs>
            <path
              d="M10 65 L50 60 L90 52 L130 40 L170 32 L210 22"
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="250"
              strokeDashoffset={250 * (1 - lineProgress)}
            />
            {lineProgress > 0 && (
              <circle
                cx={10 + 200 * lineProgress}
                cy={65 - (43 * lineProgress)}
                r="6"
                fill="#10B981"
                style={{ filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.4))' }}
              />
            )}
          </svg>
        </div>
      </LightCard>
    </AbsoluteFill>
  );
}

// Main composition
export function LaunchVideoComposition() {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill>
      {/* Background music */}
      <Audio src="/sense/music.mp3" volume={0.5} />

      {/* Scene 1: Hook (0-2s) */}
      <Sequence from={0} durationInFrames={2 * fps}>
        <HookScene />
      </Sequence>

      {/* Scene 2: Problem (2-5s) */}
      <Sequence from={2 * fps} durationInFrames={3 * fps}>
        <ProblemScene />
      </Sequence>

      {/* Scene 3: Slack chat - arguing about feature (5-9s) */}
      <Sequence from={5 * fps} durationInFrames={4 * fps}>
        <SlackChatScene />
      </Sequence>

      {/* Scene 4: Create prediction demo (9-14.5s) */}
      <Sequence from={9 * fps} durationInFrames={5.5 * fps}>
        <CreatePredictionScene />
      </Sequence>

      {/* Scene 5: Close prediction (14.5-18.5s) */}
      <Sequence from={14.5 * fps} durationInFrames={4 * fps}>
        <ClosePredictionScene />
      </Sequence>

      {/* Scene 6: Features tagline 1 (18.5-21s) */}
      <Sequence from={18.5 * fps} durationInFrames={2.5 * fps}>
        <FeatureTagline1 />
      </Sequence>

      {/* Scene 7: Features tagline 2 (21-25s) */}
      <Sequence from={21 * fps} durationInFrames={4 * fps}>
        <FeatureTagline2 />
      </Sequence>

      {/* Scene 8: Dashboard (25-30s) */}
      <Sequence from={25 * fps} durationInFrames={5 * fps}>
        <DashboardScene />
      </Sequence>
    </AbsoluteFill>
  );
}

export const VIDEO_CONFIG = {
  fps: 30,
  durationInFrames: 30 * 30, // 30 seconds
  width: 1080,
  height: 1080, // Square format for social media
};
