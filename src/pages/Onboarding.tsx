import { useState } from 'react';

interface OnboardingProps {
  onComplete: (data: { fullName: string; company: string; email: string }) => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!company.trim()) {
      newErrors.company = 'Company is required';
    }
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onComplete({ fullName: fullName.trim(), company: company.trim(), email: email.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">S</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Welcome to Sense</h1>
          <p className="text-slate-400 mt-2">Measure Your Judgment. Not Your Luck.</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="label">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`input ${errors.fullName ? 'border-red-500' : ''}`}
                placeholder="Jane Smith"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
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
                className={`input ${errors.company ? 'border-red-500' : ''}`}
                placeholder="Acme Inc."
              />
              {errors.company && (
                <p className="text-red-500 text-sm mt-1">{errors.company}</p>
              )}
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
                className={`input ${errors.email ? 'border-red-500' : ''}`}
                placeholder="jane@acme.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div className="bg-amber-900/30 border border-amber-700 rounded-lg p-3 text-sm text-amber-200">
              <strong>Note:</strong> Your data is stored locally in your browser. It will
              be lost if you clear browser data or switch devices. Use the export feature
              to back up your data.
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Get Started
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
