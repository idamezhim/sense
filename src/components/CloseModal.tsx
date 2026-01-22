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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-[#E8E8E8]">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Close Forecast</h2>
            <button
              onClick={onCancel}
              className="text-[#9CA3AF] hover:text-[#1A1A1A]"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Prediction Summary */}
          <div className="mb-6">
            <p className="text-lg font-medium text-[#1A1A1A] mb-3">{forecast.prediction}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[#707070]">
              <span>Target: <span className="text-[#1A1A1A]">{forecast.targetThreshold}</span></span>
              <span>Due: <span className="text-[#1A1A1A]">{new Date(forecast.byWhen).toLocaleDateString()}</span></span>
              <span>Predicted: <span className="text-indigo-600 font-semibold">{forecast.probability}%</span></span>
              <span>Created: <span className="text-[#1A1A1A]">{new Date(forecast.dateCreated).toLocaleDateString()}</span></span>
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
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      actualOutcome === level
                        ? 'border-indigo-500 bg-indigo-50 text-[#1A1A1A]'
                        : 'border-[#E5E7EB] hover:border-[#9CA3AF] hover:bg-[#F9FAFB] text-[#374151]'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
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
              className="absolute -top-10 right-0 text-white hover:text-[#9CA3AF]"
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
              <p className="text-center text-[#9CA3AF] mt-2">{forecast.imageName}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
