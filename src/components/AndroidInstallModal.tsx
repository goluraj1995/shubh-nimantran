import React, { useState, useEffect } from 'react';
import { Smartphone, Download, CheckCircle2, Globe, ExternalLink, X, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface AndroidInstallModalProps {
  onClose: () => void;
}

export const AndroidInstallModal: React.FC<AndroidInstallModalProps> = ({ onClose }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handler);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      alert('कृपया अपने फ़ोन के Chrome/Edge ब्राउज़र के "3 डॉट मेनू" (⋮) पर जाएँ और "होम स्क्रीन में जोड़ें" (Add to Home Screen / Install App) पर टैप करें।');
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  const sharedUrl = window.location.origin;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#fffdf9] border-2 border-[#d4af37] rounded-3xl w-full max-w-xl shadow-2xl flex flex-col overflow-hidden my-auto text-left font-devanagari-serif text-xs">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-[#3a0208] text-[#ffd700] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#87091f] text-[#ffd700] rounded-xl shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-devanagari-royal font-bold text-base sm:text-lg text-[#ffd700] leading-tight">
                एंड्रॉइड ऐप इंस्टॉल व APK गाइड (Android App & APK)
              </h3>
              <p className="text-[11px] text-amber-200/90">
                बिना प्लेस्टोर बिना किसी शुल्क के अपने एंड्रॉइड फ़ोन में ऐप चलाएँ व APK बनाएँ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-black/30 text-stone-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Method 1: Instant PWA Install (Recommended) */}
          <div className="p-4 bg-[#fdf6e7] border-2 border-[#d4af37] rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#87091f] text-sm flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#d4af37]" />
                तरीका १: डायरेक्ट होम स्क्रीन ऐप इंस्टॉल (PWA - अनुशंसित)
              </span>
              <span className="px-2 py-0.5 bg-[#87091f] text-[#ffd700] text-[10px] font-bold rounded-full">
                100% मुफ़्त व तेज़
              </span>
            </div>

            <p className="text-stone-700 text-xs leading-relaxed">
              यह ऐप मॉडर्न <b>Progressive Web App (PWA)</b> मानकों के अनुसार बना है। आप इसे बिना किसी स्टोरेज खर्च या डाउनलोड की आवश्यकता के सीधे अपने एंड्रॉइड फ़ोन पर एक असली ऐप की तरह इंस्टॉल कर सकते हैं!
            </p>

            <ul className="text-[11px] text-stone-600 space-y-1 list-disc list-inside">
              <li>होम स्क्रीन पर अलग ऐप आइकन व स्प्लैश स्क्रीन</li>
              <li>बिना किसी एड, बिना बैकएंड व ऑफ़लाइन काम करता है</li>
              <li>सभी फ़ोटो, संगीत व सहेजे गए कार्ड आपके फ़ोन में सुरक्षित रहेंगे</li>
            </ul>

            <div className="pt-2">
              {isInstalled ? (
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl font-bold text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>यह ऐप आपके फ़ोन पर पहले से इंस्टॉल है!</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleInstallPWA}
                  className="w-full py-2.5 px-4 bg-[#87091f] text-[#ffd700] hover:bg-[#630514] font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>📲 एंड्रॉइड फ़ोन में इंस्टॉल करें (Install App)</span>
                </button>
              )}
            </div>
          </div>

          {/* Method 2: Standalone APK Generator */}
          <div className="p-4 bg-white border border-stone-300 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                तरीका २: स्टैंडअलोन `.apk` फ़ाइल डाउनलोड गाइड
              </span>
            </div>

            <p className="text-stone-600 text-[11px] leading-relaxed">
              यदि आप अपने दोस्तों को शेयर करने के लिए एक अलग `.apk` फ़ाइल चाहते हैं:
            </p>

            <ol className="text-[11px] text-stone-700 space-y-2 list-decimal list-inside bg-stone-50 p-3 rounded-xl border border-stone-200">
              <li>
                <b>PWABuilder (निःशुल्क माइक्रोसॉफ्ट टूल) खोलें:</b>{' '}
                <a
                  href="https://www.pwabuilder.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 underline font-bold inline-flex items-center gap-0.5"
                >
                  PWABuilder.com <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <b>होस्टेड ऐप URL डालें:</b>{' '}
                <code className="bg-stone-200 px-1 py-0.5 rounded text-[10px] break-all select-all font-mono">
                  {sharedUrl}
                </code>
              </li>
              <li>
                <b>"Package for Android" पर क्लिक करें:</b> आपको 1 क्लिक में आपके इस ऐप की रेडी-टू-इंस्टॉल <b>Sign APK / AAB</b> फ़ाइल मिल जाएगी!
              </li>
            </ol>
          </div>

          {/* Environmental note */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-[10px] text-amber-900 leading-normal">
            <b>* वातावरण जानकारी:</b> वर्तमान क्लाउड एग्जीक्यूशन एनवायरनमेंट में Android Java SDK व Gradle टूलकिट स्थापित नहीं हैं। इसीलिए PWA इंस्टॉलेशन व PWABuilder सबसे सुरक्षित, 100% मुफ़्त और आधिकारिक तरीका है।
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-stone-100 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 text-white rounded-xl font-bold text-xs hover:bg-stone-900"
          >
            बंद करें (Close)
          </button>
        </div>
      </div>
    </div>
  );
};
