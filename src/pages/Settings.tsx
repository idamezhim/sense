import { useState, useRef } from 'react';
import { UserProfile, WeightSettings, BetType, Novelty, DEFAULT_WEIGHT_SETTINGS } from '../types';
import { downloadJSON, readJSONFile, generateExportFilename, ExportData } from '../utils/export';

interface SettingsProps {
  userProfile: UserProfile | null;
  weightSettings: WeightSettings;
  onUpdateProfile: (data: { fullName: string; company: string; email: string }) => void;
  onUpdateWeights: (settings: WeightSettings) => void;
  onExport: () => ExportData;
  onImport: (data: ExportData) => void;
  onClearAll: () => void;
}

const betTypes: BetType[] = ['New Product', 'Feature', 'Iteration', 'Experiment'];
const noveltyOptions: Novelty[] = ['New Behavior', 'New Persona', 'Known Problem'];

export function Settings({
  userProfile,
  weightSettings,
  onUpdateProfile,
  onUpdateWeights,
  onExport,
  onImport,
  onClearAll,
}: SettingsProps) {
  const [fullName, setFullName] = useState(userProfile?.fullName || '');
  const [company, setCompany] = useState(userProfile?.company || '');
  const [email, setEmail] = useState(userProfile?.email || '');
  const [profileSaved, setProfileSaved] = useState(false);

  const [weights, setWeights] = useState(weightSettings);
  const [weightsSaved, setWeightsSaved] = useState(false);

  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ fullName, company, email });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const handleWeightChange = (type: 'betType' | 'novelty', key: string, value: number) => {
    setWeights((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [key]: value,
      },
    }));
  };

  const handleWeightsSave = () => {
    onUpdateWeights(weights);
    setWeightsSaved(true);
    setTimeout(() => setWeightsSaved(false), 2000);
  };

  const handleResetWeights = () => {
    setWeights(DEFAULT_WEIGHT_SETTINGS);
    onUpdateWeights(DEFAULT_WEIGHT_SETTINGS);
    setWeightsSaved(true);
    setTimeout(() => setWeightsSaved(false), 2000);
  };

  const handleExport = () => {
    const data = onExport();
    downloadJSON(data, generateExportFilename());
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImportError('');
      setImportSuccess(false);
      const data = await readJSONFile(file);
      onImport(data);
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);

      // Update local state with imported data
      if (data.userProfile) {
        setFullName(data.userProfile.fullName);
        setCompany(data.userProfile.company);
        setEmail(data.userProfile.email);
      }
      if (data.weightSettings) {
        setWeights(data.weightSettings);
      }
    } catch (error) {
      setImportError(error instanceof Error ? error.message : 'Failed to import data');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClearAll = () => {
    onClearAll();
    setShowClearConfirm(false);
    setFullName('');
    setCompany('');
    setEmail('');
    setWeights(DEFAULT_WEIGHT_SETTINGS);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1A1A1A]">Settings</h1>
        <p className="text-[#707070] mt-1">Manage your profile and preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Profile</h2>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="fullName" className="label">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input"
              />
            </div>
            <div>
              <label htmlFor="company" className="label">
                Company
              </label>
              <input
                type="text"
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="input"
              />
            </div>
          </div>
          <div>
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>
          <div className="flex items-center gap-4">
            <button type="submit" className="btn btn-primary">
              Save Profile
            </button>
            {profileSaved && (
              <span className="text-green-600 text-sm">Profile saved!</span>
            )}
          </div>
        </form>
      </div>

      {/* Weight Settings */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#1A1A1A]">Weight Settings</h2>
          <button
            onClick={handleResetWeights}
            className="text-sm text-[#707070] hover:text-[#1A1A1A]"
          >
            Reset to defaults
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-[#374151] mb-3">Bet Type Weights</h3>
            <div className="space-y-3">
              {betTypes.map((betType) => (
                <div key={betType} className="flex items-center justify-between">
                  <label className="text-sm text-[#707070]">{betType}</label>
                  <input
                    type="number"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={weights.betType[betType]}
                    onChange={(e) =>
                      handleWeightChange('betType', betType, parseFloat(e.target.value) || 1)
                    }
                    className="w-20 px-2 py-1 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#1A1A1A]"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-[#374151] mb-3">Novelty Weights</h3>
            <div className="space-y-3">
              {noveltyOptions.map((novelty) => (
                <div key={novelty} className="flex items-center justify-between">
                  <label className="text-sm text-[#707070]">{novelty}</label>
                  <input
                    type="number"
                    min="0.1"
                    max="10"
                    step="0.1"
                    value={weights.novelty[novelty]}
                    onChange={(e) =>
                      handleWeightChange('novelty', novelty, parseFloat(e.target.value) || 1)
                    }
                    className="w-20 px-2 py-1 text-sm bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg text-[#1A1A1A]"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-6">
          <button onClick={handleWeightsSave} className="btn btn-primary">
            Save Weights
          </button>
          {weightsSaved && (
            <span className="text-green-600 text-sm">Weights saved!</span>
          )}
        </div>
      </div>

      {/* Data Management */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold text-[#1A1A1A] mb-4">Data Management</h2>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <button onClick={handleExport} className="btn btn-secondary">
              Export Data (JSON)
            </button>
            <button onClick={handleImportClick} className="btn btn-secondary">
              Import Data
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {importError && (
            <p className="text-red-500 text-sm">{importError}</p>
          )}
          {importSuccess && (
            <p className="text-green-600 text-sm">Data imported successfully!</p>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            <span className="font-medium">Note:</span> Your data is stored locally in your browser. Export regularly
            to back up your forecasts.
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card border-red-200">
        <h2 className="text-lg font-semibold text-red-500 mb-4">Danger Zone</h2>

        {!showClearConfirm ? (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="btn btn-danger"
          >
            Clear All Data
          </button>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-600 mb-4">
              Are you sure you want to delete all your data? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button onClick={handleClearAll} className="btn btn-danger">
                Yes, Delete Everything
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
