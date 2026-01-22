import { useState } from 'react';

function Logo({ className = "w-12 h-12" }: { className?: string }) {
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
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo className="w-14 h-14" />
          </div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">Welcome to Sense</h1>
          <p className="text-[#707070] mt-2">Measure your judgment. Not your luck.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl shadow-black/5 border border-[#E8E8E8] p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full px-4 py-3 bg-[#F9FAFB] border rounded-xl text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.fullName ? 'border-red-400' : 'border-[#E5E7EB]'}`}
                placeholder="Jane Smith"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1.5">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Company
              </label>
              <input
                type="text"
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className={`w-full px-4 py-3 bg-[#F9FAFB] border rounded-xl text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.company ? 'border-red-400' : 'border-[#E5E7EB]'}`}
                placeholder="Acme Inc."
              />
              {errors.company && (
                <p className="text-red-500 text-sm mt-1.5">{errors.company}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#1A1A1A] mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full px-4 py-3 bg-[#F9FAFB] border rounded-xl text-[#1A1A1A] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${errors.email ? 'border-red-400' : 'border-[#E5E7EB]'}`}
                placeholder="jane@acme.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1.5">{errors.email}</p>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <span className="font-medium">Note:</span> Your data is stored locally in your browser. It will
              be lost if you clear browser data or switch devices. Use the export feature
              to back up your data.
            </div>

            <button
              type="submit"
              className="w-full bg-[#1A1A1A] hover:bg-[#333] text-white py-3 px-6 rounded-full font-medium transition-colors"
            >
              Get Started
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#9CA3AF] mt-6">
          Your data never leaves your device
        </p>
      </div>
    </div>
  );
}
