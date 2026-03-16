import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, User, Scale, Ruler, ChevronRight, Check } from 'lucide-react';

export const UserSetup: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const [profile, setProfile] = useState({
    name: '',
    weight: '',
    height: '',
    gender: 'male' as 'male' | 'female'
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else handleComplete();
  };

  const handleComplete = () => {
    setIsLoading(true);
    // Simpan ke localStorage
    localStorage.setItem('userProfile', JSON.stringify(profile));
    localStorage.setItem('isAuthenticated', 'true');
    
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  const renderStep = () => {
    switch(step) {
      case 1:
        return (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.3)]">
              <User size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">What's your name?</h2>
              <p className="text-slate-400 text-sm">We'll use this to personalize your experience</p>
            </div>
            <div className="relative">
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                placeholder="Enter your name"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 px-6 text-white text-lg text-center placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                autoFocus
              />
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(236,72,153,0.3)]">
              <Scale size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Your weight?</h2>
              <p className="text-slate-400 text-sm">Used for power calculation and calorie burn estimation</p>
            </div>
            <div className="relative max-w-[200px] mx-auto">
              <input
                type="number"
                value={profile.weight}
                onChange={(e) => setProfile({...profile, weight: e.target.value})}
                placeholder="70"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 px-6 text-white text-3xl font-bold text-center placeholder-slate-600 focus:outline-none focus:border-pink-500/50 focus:ring-2 focus:ring-pink-500/20 transition-all"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-medium">kg</span>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <Ruler size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Your height?</h2>
              <p className="text-slate-400 text-sm">Helps us calculate stride length and vertical oscillation</p>
            </div>
            <div className="relative max-w-[200px] mx-auto">
              <input
                type="number"
                value={profile.height}
                onChange={(e) => setProfile({...profile, height: e.target.value})}
                placeholder="175"
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl py-4 px-6 text-white text-3xl font-bold text-center placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-medium">cm</span>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.3)]">
              <Activity size={32} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Select gender</h2>
              <p className="text-slate-400 text-sm">For accurate heart rate zone calculations</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setProfile({...profile, gender: 'male'})}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  profile.gender === 'male' 
                    ? 'border-cyan-500 bg-cyan-500/20 text-white' 
                    : 'border-slate-700 bg-slate-900/30 text-slate-400 hover:border-slate-500'
                }`}
              >
                <span className="text-3xl mb-2 block">♂</span>
                <span className="font-semibold">Male</span>
              </button>
              <button
                onClick={() => setProfile({...profile, gender: 'female'})}
                className={`p-6 rounded-2xl border-2 transition-all ${
                  profile.gender === 'female' 
                    ? 'border-pink-500 bg-pink-500/20 text-white' 
                    : 'border-slate-700 bg-slate-900/30 text-slate-400 hover:border-slate-500'
                }`}
              >
                <span className="text-3xl mb-2 block">♀</span>
                <span className="font-semibold">Female</span>
              </button>
            </div>
          </div>
        );
    }
  };

  const canProceed = () => {
    switch(step) {
      case 1: return profile.name.length > 0;
      case 2: return profile.weight.length > 0;
      case 3: return profile.height.length > 0;
      case 4: return true;
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0B0C15] flex items-center justify-center relative overflow-hidden py-6">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0B0C15] to-slate-900"></div>
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full filter blur-[120px] animate-float"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-600/15 rounded-full filter blur-[100px] animate-float" style={{animationDelay: '2s'}}></div>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
        <div 
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-600 transition-all duration-500"
          style={{width: `${(step / 4) * 100}%`}}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight mb-2">
            K/\Nz:RUN
          </h1>
          <p className="text-slate-400 text-xs uppercase tracking-wider">
            Profile Setup {step}/4
          </p>
        </div>

        {/* Card */}
        <div className="glass-card rounded-3xl p-8 border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.3)] mb-6">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => step > 1 ? setStep(step - 1) : navigate('/')}
            className="text-slate-400 hover:text-white px-4 py-2 rounded-lg transition-colors text-sm"
          >
            {step === 1 ? 'Back to Login' : 'Previous'}
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed() || isLoading}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] transition-all disabled:opacity-50 disabled:shadow-none"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                {step === 4 ? 'Complete' : 'Next'}
                {step === 4 ? <Check size={18} /> : <ChevronRight size={18} />}
              </>
            )}
          </button>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === step ? 'bg-cyan-400 w-6' : i < step ? 'bg-cyan-400' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};