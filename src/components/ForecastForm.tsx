import { useState, useRef, DragEvent } from 'react';
import {
  BetType,
  SuccessMetric,
  Novelty,
  NewForecastData,
  WeightSettings,
} from '../types';
import { calculateWeight, getConfidenceBucket } from '../utils/scoring';
import {
  validateImageFile,
  compressImage,
  checkStorageQuota,
  estimateStorageSize,
  formatBytes,
} from '../utils/imageUtils';

interface ForecastFormProps {
  weightSettings: WeightSettings;
  onSubmit: (data: NewForecastData) => void;
  onCancel: () => void;
}

const betTypes: BetType[] = ['New Product', 'Feature', 'Iteration', 'Experiment'];
const successMetrics: SuccessMetric[] = [
  'Growth',
  'Monetisation',
  'Retention',
  'Activation',
  'Conversion',
  'Engagement',
  'Revenue',
  'NPS',
  'Satisfaction',
];
const noveltyOptions: Novelty[] = ['New Behavior', 'New Persona', 'Known Problem'];

export function ForecastForm({ weightSettings, onSubmit, onCancel }: ForecastFormProps) {
  const [betType, setBetType] = useState<BetType>('Feature');
  const [prediction, setPrediction] = useState('');
  const [successMetric, setSuccessMetric] = useState<SuccessMetric>('Growth');
  const [targetThreshold, setTargetThreshold] = useState('');
  const [byWhen, setByWhen] = useState('');
  const [probability, setProbability] = useState(50);
  const [novelty, setNovelty] = useState<Novelty>('Known Problem');
  const [evidence, setEvidence] = useState('');
  const [risks, setRisks] = useState('');
  const [imageData, setImageData] = useState<string | undefined>();
  const [imageName, setImageName] = useState<string | undefined>();
  const [imageError, setImageError] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const weight = calculateWeight(betType, novelty, weightSettings);
  const confidenceBucket = getConfidenceBucket(probability);

  // Fun feedback based on probability
  const getProbabilityFeedback = (prob: number) => {
    if (prob <= 10) return { emoji: '🎲', text: 'Long shot', color: 'text-slate-400' };
    if (prob <= 25) return { emoji: '🤔', text: 'Unlikely', color: 'text-amber-400' };
    if (prob <= 40) return { emoji: '⚖️', text: 'Possible', color: 'text-yellow-400' };
    if (prob <= 60) return { emoji: '🎯', text: 'Toss-up', color: 'text-blue-400' };
    if (prob <= 75) return { emoji: '📈', text: 'Likely', color: 'text-emerald-400' };
    if (prob <= 90) return { emoji: '💪', text: 'Confident', color: 'text-green-400' };
    return { emoji: '🔥', text: 'Almost certain', color: 'text-indigo-400' };
  };

  const feedback = getProbabilityFeedback(probability);

  // Quick date helpers
  const setQuickDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    setByWhen(date.toISOString().split('T')[0]);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!prediction.trim()) {
      newErrors.prediction = 'Prediction is required';
    }
    if (!targetThreshold.trim()) {
      newErrors.targetThreshold = 'Target threshold is required';
    }
    if (!byWhen) {
      newErrors.byWhen = 'Target date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageFile = async (file: File) => {
    setImageError('');
    setIsProcessingImage(true);

    try {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        setImageError(validation.error || 'Invalid image');
        return;
      }

      const compressed = await compressImage(file);
      const storageCheck = checkStorageQuota(estimateStorageSize(compressed));

      if (!storageCheck.hasRoom) {
        setImageError(
          `Not enough storage space. Current usage: ${formatBytes(storageCheck.currentUsage)}`
        );
        return;
      }

      setImageData(compressed);
      setImageName(file.name);
    } catch (err) {
      setImageError('Failed to process image');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  const removeImage = () => {
    setImageData(undefined);
    setImageName(undefined);
    setImageError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit({
        betType,
        prediction: prediction.trim(),
        successMetric,
        targetThreshold: targetThreshold.trim(),
        byWhen,
        probability,
        novelty,
        evidence: evidence.trim() || undefined,
        risks: risks.trim() || undefined,
        imageData,
        imageName,
      });
    }
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">New Forecast</h2>
        <button
          onClick={onCancel}
          className="text-slate-400 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="betType" className="label">
            Bet Type
          </label>
          <select
            id="betType"
            value={betType}
            onChange={(e) => setBetType(e.target.value as BetType)}
            className="input"
          >
            {betTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="prediction" className="label">
            What are you predicting?
          </label>
          <textarea
            id="prediction"
            value={prediction}
            onChange={(e) => setPrediction(e.target.value)}
            className={`input min-h-[80px] ${errors.prediction ? 'border-red-500' : ''}`}
            placeholder="e.g., Our new onboarding flow will increase user activation by reducing time-to-value"
          />
          {errors.prediction && (
            <p className="text-red-500 text-sm mt-1">{errors.prediction}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="successMetric" className="label">
              Success Metric
            </label>
            <select
              id="successMetric"
              value={successMetric}
              onChange={(e) => setSuccessMetric(e.target.value as SuccessMetric)}
              className="input"
            >
              {successMetrics.map((metric) => (
                <option key={metric} value={metric}>
                  {metric}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="targetThreshold" className="label">
              Target Threshold
            </label>
            <input
              type="text"
              id="targetThreshold"
              value={targetThreshold}
              onChange={(e) => setTargetThreshold(e.target.value)}
              className={`input ${errors.targetThreshold ? 'border-red-500' : ''}`}
              placeholder="e.g., 25,000 MAU"
            />
            {errors.targetThreshold && (
              <p className="text-red-500 text-sm mt-1">{errors.targetThreshold}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="byWhen" className="label">
              By When
            </label>
            <input
              type="date"
              id="byWhen"
              value={byWhen}
              onChange={(e) => setByWhen(e.target.value)}
              className={`input ${errors.byWhen ? 'border-red-500' : ''}`}
            />
            <div className="flex gap-1 mt-2">
              {[
                { label: '1w', days: 7 },
                { label: '2w', days: 14 },
                { label: '1mo', days: 30 },
                { label: '3mo', days: 90 },
              ].map((option) => (
                <button
                  key={option.label}
                  type="button"
                  onClick={() => setQuickDate(option.days)}
                  className="px-2 py-1 text-xs rounded transition-colors bg-slate-700 hover:bg-slate-600 text-slate-300"
                >
                  {option.label}
                </button>
              ))}
            </div>
            {errors.byWhen && (
              <p className="text-red-500 text-sm mt-1">{errors.byWhen}</p>
            )}
          </div>

          <div>
            <label htmlFor="novelty" className="label">
              Novelty
            </label>
            <select
              id="novelty"
              value={novelty}
              onChange={(e) => setNovelty(e.target.value as Novelty)}
              className="input"
            >
              {noveltyOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="probability" className="label">
            Your Probability
          </label>
          <div className="rounded-xl p-4 mb-2 bg-slate-700/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{feedback.emoji}</span>
                <div>
                  <span className="text-2xl font-bold tabular-nums text-white">{probability}%</span>
                  <p className={`text-sm font-medium ${feedback.color}`}>{feedback.text}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400">Bucket</span>
                <p className="text-sm font-medium text-slate-300">{confidenceBucket}</p>
              </div>
            </div>
            <input
              type="range"
              id="probability"
              min="0"
              max="100"
              value={probability}
              onChange={(e) => setProbability(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-indigo-500 bg-slate-600"
            />
            <div className="flex justify-between text-xs mt-2 text-slate-500">
              <span>Unlikely</span>
              <span>Certain</span>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="evidence" className="label">
            Evidence (optional)
          </label>
          <textarea
            id="evidence"
            value={evidence}
            onChange={(e) => setEvidence(e.target.value.slice(0, 2000))}
            className="input min-h-[80px]"
            placeholder="What data, user research, or reasoning supports this prediction?"
            maxLength={2000}
          />
          <div className="text-xs mt-1 text-right text-slate-500">
            {evidence.length}/2000
          </div>
        </div>

        <div>
          <label htmlFor="risks" className="label">
            Risks (optional)
          </label>
          <textarea
            id="risks"
            value={risks}
            onChange={(e) => setRisks(e.target.value.slice(0, 1000))}
            className="input min-h-[60px]"
            placeholder="What could cause this prediction to be wrong?"
            maxLength={1000}
          />
          <div className="text-xs mt-1 text-right text-slate-500">
            {risks.length}/1000
          </div>
        </div>

        <div>
          <label className="label">Supporting Image (optional)</label>
          <p className="text-xs mb-2 text-slate-400">
            PNG, JPG, GIF, or WebP up to 2MB (compressed to ~500KB)
          </p>

          {!imageData ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-900/20'
                  : 'border-slate-600 hover:border-slate-500'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp"
                onChange={handleFileSelect}
                className="hidden"
              />
              {isProcessingImage ? (
                <div className="text-slate-400">
                  <svg
                    className="w-8 h-8 mx-auto mb-2 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Processing image...</span>
                </div>
              ) : (
                <div className="text-slate-400">
                  <svg
                    className="w-8 h-8 mx-auto mb-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Drag & drop or click to select image</span>
                </div>
              )}
            </div>
          ) : (
            <div className="relative rounded-lg p-3 border border-slate-600">
              <div className="flex items-center gap-3">
                <img
                  src={imageData}
                  alt="Preview"
                  className="w-16 h-16 object-cover rounded"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate text-white">{imageName}</p>
                  <p className="text-xs text-slate-400">
                    {formatBytes(estimateStorageSize(imageData))} (compressed)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="text-slate-400 hover:text-red-400 p-1"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {imageError && (
            <p className="text-red-400 text-sm mt-2">{imageError}</p>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={onCancel} className="btn btn-secondary flex-1">
            Cancel
          </button>
          <button type="submit" className="btn btn-primary flex-1">
            Create Forecast
          </button>
        </div>
      </form>
    </div>
  );
}
