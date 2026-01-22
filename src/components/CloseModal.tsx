import { useState } from 'react';
import { Forecast, OutcomeLevel, CloseForecastData } from '../types';

interface CloseModalProps {
  forecast: Forecast;
  onClose: (data: CloseForecastData) => void;
  onCancel: () => void;
}

const outcomeOptions: { level: OutcomeLevel; description: string }[] = [
  { level: 'Hit Target', description: '≥100% of target achieved' },
  { level: 'Met Target', description: '80-99% of target achieved' },
  { level: 'Strong Result', description: '60-79% of target achieved' },
  { level: 'Mixed Result', description: '40-59% of target achieved' },
  { level: 'Weak Result', description: '20-39% of target achieved' },
  { level: 'Failed', description: '<20% of target achieved' },
];

export function CloseModal({ forecast, onClose, onCancel }: CloseModalProps) {
  const [actualOutcome, setActualOutcome] = useState<OutcomeLevel | null>(null);
  const [learningNote, setLearningNote] = useState('');
  const [error, setError] = useState('');
  const [showImageLightbox, setShowImageLightbox] = useState(false);

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
      <div className="bg-slate-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-700">
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

          {/* Prediction Summary */}
          <div className="mb-6">
            <p className="text-lg font-medium text-white mb-3">{forecast.prediction}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-400">
              <span>Target: <span className="text-slate-200">{forecast.targetThreshold}</span></span>
              <span>Due: <span className="text-slate-200">{new Date(forecast.byWhen).toLocaleDateString()}</span></span>
              <span>Predicted: <span className="text-indigo-400 font-semibold">{forecast.probability}%</span></span>
              <span>Created: <span className="text-slate-200">{new Date(forecast.dateCreated).toLocaleDateString()}</span></span>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="label">What happened?</label>
              <div className="grid grid-cols-2 gap-2">
                {outcomeOptions.map(({ level, description }) => (
                  <button
                    key={level}
                    type="button"
                    title={description}
                    onClick={() => {
                      setActualOutcome(level);
                      setError('');
                    }}
                    className={`p-3 rounded-lg border text-left transition-colors ${
                      actualOutcome === level
                        ? 'border-indigo-500 bg-indigo-900/30 text-white'
                        : 'border-slate-600 hover:border-slate-500 hover:bg-slate-700/50 text-slate-300'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

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
