import { useState } from 'react';
import { Forecast, OutcomeLevel, CloseForecastData, OUTCOME_DESCRIPTIONS } from '../types';
import { calculateBrierScore, formatBrierScore, getBrierLevel, getBrierLevelColor } from '../utils/scoring';
import { BetTypeBadge } from './ScoreBadge';

interface CloseModalProps {
  forecast: Forecast;
  onClose: (data: CloseForecastData) => void;
  onCancel: () => void;
}

const outcomeOptions: OutcomeLevel[] = [
  'Hit Target',
  'Met Target',
  'Strong Result',
  'Mixed Result',
  'Weak Result',
  'Failed',
];

export function CloseModal({ forecast, onClose, onCancel }: CloseModalProps) {
  const [actualOutcome, setActualOutcome] = useState<OutcomeLevel | null>(null);
  const [learningNote, setLearningNote] = useState('');
  const [error, setError] = useState('');
  const [showImageLightbox, setShowImageLightbox] = useState(false);

  // Preview Brier score
  const previewBrierScore = actualOutcome
    ? calculateBrierScore(forecast.probability, actualOutcome)
    : null;
  const previewBrierLevel = previewBrierScore !== null ? getBrierLevel(previewBrierScore) : null;
  const previewLevelColor = previewBrierLevel ? getBrierLevelColor(previewBrierLevel) : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actualOutcome) {
      setError('Please select an outcome level');
      return;
    }
    onClose({
      actualOutcome,
      learningNote: learningNote.trim(),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-slate-700">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Close Forecast</h2>
            <button
              onClick={onCancel}
              className="text-slate-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Original Prediction Details */}
          <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-mono text-slate-500">{forecast.id}</span>
              <BetTypeBadge betType={forecast.betType} />
            </div>
            <p className="font-medium text-white mb-2">{forecast.prediction}</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-slate-400">Target:</span>{' '}
                <span className="text-slate-200">{forecast.targetThreshold}</span>
              </div>
              <div>
                <span className="text-slate-400">By:</span>{' '}
                <span className="text-slate-200">
                  {new Date(forecast.byWhen).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-slate-400">Probability:</span>{' '}
                <span className="font-semibold text-indigo-400">{forecast.probability}%</span>
              </div>
              <div>
                <span className="text-slate-400">Weight:</span>{' '}
                <span className="text-slate-200">×{forecast.weight.toFixed(2)}</span>
              </div>
            </div>

            {/* Evidence section */}
            {forecast.evidence && (
              <div className="mt-3 pt-3 border-t border-slate-600">
                <p className="text-xs text-emerald-400 font-medium mb-1">Evidence</p>
                <p className="text-sm text-slate-300 whitespace-pre-wrap">{forecast.evidence}</p>
              </div>
            )}

            {/* Risks section */}
            {forecast.risks && (
              <div className="mt-3 pt-3 border-t border-slate-600">
                <p className="text-xs text-amber-400 font-medium mb-1">Risks</p>
                <p className="text-sm text-slate-300 whitespace-pre-wrap">{forecast.risks}</p>
              </div>
            )}

            {/* Image section */}
            {forecast.imageData && (
              <div className="mt-3 pt-3 border-t border-slate-600">
                <p className="text-xs text-blue-400 font-medium mb-2">Attached Image</p>
                <img
                  src={forecast.imageData}
                  alt={forecast.imageName || 'Attached image'}
                  className="max-w-full h-auto rounded cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ maxHeight: '150px' }}
                  onClick={() => setShowImageLightbox(true)}
                />
                {forecast.imageName && (
                  <p className="text-xs text-slate-500 mt-1">{forecast.imageName}</p>
                )}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="label">Outcome Level</label>
              <p className="text-sm text-slate-400 mb-3">
                Calculate what percentage of your target was achieved and select the appropriate level.
              </p>
              <div className="space-y-2">
                {outcomeOptions.map((outcome) => (
                  <label
                    key={outcome}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                      actualOutcome === outcome
                        ? 'border-indigo-500 bg-indigo-900/30'
                        : 'border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <input
                      type="radio"
                      name="outcome"
                      value={outcome}
                      checked={actualOutcome === outcome}
                      onChange={() => {
                        setActualOutcome(outcome);
                        setError('');
                      }}
                      className="sr-only"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-white">{outcome}</div>
                      <div className="text-sm text-slate-400">{OUTCOME_DESCRIPTIONS[outcome]}</div>
                    </div>
                    {actualOutcome === outcome && (
                      <svg className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </label>
                ))}
              </div>
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            {/* Brier Score Preview */}
            {previewBrierScore !== null && (
              <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300">Brier Score Preview</span>
                  <div className="text-right">
                    <span className="text-lg font-mono font-semibold text-white">
                      {formatBrierScore(previewBrierScore)}
                    </span>
                    <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${previewLevelColor}`}>
                      {previewBrierLevel}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  ({forecast.probability}% - {actualOutcome === 'Hit Target' ? '100' : actualOutcome === 'Met Target' ? '80' : actualOutcome === 'Strong Result' ? '60' : actualOutcome === 'Mixed Result' ? '40' : actualOutcome === 'Weak Result' ? '20' : '0'}%)² = {formatBrierScore(previewBrierScore)}
                </p>
              </div>
            )}

            <div className="mb-6">
              <label htmlFor="learningNote" className="label">
                Learning Note (optional)
              </label>
              <textarea
                id="learningNote"
                value={learningNote}
                onChange={(e) => setLearningNote(e.target.value)}
                className="input min-h-[80px]"
                placeholder="What did you learn from this prediction?"
              />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={onCancel} className="btn btn-secondary flex-1">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary flex-1">
                Close Forecast
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Image Lightbox */}
      {showImageLightbox && forecast.imageData && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[60]"
          onClick={() => setShowImageLightbox(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setShowImageLightbox(false)}
              className="absolute -top-10 right-0 text-white hover:text-slate-300"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={forecast.imageData}
              alt={forecast.imageName || 'Attached image'}
              className="max-w-full max-h-[85vh] object-contain rounded"
              onClick={(e) => e.stopPropagation()}
            />
            {forecast.imageName && (
              <p className="text-center text-slate-400 mt-2">{forecast.imageName}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
