import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import {
  X,
  Copy,
  Check,
  Share2,
  ExternalLink,
  ShieldCheck,
  Download,
  Printer,
  Smartphone,
  Sparkles,
  Loader2,
  AlertCircle,
  Settings,
  User,
  RotateCcw,
  RefreshCw
} from 'lucide-react';
import { AnyInvitationData } from '../types/invitation';
import {
  syncCardWithServer,
  getWhatsAppShareMessage,
  exportCardAsPdf,
  exportCardAsImage,
  checkIsPublicGuest,
  prepareCardForPublicShare
} from '../utils/shareInvitation';
import {
  generateGuestInvitationUrl,
  generateGuestInvitationUrlSync,
  shortenUrlWithConfig,
  DEFAULT_WORKER_SHORTENER_API
} from '../utils/guestLink';

interface ShareInvitationModalProps {
  card: AnyInvitationData;
  onClose: () => void;
  onCardUpdated?: (card: AnyInvitationData) => void;
}

export const ShareInvitationModal: React.FC<ShareInvitationModalProps> = ({
  card,
  onClose,
  onCardUpdated
}) => {
  if (checkIsPublicGuest(false, card)) {
    return null;
  }

  const [guestNameInput, setGuestNameInput] = useState<string>(card?.personalGuestName || '');
  const [shortenerApiEndpoint, setShortenerApiEndpoint] = useState<string>(() => {
    return localStorage.getItem('shubh_shortener_api') || DEFAULT_WORKER_SHORTENER_API;
  });
  const [showSettings, setShowSettings] = useState<boolean>(false);

  // Async preparation state for Base64 images to keep URLs small for TinyURL
  const [isPreparingShare, setIsPreparingShare] = useState<boolean>(false);
  const [shareReadyCard, setShareReadyCard] = useState<AnyInvitationData | null>(null);
  const [prepareError, setPrepareError] = useState<string>('');

  // Effective card: prepared card with Supabase Storage URLs (or fallback to original card)
  const effectiveCard = shareReadyCard || card;

  // Synchronous real-time full URL (0ms delay, 100% strictly bound to current guestNameInput & effectiveCard)
  const currentFullUrl = useMemo(() => {
    return effectiveCard ? generateGuestInvitationUrlSync(effectiveCard, guestNameInput) : '';
  }, [effectiveCard, guestNameInput]);

  // Short URL state strictly associated with the target guest name it was requested for
  const [shortUrlInfo, setShortUrlInfo] = useState<{ forGuestName: string; shortUrl: string } | null>(null);
  const [isShortening, setIsShortening] = useState<boolean>(false);
  const [shortenerError, setShortenerError] = useState<string>('');
  const [editUrl, setEditUrl] = useState<string>('');
  const [, setIsSyncing] = useState<boolean>(true);

  const [copiedShort, setCopiedShort] = useState<boolean>(false);
  const [copiedFull, setCopiedFull] = useState<boolean>(false);
  const [copiedMessage, setCopiedMessage] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const activeRequestIdRef = useRef<number>(0);

  // Directly perform POST /shorten request to Cloudflare Worker
  const triggerShortenRequest = useCallback(async (targetLongUrl: string, targetGuestName: string, apiEndpoint: string) => {
    if (!targetLongUrl) return;

    const currentReqId = ++activeRequestIdRef.current;
    setIsShortening(true);
    setShortenerError('');

    try {
      const res = await shortenUrlWithConfig(targetLongUrl, apiEndpoint);
      if (currentReqId !== activeRequestIdRef.current) return;

      if (res.success && res.shortUrl) {
        setShortUrlInfo({ forGuestName: targetGuestName.trim(), shortUrl: res.shortUrl });
        setShortenerError('');
      } else {
        setShortUrlInfo(null);
        setShortenerError(res.error || 'शॉर्ट लिंक नहीं बन सका');
      }
    } catch (err: any) {
      if (currentReqId !== activeRequestIdRef.current) return;
      setShortUrlInfo(null);
      setShortenerError(err?.message || 'शॉर्टनर नेटवर्क त्रुटि');
    } finally {
      if (currentReqId === activeRequestIdRef.current) {
        setIsShortening(false);
      }
    }
  }, []);

  // Check and upload Base64 images to Supabase Storage ('invitation-images' bucket)
  // to shrink the invitation URL from ~183KB down to ~4KB, avoiding TinyURL HTTP 431 errors.
  useEffect(() => {
    if (!card) {
      setShareReadyCard(null);
      setIsPreparingShare(false);
      setPrepareError('');
      return;
    }

    const hasBase64Images = Boolean(
      (typeof card.heroImageUrl === 'string' && card.heroImageUrl.startsWith('data:image/')) ||
      (Array.isArray(card.photos) && card.photos.some((p) => p && typeof p.url === 'string' && p.url.startsWith('data:image/'))) ||
      ((card as any)?.backgroundSettings?.customBgUrl?.startsWith('data:image/')) ||
      ((card as any)?.design?.background?.customBgUrl?.startsWith('data:image/'))
    );

    if (!hasBase64Images) {
      setShareReadyCard(card);
      setIsPreparingShare(false);
      setPrepareError('');
      return;
    }

    let isMounted = true;
    setIsPreparingShare(true);
    setPrepareError('');

    prepareCardForPublicShare(card)
      .then((prepared) => {
        if (!isMounted) return;
        setShareReadyCard(prepared);
        setIsPreparingShare(false);
      })
      .catch((err: any) => {
        if (!isMounted) return;
        console.error('prepareCardForPublicShare failed:', err);
        setPrepareError(err?.message || 'फ़ोटो सुरक्षित करने में विफल');
        setIsPreparingShare(false);
      });

    return () => {
      isMounted = false;
    };
  }, [card]);

  const handleRetryPrepare = () => {
    if (!card) return;
    setIsPreparingShare(true);
    setPrepareError('');
    prepareCardForPublicShare(card)
      .then((prepared) => {
        setShareReadyCard(prepared);
        setIsPreparingShare(false);
      })
      .catch((err: any) => {
        console.error('Retry prepareCardForPublicShare failed:', err);
        setPrepareError(err?.message || 'फ़ोटो सुरक्षित करने में विफल');
        setIsPreparingShare(false);
      });
  };

  // Debounced short link generation whenever guestNameInput or effectiveCard changes
  useEffect(() => {
    if (isPreparingShare || !effectiveCard) {
      setIsSyncing(false);
      return;
    }

    let isMounted = true;
    const trimmedGuestName = guestNameInput.trim();

    // Immediately clear shortUrlInfo if it belongs to a different guest name
    setShortUrlInfo((prev) => (prev && prev.forGuestName === trimmedGuestName ? prev : null));

    // Sync with parent state
    if (onCardUpdated && card && card.personalGuestName !== (trimmedGuestName || undefined)) {
      onCardUpdated({
        ...card,
        personalGuestName: trimmedGuestName || undefined
      });
    }

    const timer = setTimeout(() => {
      const targetLongUrl = generateGuestInvitationUrlSync(effectiveCard, trimmedGuestName);
      triggerShortenRequest(targetLongUrl, trimmedGuestName, shortenerApiEndpoint);
    }, 450);

    // Sync with backend server if available
    syncCardWithServer(effectiveCard)
      .then((res) => {
        if (!isMounted) return;
        if (res.editUrl) setEditUrl(res.editUrl);
        if (card.id !== res.id && onCardUpdated) {
          onCardUpdated({ ...card, id: res.id });
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.log('Static hosting active:', err.message);
      })
      .finally(() => {
        if (isMounted) setIsSyncing(false);
      });

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [effectiveCard, isPreparingShare, guestNameInput, shortenerApiEndpoint, triggerShortenRequest, onCardUpdated, card]);

  // Valid short URL only if it matches current guestNameInput
  const validShortUrl = (shortUrlInfo && shortUrlInfo.forGuestName === guestNameInput.trim()) ? shortUrlInfo.shortUrl : '';

  // Active URL to share: Use valid short URL if ready and matching, otherwise use current live full URL
  const activeShareUrl = validShortUrl || currentFullUrl;

  // WhatsApp message constructed with exact live activeShareUrl and current guestNameInput
  const whatsAppMessage = effectiveCard ? getWhatsAppShareMessage(effectiveCard, activeShareUrl, guestNameInput) : '';

  const handleSaveApiEndpoint = (val: string) => {
    setShortenerApiEndpoint(val);
    localStorage.setItem('shubh_shortener_api', val.trim());
  };

  const handleResetApiEndpoint = () => {
    setShortenerApiEndpoint(DEFAULT_WORKER_SHORTENER_API);
    localStorage.removeItem('shubh_shortener_api');
  };

  const handleCopy = (text: string, type: 'short' | 'full' | 'edit' | 'message') => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'short') {
        setCopiedShort(true);
        setTimeout(() => setCopiedShort(false), 2500);
      } else if (type === 'full') {
        setCopiedFull(true);
        setTimeout(() => setCopiedFull(false), 2500);
      } else if (type === 'message') {
        setCopiedMessage(true);
        setTimeout(() => setCopiedMessage(false), 2500);
      }
    });
  };

  const handleSystemShare = async () => {
    if (navigator.share && activeShareUrl) {
      try {
        await navigator.share({
          title: card.title || 'शुभ निमंत्रण',
          text: whatsAppMessage,
          url: activeShareUrl
        });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      handleCopy(whatsAppMessage, 'message');
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const targetId = document.getElementById('invitation-card-preview') ? 'invitation-card-preview' : 'card-render-container';
      await exportCardAsImage(targetId, `shubh-nimantran-${card.id || 'card'}.png`);
    } catch (err) {
      console.error('Export error:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#fffdfa] rounded-3xl shadow-2xl border border-[#d4af37]/40 overflow-hidden font-devanagari-serif flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#87091f] via-[#a3122c] to-[#7a0c1e] p-4 text-white flex items-center justify-between border-b border-[#ffd700]/30 shrink-0">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#ffd700]" />
            <h3 className="text-base font-bold font-devanagari-royal text-[#ffd700]">
              आमंत्रण पत्र शेयर करें (Share Invitation)
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-all text-white/80 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 overflow-y-auto">
          {/* PHOTO PREPARATION STATUS BANNER */}
          {isPreparingShare && (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-300/80 text-xs text-amber-900 flex items-center gap-2.5 shadow-xs animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin text-[#87091f] shrink-0" />
              <div className="space-y-0.5">
                <p className="font-bold text-[#87091f] font-devanagari-royal">
                  फ़ोटो सुरक्षित की जा रही हैं... कृपया प्रतीक्षा करें
                </p>
                <p className="text-[11px] text-amber-800 leading-tight">
                  लिंक का आकार छोटा करने और शॉर्ट लिंक बनाने के लिए फ़ोटो क्लाउड पर अपलोड हो रही हैं।
                </p>
              </div>
            </div>
          )}

          {/* PREPARATION ERROR BANNER */}
          {prepareError && (
            <div className="p-3 bg-red-50 rounded-2xl border border-red-300 text-xs text-red-900 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-1.5 font-bold text-red-950 font-devanagari-royal">
                  <AlertCircle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <span>फ़ोटो सुरक्षित करने में विफल (Photo Upload Error)</span>
                </div>
                <button
                  onClick={handleRetryPrepare}
                  className="px-2.5 py-1 bg-white hover:bg-red-100 text-red-900 rounded-lg border border-red-400 font-bold text-[11px] flex items-center gap-1 shrink-0 shadow-xs"
                  title="पुनः प्रयास करें"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>पुनः प्रयास</span>
                </button>
              </div>
              <div className="bg-white/80 p-2 rounded-lg border border-red-200 font-mono text-[11px] text-red-900 break-words">
                {prepareError}
              </div>
              <p className="text-[11px] text-red-800 leading-tight">
                चिंता न करें, आपका निमंत्रण सुरक्षित है। आप नीचे दिए गए मूल आमंत्रण लिंक (100% स्टैंडअलोन) का सीधे उपयोग कर सकते हैं।
              </p>
            </div>
          )}

          {/* GUEST PERSONALIZATION INPUT */}
          <div className="space-y-1.5 bg-[#fef9f0] p-3.5 rounded-2xl border border-[#d4af37]/40 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#87091f] flex items-center gap-1.5 font-devanagari-royal">
                <User className="w-4 h-4 text-[#87091f]" />
                मेहमान का नाम (Guest Personalization)
              </label>
              {guestNameInput && (
                <span className="text-[10px] text-amber-900 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                  वैयक्तिकृत लिंक
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={guestNameInput}
                onChange={(e) => setGuestNameInput(e.target.value)}
                placeholder="उदा. श्री राजेश शर्मा जी सपरिवार"
                className="flex-1 bg-white px-3 py-2 text-xs rounded-xl border border-amber-300/80 outline-none focus:ring-2 focus:ring-[#87091f]/20 text-stone-800"
              />
              {guestNameInput && (
                <button
                  onClick={() => setGuestNameInput('')}
                  className="px-2 py-1.5 text-xs text-stone-500 hover:text-stone-800 font-bold"
                  title="नाम साफ़ करें"
                >
                  हटाएं
                </button>
              )}
            </div>
            <p className="text-[11px] text-stone-600 leading-tight">
              मेहमान का नाम डालने पर उनके लिए एक खास आमंत्रण तैयार होता है, जिस पर उनका नाम चमकता है।
            </p>
          </div>

          {/* 1. SHORT INVITATION LINK */}
          <div className="space-y-2 bg-[#f4fbf7] p-3.5 rounded-2xl border border-emerald-300/80 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 font-devanagari-royal">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                १. छोटा आमंत्रण लिंक (Short Link)
                {isPreparingShare ? (
                  <span className="text-[10px] text-amber-700 flex items-center gap-1 font-normal animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" /> फ़ोटो सुरक्षित हो रही हैं...
                  </span>
                ) : isShortening ? (
                  <span className="text-[10px] text-emerald-700 flex items-center gap-1 font-normal animate-pulse">
                    <Loader2 className="w-3 h-3 animate-spin" /> वर्कर से लिंक बन रहा है...
                  </span>
                ) : null}
              </label>

              {validShortUrl ? (
                <span className="text-[10px] px-2.5 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                  ✓ छोटा लिंक तैयार
                </span>
              ) : isPreparingShare ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                  फ़ोटो अपलोड...
                </span>
              ) : isShortening ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse">
                  प्रगति पर...
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-stone-100 text-stone-600">
                  मूल लिंक सक्रिय
                </span>
              )}
            </div>

            {validShortUrl ? (
              <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-emerald-300 shadow-inner">
                <input
                  type="text"
                  readOnly
                  value={validShortUrl}
                  className="flex-1 bg-transparent px-3 py-1.5 text-xs font-mono font-bold text-emerald-900 outline-none select-all"
                />
                <button
                  onClick={() => handleCopy(validShortUrl, 'short')}
                  disabled={isPreparingShare}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                    isPreparingShare
                      ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                      : copiedShort
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  }`}
                >
                  {copiedShort ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedShort ? 'कॉपी हुआ' : 'शॉर्ट लिंक कॉपी'}</span>
                </button>
                <a
                  href={validShortUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-emerald-700 shrink-0"
                  title="शॉर्ट लिंक खोलें"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : isPreparingShare ? (
              <div className="p-3 bg-white/80 rounded-xl border border-dashed border-amber-300 text-xs text-amber-800 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-600 shrink-0" />
                <span>फ़ोटो सुरक्षित की जा रही हैं... इसके तुरंत बाद छोटा लिंक बनेगा।</span>
              </div>
            ) : isShortening ? (
              <div className="p-3 bg-white/80 rounded-xl border border-dashed border-emerald-300 text-xs text-emerald-800 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600 shrink-0" />
                <span>Cloudflare Worker द्वारा TinyURL जनरेट किया जा रहा है...</span>
              </div>
            ) : shortenerError ? (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-300 text-xs text-amber-900 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-1.5 font-bold text-amber-950">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <span>छोटा लिंक उपलब्ध नहीं (मूल लिंक सक्रिय)</span>
                  </div>
                  <button
                    onClick={() => triggerShortenRequest(currentFullUrl, guestNameInput, shortenerApiEndpoint)}
                    className="px-2.5 py-1 bg-white hover:bg-amber-100 text-amber-900 rounded-lg border border-amber-400 font-bold text-[11px] flex items-center gap-1 shrink-0 shadow-xs"
                    title="दोबारा शॉर्ट लिंक का प्रयास करें"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>पुनः प्रयास करें</span>
                  </button>
                </div>
                <div className="bg-white/80 p-2 rounded-lg border border-amber-200 font-mono text-[11px] text-amber-900 break-words">
                  {shortenerError}
                </div>
                <p className="text-[11px] text-amber-800 leading-tight">
                  चिंता न करें, आपका निमंत्रण सुरक्षित है। आप नीचे दिए गए मूल आमंत्रण लिंक (100% स्टैंडअलोन) को सीधे WhatsApp पर भेज या कॉपी कर सकते हैं।
                </p>
              </div>
            ) : null}
          </div>

          {/* 2. FULL INVITATION LINK (FALLBACK) */}
          <div className="space-y-1.5 bg-[#fbf8f2] p-3.5 rounded-2xl border border-[#d4af37]/30">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#87091f] flex items-center gap-1.5 font-devanagari-royal">
                <ShieldCheck className="w-4 h-4 text-[#87091f]" />
                २. मूल आमंत्रण लिंक (Full Fallback Link)
              </label>
              <span className="text-[10px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full font-bold">
                100% स्टैंडअलोन
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-stone-300 shadow-inner">
              <input
                type="text"
                readOnly
                value={currentFullUrl}
                className="flex-1 bg-transparent px-3 py-1.5 text-xs font-mono text-stone-700 outline-none truncate select-all"
              />
              <button
                onClick={() => handleCopy(currentFullUrl, 'full')}
                disabled={isPreparingShare || !currentFullUrl}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 ${
                  isPreparingShare || !currentFullUrl
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : copiedFull
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-800 hover:bg-black text-[#ffd700]'
                }`}
              >
                {copiedFull ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedFull ? 'कॉपी हुआ' : 'मूल लिंक कॉपी'}</span>
              </button>
              <a
                href={currentFullUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-1.5 rounded-lg text-stone-700 shrink-0 ${
                  isPreparingShare ? 'pointer-events-none opacity-40 bg-stone-50' : 'bg-stone-100 hover:bg-stone-200'
                }`}
                title="नए टैब में खोलें"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* CREATOR SHARE DIAGNOSTIC PANEL */}
          <div className="bg-[#f0fdf4] border border-emerald-300/80 p-3 rounded-2xl space-y-1 text-xs text-emerald-950 font-mono shadow-xs">
            <div className="font-bold flex items-center justify-between text-emerald-900 border-b border-emerald-200/80 pb-1">
              <span className="flex items-center gap-1 font-devanagari-royal">
                🔍 शेयर लिंक जाँच (Share Link Diagnostics)
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                लाइव सत्यापन
              </span>
            </div>
            <div className="grid grid-cols-1 gap-1 text-[11px] pt-1">
              <div><strong>इनपुट मेहमान:</strong> {guestNameInput.trim() || '(सामान्य निमंत्रण)'}</div>
              <div>
                <strong>क्लाउड इमेज स्थिति:</strong>{' '}
                {isPreparingShare ? (
                  <span className="text-amber-700 font-bold">अपलोड हो रही हैं...</span>
                ) : shareReadyCard ? (
                  <span className="text-emerald-700 font-bold">सुरक्षित (URLs सक्रिय) ✓</span>
                ) : (
                  <span>सामान्य</span>
                )}
              </div>
              <div className="truncate">
                <strong>सक्रिय शेयर URL:</strong> <span className="text-emerald-800 font-bold">{activeShareUrl}</span>
              </div>
            </div>
          </div>

          {/* 3. WHATSAPP MESSAGE */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 font-devanagari-royal">
                ३. WhatsApp आमंत्रण संदेश
              </label>
              <button
                onClick={() => handleCopy(whatsAppMessage, 'message')}
                disabled={isPreparingShare}
                className={`text-[11px] font-bold hover:underline flex items-center gap-1 ${
                  isPreparingShare ? 'text-stone-400 cursor-not-allowed' : 'text-[#87091f]'
                }`}
              >
                {copiedMessage ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedMessage ? 'संदेश कॉपी हुआ' : 'मैसेज कॉपी करें'}</span>
              </button>
            </div>
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3 max-h-28 overflow-y-auto text-xs text-stone-700 whitespace-pre-wrap leading-relaxed font-devanagari-serif">
              {whatsAppMessage || 'संदेश तैयार हो रहा है...'}
            </div>
            <button
              onClick={() => {
                if (activeShareUrl && !isShortening && !isPreparingShare) {
                  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsAppMessage)}`, '_blank');
                }
              }}
              disabled={!activeShareUrl || isShortening || isPreparingShare}
              className={`w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all text-xs font-devanagari-royal ${
                isPreparingShare
                  ? 'bg-amber-600/90 text-white cursor-wait opacity-90'
                  : isShortening
                  ? 'bg-emerald-700/60 text-white cursor-wait opacity-80'
                  : 'bg-[#25d366] hover:bg-[#1faa53] text-white disabled:opacity-50'
              }`}
            >
              {isPreparingShare ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>फ़ोटो सुरक्षित की जा रही हैं...</span>
                </>
              ) : isShortening ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>वर्कर से छोटा लिंक बन रहा है...</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>{validShortUrl ? '✓ शॉर्ट लिंक के साथ WhatsApp पर भेजें' : 'WhatsApp पर भेजें (मूल लिंक)'}</span>
                </>
              )}
            </button>
          </div>

          {/* 4. SETTINGS TOGGLE (SHORTENER API) */}
          <div className="pt-1">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-xs text-[#87091f] font-bold flex items-center gap-1 hover:underline font-devanagari-royal"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{showSettings ? 'शॉर्टनर API सेटिंग्स छुपाएं' : 'शॉर्टनर API सेटिंग्स (वैकल्पिक)'}</span>
            </button>

            {showSettings && (
              <div className="mt-2 space-y-2 bg-stone-100 p-3 rounded-2xl border border-stone-300">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-800">
                    Cloudflare Worker Shortener Endpoint (POST)
                  </label>
                  <button
                    onClick={handleResetApiEndpoint}
                    className="text-[11px] text-stone-600 hover:text-black flex items-center gap-0.5"
                    title="डिफ़ॉल्ट रीसेट करें"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>डिफ़ॉल्ट</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={shortenerApiEndpoint}
                  onChange={(e) => handleSaveApiEndpoint(e.target.value)}
                  placeholder="https://shubh-nimantran-shortener.goluraj1995.workers.dev/shorten"
                  className="w-full bg-white px-3 py-1.5 text-xs font-mono rounded-lg border border-stone-300 outline-none text-stone-800"
                />
                <p className="text-[10px] text-stone-500">
                  यह ऐप 100% मुफ़्त और विज्ञापन-मुक्त है। डिफ़ॉल्ट रूप से आपके Cloudflare Worker शॉर्टनर एंडपॉइंट (POST /shorten) का उपयोग होता है।
                </p>
              </div>
            )}
          </div>

          {/* 5. EXPORT & SYSTEM SHARE */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            <button
              onClick={handleSystemShare}
              className="p-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 text-stone-700 transition-all"
            >
              <Smartphone className="w-4 h-4 text-stone-600" />
              <span>सिस्टम शेयर</span>
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="p-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 text-stone-700 transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4 text-stone-600" />
              <span>{isExporting ? 'डाउनलोड...' : 'फोटो PNG'}</span>
            </button>
            <button
              onClick={() => exportCardAsPdf()}
              className="p-2.5 bg-stone-100 hover:bg-stone-200 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 text-stone-700 transition-all"
            >
              <Printer className="w-4 h-4 text-stone-600" />
              <span>प्रिंट / PDF</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#fef9f0] px-4 py-2.5 border-t border-[#d4af37]/30 flex items-center justify-between text-[11px] text-stone-600 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>शुभ निमंत्रण डिजिटल कार्ड</span>
          </div>
          {editUrl && (
            <a
              href={editUrl}
              className="text-[#87091f] hover:underline font-bold text-[10px]"
            >
              एडिट लिंक सहेजा गया
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
