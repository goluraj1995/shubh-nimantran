import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { CardCategory, AnyInvitationData, HinduWeddingData, MuslimWeddingData, BirthdayData, GuestBlessingOrWish } from './types/invitation';
import { defaultHinduWeddingData, defaultMuslimWeddingData, defaultBirthdayData } from './data/defaultInvitations';
import { HomeScreen } from './components/HomeScreen';
import { InteractiveEnvelope } from './components/InteractiveEnvelope';
import { EnvelopeGalleryModal } from './components/EnvelopeGalleryModal';
import { HinduCardView } from './components/HinduCardView';
import { MuslimCardView } from './components/MuslimCardView';
import { BirthdayCardView } from './components/BirthdayCardView';
import { SavedDraftsModal } from './components/SavedDraftsModal';
import { EditorAuthModal } from './components/EditorAuthModal';
import { checkSessionToken } from './services/authService';
import { parseInvitationFromUrl, parseInvitationFromUrlSync, checkIsPublicGuest } from './utils/shareInvitation';
import { computeCardTitle } from './utils/normalizeInvitation';
import { Sparkles, ArrowRight, X, AlertTriangle, RefreshCw } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'shubh_nimantran_cards_v3';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Shubh Nimantran Runtime Error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      window.location.hash = '';
      window.location.search = '';
    } catch (e) {
      console.warn('Reset error:', e);
    }
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#3a0208] text-[#ffd700] flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#520510] border-2 border-[#ffd700] rounded-3xl p-6 text-center shadow-2xl space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#87091f] border-2 border-[#ffd700] flex items-center justify-center text-3xl shadow-inner">
              <AlertTriangle className="w-8 h-8 text-[#ffd700]" />
            </div>
            <h1 className="text-xl font-bold font-serif text-white">शुभ निमंत्रण</h1>
            <p className="text-sm text-[#fdf8ef]/90 leading-relaxed">
              निमंत्रण पत्र लोड करने में समस्या आई। कृपया पुनः लोड करें या डिफ़ॉल्ट डेटा रीसेट करें।
            </p>
            {this.state.error && (
              <div className="p-3 bg-black/40 rounded-xl text-left text-xs font-mono text-rose-300 break-words max-h-32 overflow-y-auto">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <div className="flex gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#ffd700] hover:bg-yellow-400 text-[#3a0208] font-bold rounded-xl text-sm transition-all flex items-center gap-1.5"
              >
                <RefreshCw className="w-4 h-4" />
                <span>पुनः लोड करें</span>
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="px-4 py-2 bg-[#87091f] hover:bg-red-900 border border-[#ffd700]/50 text-white font-medium rounded-xl text-sm transition-all"
              >
                डेटा रीसेट करें
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Helper to synchronously check if the current page URL carries a shared invitation payload
const checkHasInviteParam = (): boolean => {
  return checkIsPublicGuest();
};

function MainApp() {
  const initialSharedCard = parseInvitationFromUrlSync();
  const isInitialSharedUrl = Boolean(initialSharedCard || checkHasInviteParam());

  // Load saved cards or initialize defaults for all 3 categories
  const [savedCards, setSavedCards] = useState<AnyInvitationData[]>(() => {
    let localList: AnyInvitationData[] = [];
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          localList = parsed;
        }
      }
    } catch (err) {
      console.warn('Error loading saved cards:', err);
    }
    if (localList.length === 0) {
      localList = [defaultHinduWeddingData, defaultMuslimWeddingData, defaultBirthdayData];
    }

    if (initialSharedCard) {
      const targetId = initialSharedCard.id || `shared-guest-${Date.now()}`;
      const runtimeSharedCard = {
        ...initialSharedCard,
        id: targetId,
        isReadOnly: true,
        isPublicGuest: true,
        isSharedMode: true
      };
      const existingIdx = localList.findIndex((c) => c.id === targetId);
      if (existingIdx >= 0) {
        localList[existingIdx] = runtimeSharedCard;
      } else {
        localList.unshift(runtimeSharedCard);
      }
    }

    return localList;
  });

  const [activeTab, setActiveTab] = useState<CardCategory>(() => {
    return initialSharedCard?.category || 'hindu_wedding';
  });

  const [currentCardId, setCurrentCardId] = useState<string>(() => {
    return initialSharedCard?.id || defaultHinduWeddingData.id;
  });

  const [viewMode, setViewMode] = useState<'home' | 'envelope' | 'card'>(() => {
    return isInitialSharedUrl ? 'envelope' : 'home';
  });
  const [isDraftsModalOpen, setIsDraftsModalOpen] = useState(false);
  const [isEnvelopeGalleryOpen, setIsEnvelopeGalleryOpen] = useState(false);
  const [isSharedFromUrl, setIsSharedFromUrl] = useState<boolean>(() => isInitialSharedUrl);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => isInitialSharedUrl);
  const [toastNotification, setToastNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Validate session on mount when entering Editor Mode
  useEffect(() => {
    if (isInitialSharedUrl) {
      setIsAuthenticated(true);
      return;
    }

    let isMounted = true;
    checkSessionToken()
      .then((res) => {
        if (!isMounted) return;
        if (res.ok && res.valid) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        if (isMounted) setIsAuthenticated(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isInitialSharedUrl]);

  const [pageButterflyEnabled, setPageButterflyEnabled] = useState<boolean>(() => {
    try {
      const val = localStorage.getItem('shubh_nimantran_page_butterfly');
      return val !== null ? JSON.parse(val) : true;
    } catch {
      return true;
    }
  });

  const [cardButterflyEnabled, setCardButterflyEnabled] = useState<boolean>(() => {
    try {
      const val = localStorage.getItem('shubh_nimantran_card_butterfly');
      return val !== null ? JSON.parse(val) : true;
    } catch {
      return true;
    }
  });

  const [butterflyStyle, setButterflyStyle] = useState<any>(() => {
    return localStorage.getItem('shubh_nimantran_butterfly_style') || 'natural_flying';
  });

  const [butterflyCount, setButterflyCount] = useState<any>(() => {
    return localStorage.getItem('shubh_nimantran_butterfly_count') || 'medium';
  });

  const [butterflySize, setButterflySize] = useState<any>(() => {
    return localStorage.getItem('shubh_nimantran_butterfly_size') || 'normal';
  });

  useEffect(() => {
    try {
      localStorage.setItem('shubh_nimantran_page_butterfly', JSON.stringify(pageButterflyEnabled));
    } catch {}
  }, [pageButterflyEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem('shubh_nimantran_card_butterfly', JSON.stringify(cardButterflyEnabled));
    } catch {}
  }, [cardButterflyEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem('shubh_nimantran_butterfly_style', butterflyStyle);
    } catch {}
  }, [butterflyStyle]);

  useEffect(() => {
    try {
      localStorage.setItem('shubh_nimantran_butterfly_count', butterflyCount);
    } catch {}
  }, [butterflyCount]);

  useEffect(() => {
    try {
      localStorage.setItem('shubh_nimantran_butterfly_size', butterflySize);
    } catch {}
  }, [butterflySize]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastNotification({ message, type });
    setTimeout(() => setToastNotification(null), 3500);
  };

  // Check URL hash/query on load or navigation to open shared invitation directly
  useEffect(() => {
    let isMounted = true;

    const handleLoadSharedCard = () => {
      parseInvitationFromUrl()
        .then((sharedCard) => {
          if (!isMounted || !sharedCard) return;
          console.log('[Shubh Nimantran App] Opening shared guest card from URL:', {
            id: sharedCard.id,
            guestName: sharedCard.personalGuestName,
            category: sharedCard.category
          });
          setIsSharedFromUrl(true);
          const targetId = sharedCard.id || `shared-guest-${Date.now()}`;
          const runtimeSharedCard = {
            ...sharedCard,
            id: targetId,
            isReadOnly: true,
            isPublicGuest: true,
            isSharedMode: true
          };

          setSavedCards((prev) => {
            const existingIdx = prev.findIndex((c) => c.id === targetId);
            if (existingIdx >= 0) {
              const next = [...prev];
              next[existingIdx] = runtimeSharedCard;
              return next;
            }
            return [runtimeSharedCard, ...prev];
          });
          setCurrentCardId(targetId);
          setActiveTab(runtimeSharedCard.category);
          setViewMode('envelope'); // Open directly into opening envelope for guest
        })
        .catch((err) => {
          console.warn('Error parsing shared invitation from URL:', err);
        });
    };

    handleLoadSharedCard();

    window.addEventListener('popstate', handleLoadSharedCard);
    window.addEventListener('hashchange', handleLoadSharedCard);

    return () => {
      isMounted = false;
      window.removeEventListener('popstate', handleLoadSharedCard);
      window.removeEventListener('hashchange', handleLoadSharedCard);
    };
  }, []);

  // Current active card
  const currentCard = savedCards.find((c) => c.id === currentCardId) ||
    savedCards.find((c) => c.category === activeTab) ||
    savedCards[0] ||
    defaultHinduWeddingData;

  // Save to localStorage safely with quota protection
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(savedCards));
    } catch (err) {
      console.warn('Storage quota exceeded. Trying to save without large custom audio:', err);
      try {
        const sanitized = savedCards.map((c) => {
          if (c.musicSettings && !c.musicSettings.isStoredPermanently) {
            return {
              ...c,
              musicSettings: {
                ...c.musicSettings,
                audioUrl: undefined
              }
            };
          }
          return c;
        });
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sanitized));
      } catch (innerErr) {
        console.error('Critical storage failure:', innerErr);
      }
    }
  }, [savedCards]);

  // When switching home screen tabs, find or switch to the corresponding card in that category
  const handleTabChange = (newTab: CardCategory) => {
    setActiveTab(newTab);
    const existing = savedCards.find((c) => c.category === newTab);
    if (existing) {
      setCurrentCardId(existing.id);
    } else {
      let newDefault: AnyInvitationData;
      if (newTab === 'muslim_wedding') newDefault = { ...defaultMuslimWeddingData, id: `draft-muslim-${Date.now()}` };
      else if (newTab === 'birthday') newDefault = { ...defaultBirthdayData, id: `draft-birthday-${Date.now()}` };
      else newDefault = { ...defaultHinduWeddingData, id: `draft-hindu-${Date.now()}` };
      setSavedCards((prev) => [...prev, newDefault]);
      setCurrentCardId(newDefault.id);
    }
  };

  // Safe update: guarantees that editing one invitation NEVER overwrites another
  const handleUpdateCurrentCard = (updated: AnyInvitationData) => {
    setSavedCards((prev) =>
      prev.map((c) => (c.id === updated.id ? { ...updated, updatedAt: new Date().toISOString() } : c))
    );
  };

  const handleSelectCard = (id: string) => {
    const card = savedCards.find((c) => c.id === id);
    if (card) {
      setCurrentCardId(card.id);
      setActiveTab(card.category);
      setIsDraftsModalOpen(false);
      setViewMode('home');
    }
  };

  const handlePreviewCard = (id: string) => {
    const card = savedCards.find((c) => c.id === id);
    if (card) {
      setCurrentCardId(card.id);
      setActiveTab(card.category);
      setIsDraftsModalOpen(false);
      setViewMode('envelope');
    }
  };

  const handleNewCard = (category: CardCategory) => {
    let newCard: AnyInvitationData;
    const now = Date.now();
    if (category === 'muslim_wedding') {
      newCard = { ...defaultMuslimWeddingData, id: `draft-muslim-${now}`, title: `मुस्लिम शादी निमंत्रण #${savedCards.length + 1}`, updatedAt: new Date().toISOString() };
    } else if (category === 'birthday') {
      newCard = { ...defaultBirthdayData, id: `draft-birthday-${now}`, title: `जन्मदिन निमंत्रण #${savedCards.length + 1}`, updatedAt: new Date().toISOString() };
    } else {
      newCard = { ...defaultHinduWeddingData, id: `draft-hindu-${now}`, title: `हिंदू शादी निमंत्रण #${savedCards.length + 1}`, updatedAt: new Date().toISOString() };
    }
    setSavedCards((prev) => [newCard, ...prev]);
    setCurrentCardId(newCard.id);
    setActiveTab(category);
    setIsDraftsModalOpen(false);
    setViewMode('home');
  };

  const handleDuplicateCard = (id: string) => {
    const original = savedCards.find((c) => c.id === id);
    if (!original || !original.id) {
      showToast('अवैध निमंत्रण पत्र: प्रतिलिपि नहीं बनाई जा सकी!', 'error');
      return;
    }

    // 1. Generate guaranteed unique ID with collision check
    let uniqueId = `clone_${original.category}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    while (savedCards.some((c) => c.id === uniqueId)) {
      uniqueId = `clone_${original.category}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    }

    // 2. Deep clone original object to decouple all nested arrays (photos, ceremonies, blessings, musicSettings)
    const clonedObj: AnyInvitationData = JSON.parse(JSON.stringify(original));

    // 3. Clear guest/read-only/shared flags for editable local draft ownership
    delete clonedObj.isReadOnly;
    delete clonedObj.isPublicGuest;
    delete clonedObj.isSharedMode;
    delete clonedObj.personalGuestName;

    // 4. Construct complete duplicated card object
    const baseTitle = original.title ? original.title.replace(/\s*\(प्रतिलिपि\)$/, '') : 'निमंत्रण पत्र';
    const duplicated: AnyInvitationData = {
      ...clonedObj,
      id: uniqueId,
      title: `${baseTitle} (प्रतिलिपि)`,
      updatedAt: new Date().toISOString()
    };

    // 5. Test localStorage write before committing state change (Quota Guard)
    const nextSavedCards = [duplicated, ...savedCards];
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextSavedCards));
    } catch (err) {
      console.warn('Storage quota limit during duplication:', err);
      // Try quota fallback without non-stored audio buffers
      try {
        const sanitized = nextSavedCards.map((c) => {
          if (c.musicSettings && !c.musicSettings.isStoredPermanently) {
            return {
              ...c,
              musicSettings: {
                ...c.musicSettings,
                audioUrl: undefined
              }
            };
          }
          return c;
        });
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(sanitized));
      } catch (quotaErr) {
        console.error('Critical storage quota error during card duplication:', quotaErr);
        showToast('ब्राउज़र स्टोरेज सीमा पूर्ण होने के कारण प्रतिलिपि नहीं बनाई जा सकी!', 'error');
        return; // Preserve original and abort
      }
    }

    // 6. Apply state changes & navigate to editor
    setSavedCards(nextSavedCards);
    setCurrentCardId(duplicated.id);
    setActiveTab(duplicated.category);
    setIsDraftsModalOpen(false);
    setViewMode('home');
    showToast('निमंत्रण पत्र की प्रतिलिपि (Clone) सफलतापूर्वक बनाई गई!', 'success');
  };

  const handleRenameCard = (id: string, newTitle: string) => {
    setSavedCards((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle, updatedAt: new Date().toISOString() } : c))
    );
  };

  const handleDeleteCard = (id: string) => {
    const filtered = savedCards.filter((c) => c.id !== id);
    setSavedCards(filtered);
    if (currentCardId === id && filtered.length > 0) {
      setCurrentCardId(filtered[0].id);
      setActiveTab(filtered[0].category);
    }
  };

  const handleAddBlessing = (newBlessing: GuestBlessingOrWish) => {
    if (currentCard.category === 'hindu_wedding') {
      const updated: HinduWeddingData = {
        ...currentCard,
        blessings: [newBlessing, ...currentCard.blessings]
      };
      handleUpdateCurrentCard(updated);
    } else if (currentCard.category === 'muslim_wedding') {
      const updated: MuslimWeddingData = {
        ...currentCard,
        blessings: [newBlessing, ...currentCard.blessings]
      };
      handleUpdateCurrentCard(updated);
    } else {
      const updated: BirthdayData = {
        ...currentCard,
        wishes: [newBlessing, ...currentCard.wishes]
      };
      handleUpdateCurrentCard(updated);
    }
  };

  const handleExportAll = () => {
    const jsonStr = JSON.stringify(savedCards, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = `shubh_nimantran_all_cards_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleImportAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported) && imported.length > 0) {
          setSavedCards(imported);
          setCurrentCardId(imported[0].id);
          setActiveTab(imported[0].category);
          showToast('सभी निमंत्रण पत्र सफलतापूर्वक रीस्टोर किए गए!', 'success');
        }
      } catch (err) {
        showToast('अमान्य JSON फ़ाइल प्रारूप। कृपया सही बैकअप फ़ाइल चुनें।', 'error');
      }
    };
    reader.readAsText(file);
  };

  // Envelope details helper
  const getEnvelopeDetails = () => {
    if (currentCard.category === 'hindu_wedding') {
      return {
        primaryTitle: `${currentCard.groomName} संग ${currentCard.brideName}`,
        dateDisplay: currentCard.weddingDateDisplay,
        subTitle: 'मांगलिक परिणय निमंत्रण'
      };
    } else if (currentCard.category === 'muslim_wedding') {
      return {
        primaryTitle: `${currentCard.groomName} हमराह ${currentCard.brideName}`,
        dateDisplay: currentCard.weddingDateDisplay,
        subTitle: 'दावत-ए-निकाह व वलीमा'
      };
    } else {
      return {
        primaryTitle: `${currentCard.celebrantName} ${currentCard.age ? `(${currentCard.age})` : ''}`,
        dateDisplay: currentCard.partyDateDisplay,
        subTitle: 'Birthday Party Invitation'
      };
    }
  };

  const envelopeDetails = getEnvelopeDetails();

  // Resolved music URL: respects 'none' mode
  const resolvedMusicUrl = currentCard.musicSettings?.mode === 'none'
    ? undefined
    : (currentCard.musicSettings?.audioUrl || currentCard.musicUrl);

  return (
    <div className="min-h-screen">
      {/* Editor Master Password Auth Modal */}
      {!isInitialSharedUrl && !isSharedFromUrl && !checkHasInviteParam() && !isAuthenticated && (
        <EditorAuthModal onSuccess={() => setIsAuthenticated(true)} />
      )}

      {/* Recipient Shared Invitation Top Banner */}
      {(isSharedFromUrl || checkHasInviteParam()) && (
        <div className="sticky top-0 z-50 flex flex-col shadow-md border-b border-[#ffd700]">
          <div className="bg-[#87091f] text-[#ffd700] px-4 py-2 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#ffd700]" />
              <span>आपको भेजा गया डिजिटल निमंत्रण पत्र ({computeCardTitle(currentCard)})</span>
            </div>
            <span className="text-[10px] text-emerald-300 font-bold bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-500/50 shrink-0">
              ✓ Read-Only Guest Mode
            </span>
          </div>
        </div>
      )}

      {/* 1. Home Screen (3 Main Tabs & Maker) */}
      {viewMode === 'home' && !isSharedFromUrl && !checkHasInviteParam() && (
        <HomeScreen
          activeTab={activeTab}
          onTabChange={handleTabChange}
          currentCard={currentCard}
          onCardChange={handleUpdateCurrentCard}
          onViewEnvelope={() => setViewMode('envelope')}
          onViewCardDirect={() => setViewMode('card')}
          onOpenDraftsModal={() => setIsDraftsModalOpen(true)}
          onOpenEnvelopeGallery={() => setIsEnvelopeGalleryOpen(true)}
          savedCardsCount={savedCards.length}
          pageButterflyEnabled={pageButterflyEnabled}
          setPageButterflyEnabled={setPageButterflyEnabled}
          cardButterflyEnabled={cardButterflyEnabled}
          setCardButterflyEnabled={setCardButterflyEnabled}
          butterflyStyle={butterflyStyle}
          setButterflyStyle={setButterflyStyle}
          butterflyCount={butterflyCount}
          setButterflyCount={setButterflyCount}
          butterflySize={butterflySize}
          setButterflySize={setButterflySize}
        />
      )}
      {/* 2. Interactive Opening Envelope */}
      {viewMode === 'envelope' && (
        <InteractiveEnvelope
          category={currentCard.category}
          primaryTitle={envelopeDetails.primaryTitle}
          guestName={currentCard.personalGuestName}
          subTitle={envelopeDetails.subTitle}
          dateDisplay={envelopeDetails.dateDisplay}
          musicUrl={resolvedMusicUrl}
          musicSettings={currentCard.musicSettings}
          envelopeStyle={currentCard.envelopeStyle}
          onOpenEnvelopeGallery={() => setIsEnvelopeGalleryOpen(true)}
          onOpen={() => setViewMode('card')}
        />
      )}

      {/* 3. Final Card Views (Tailored to each category) */}
      {viewMode === 'card' && currentCard.category === 'hindu_wedding' && (
        <HinduCardView
          data={currentCard}
          isReadOnly={isSharedFromUrl || checkHasInviteParam()}
          onOpenEdit={() => {
            if (!isSharedFromUrl && !checkHasInviteParam()) setViewMode('home');
          }}
          onAddBlessing={handleAddBlessing}
          onReopenEnvelope={() => setViewMode('envelope')}
          onBackToHome={() => {
            if (!isSharedFromUrl && !checkHasInviteParam()) setViewMode('home');
          }}
          onCardUpdated={handleUpdateCurrentCard}
          cardButterflyEnabled={cardButterflyEnabled}
          butterflyStyle={butterflyStyle}
          butterflyCount={butterflyCount}
          butterflySize={butterflySize}
        />
      )}

      {viewMode === 'card' && currentCard.category === 'muslim_wedding' && (
        <MuslimCardView
          data={currentCard}
          isReadOnly={isSharedFromUrl || checkHasInviteParam()}
          onOpenEdit={() => {
            if (!isSharedFromUrl && !checkHasInviteParam()) setViewMode('home');
          }}
          onAddBlessing={handleAddBlessing}
          onReopenEnvelope={() => setViewMode('envelope')}
          onBackToHome={() => {
            if (!isSharedFromUrl && !checkHasInviteParam()) setViewMode('home');
          }}
          onCardUpdated={handleUpdateCurrentCard}
          cardButterflyEnabled={cardButterflyEnabled}
          butterflyStyle={butterflyStyle}
          butterflyCount={butterflyCount}
          butterflySize={butterflySize}
        />
      )}

      {viewMode === 'card' && currentCard.category === 'birthday' && (
        <BirthdayCardView
          data={currentCard}
          isReadOnly={isSharedFromUrl || checkHasInviteParam()}
          onOpenEdit={() => {
            if (!isSharedFromUrl && !checkHasInviteParam()) setViewMode('home');
          }}
          onAddWish={handleAddBlessing}
          onReopenEnvelope={() => setViewMode('envelope')}
          onBackToHome={() => {
            if (!isSharedFromUrl && !checkHasInviteParam()) setViewMode('home');
          }}
          onCardUpdated={handleUpdateCurrentCard}
          cardButterflyEnabled={cardButterflyEnabled}
          butterflyStyle={butterflyStyle}
          butterflyCount={butterflyCount}
          butterflySize={butterflySize}
        />
      )}

      {/* Saved Drafts Manager / Dashboard Modal */}
      {isDraftsModalOpen && (
        <SavedDraftsModal
          savedCards={savedCards}
          currentCardId={currentCardId}
          onSelectCard={handleSelectCard}
          onPreviewCard={handlePreviewCard}
          onNewCard={handleNewCard}
          onDuplicateCard={handleDuplicateCard}
          onRenameCard={handleRenameCard}
          onDeleteCard={handleDeleteCard}
          onExportAll={handleExportAll}
          onImportAll={handleImportAll}
          onClose={() => setIsDraftsModalOpen(false)}
        />
      )}

      {/* Envelope Gallery Modal */}
      {isEnvelopeGalleryOpen && (
        <EnvelopeGalleryModal
          currentStyleId={currentCard.envelopeStyle}
          onSelectStyle={(styleId) => {
            const updated = { ...currentCard, envelopeStyle: styleId };
            handleUpdateCurrentCard(updated);
          }}
          onClose={() => setIsEnvelopeGalleryOpen(false)}
        />
      )}

      {/* Toast Notification */}
      {toastNotification && (
        <div className="fixed top-5 inset-x-4 z-50 max-w-md mx-auto pointer-events-none flex justify-center animate-bounce">
          <div
            className={`px-4 py-2.5 rounded-2xl shadow-2xl border-2 text-xs font-bold flex items-center gap-2 pointer-events-auto ${
              toastNotification.type === 'error'
                ? 'bg-rose-900 border-rose-400 text-white'
                : 'bg-[#064e3b] border-[#d4af37] text-[#ffd700]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#ffd700]" />
            <span>{toastNotification.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <MainApp />
    </ErrorBoundary>
  );
}
