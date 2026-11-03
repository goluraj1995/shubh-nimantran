import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, Sparkles, AlertCircle, KeyRound, Loader2 } from 'lucide-react';
import { verifyMasterPassword } from '../services/authService';

interface EditorAuthModalProps {
  onSuccess: () => void;
}

export const EditorAuthModal: React.FC<EditorAuthModalProps> = ({ onSuccess }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setErrorMessage('कृपया मास्टर पासवर्ड दर्ज करें');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const result = await verifyMasterPassword(password);
    setIsLoading(false);

    if (result.ok) {
      onSuccess();
    } else {
      setErrorMessage(result.error || 'गलत मास्टर पासवर्ड। कृपया पुनः प्रयास करें।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-gradient-to-b from-[#3a0208] via-[#520510] to-[#2a0105] border-2 border-[#ffd700] rounded-3xl shadow-2xl p-6 sm:p-8 text-[#fdf8ef] space-y-6 overflow-hidden">
        
        {/* Top Decorative Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#87091f] border-2 border-[#ffd700] shadow-lg text-[#ffd700] mb-1">
            <Lock className="w-8 h-8" />
          </div>
          
          <div className="flex items-center justify-center gap-1.5 text-xs text-[#ffd700] font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>संपादक सुरक्षा द्वार</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>

          <h2 className="text-2xl font-bold font-serif text-[#ffd700]">
            शुभ निमंत्रण — मास्टर पासवर्ड
          </h2>
          <p className="text-xs text-[#fdf8ef]/80 leading-relaxed max-w-xs mx-auto">
            संपादक डैशबोर्ड खोलने और नए निमंत्रण पत्र बनाने या संपादित करने के लिए मास्टर पासवर्ड दर्ज करें।
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-[#ffd700] flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5" />
              <span>मास्टर पासवर्ड (Master Password)</span>
            </label>
            
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="यहाँ मास्टर पासवर्ड लिखें..."
                disabled={isLoading}
                autoFocus
                className="w-full px-4 py-3 bg-[#1e0104] border-2 border-[#ffd700]/60 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#ffd700] focus:ring-2 focus:ring-[#ffd700]/30 transition-all text-sm pr-12 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ffd700]/70 hover:text-[#ffd700] transition-colors p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-rose-950/80 border border-rose-500/60 rounded-xl text-rose-200 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-6 bg-gradient-to-r from-[#ffd700] via-yellow-400 to-[#d4af37] hover:from-yellow-300 hover:to-yellow-500 text-[#3a0208] font-bold text-sm rounded-xl shadow-lg hover:shadow-yellow-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>सत्यापित किया जा रहा है...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>संपादक डैशबोर्ड खोलें</span>
              </>
            )}
          </button>
        </form>

        {/* Guest Note */}
        <div className="pt-2 border-t border-[#ffd700]/20 text-center">
          <p className="text-[11px] text-[#fdf8ef]/70 leading-relaxed">
            💡 <strong className="text-[#ffd700]">नोट:</strong> यदि आप केवल निमंत्रण देखना चाहते हैं (Guest View), तो आपको पासवर्ड की आवश्यकता नहीं है। अपने व्हाट्सएप/शेयर लिंक पर क्लिक करें।
          </p>
        </div>

      </div>
    </div>
  );
};
