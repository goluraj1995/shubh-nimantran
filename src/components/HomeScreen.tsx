import React, { useState } from 'react';
import { CardCategory, AnyInvitationData, HinduWeddingData, MuslimWeddingData, BirthdayData } from '../types/invitation';
import { HinduForm } from './HinduForm';
import { MuslimForm } from './MuslimForm';
import { BirthdayForm } from './BirthdayForm';
import { VisualDesignEditor } from './VisualDesignEditor';
import { HinduCardView } from './HinduCardView';
import { MuslimCardView } from './MuslimCardView';
import { BirthdayCardView } from './BirthdayCardView';
import { GaneshaIcon } from './GaneshaIcon';
import { CrescentStarIcon } from './IslamicMotifs';
import { BirthdayCakeIcon } from './BirthdayMotifs';
import { exportCardAsImage, exportCardAsPdf } from '../utils/exportCard';
import { ShareInvitationModal } from './ShareInvitationModal';
import { AndroidInstallModal } from './AndroidInstallModal';
import { ButterflyAnimation } from './ButterflyAnimation';
import {
  Eye, FolderHeart, Sparkles, Palette, FileText,
  Columns, Smartphone, Download, Save, Check, Share2
} from 'lucide-react';

interface HomeScreenProps {
  activeTab: CardCategory;
  onTabChange: (tab: CardCategory) => void;
  currentCard: AnyInvitationData;
  onCardChange: (updated: AnyInvitationData) => void;
  onViewEnvelope: () => void;
  onViewCardDirect: () => void;
  onOpenDraftsModal: () => void;
  savedCardsCount: number;
  onOpenEnvelopeGallery?: () => void;
  pageButterflyEnabled?: boolean;
  setPageButterflyEnabled?: (val: boolean) => void;
  cardButterflyEnabled?: boolean;
  setCardButterflyEnabled?: (val: boolean) => void;
  butterflyStyle?: any;
  setButterflyStyle?: (val: any) => void;
  butterflyCount?: any;
  setButterflyCount?: (val: any) => void;
  butterflySize?: any;
  setButterflySize?: (val: any) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  activeTab,
  onTabChange,
  currentCard,
  onCardChange,
  onViewEnvelope,
  onViewCardDirect,
  onOpenDraftsModal,
  savedCardsCount,
  onOpenEnvelopeGallery,
  pageButterflyEnabled = true,
  setPageButterflyEnabled,
  cardButterflyEnabled = true,
  setCardButterflyEnabled,
  butterflyStyle = 'natural_flying',
  butterflyCount = 'medium',
  butterflySize = 'normal'
}) => {
  // Mode inside current category: 'form' | 'editor' | 'preview'
  const [contentMode, setContentMode] = useState<'form' | 'editor' | 'preview'>('form');
  const [splitView, setSplitView] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);

  const handleSaveDraft = () => {
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2500);
  };

  const handleExportImage = async () => {
    setIsExporting(true);
    try {
      await exportCardAsImage('card-render-container', `shubh_nimantran_${currentCard.category}_${Date.now()}.png`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-mandap-texture pb-28 text-[#2c1810] font-devanagari-serif relative overflow-hidden">
      <ButterflyAnimation enabled={pageButterflyEnabled} />
      {/* Top Main App Bar */}
      <header className="sticky top-0 z-40 bg-[#3d0208] border-b-2 border-[#d4af37] shadow-xl text-[#fdfbf7]">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#87091f] to-[#ffd700] p-1 shadow-md flex items-center justify-center">
              {activeTab === 'hindu_wedding' ? (
                <GaneshaIcon size={26} />
              ) : activeTab === 'muslim_wedding' ? (
                <CrescentStarIcon size={26} />
              ) : (
                <BirthdayCakeIcon size={26} />
              )}
            </div>
            <div>
              <h1 className="font-devanagari-royal font-bold text-base sm:text-lg text-[#ffd700] leading-tight">
                शुभ निमंत्रण कार्ड मेकर
              </h1>
              <p className="text-[10px] text-amber-200/80">
                डिजिटल इंटरैक्टिव इनविटेशन जनरेटर
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Split View Toggle for Desktop */}
            <button
              onClick={() => setSplitView(!splitView)}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-sm ${
                splitView
                  ? 'bg-[#ffd700] text-[#54030f] border-[#ffd700]'
                  : 'bg-black/40 text-[#ffd700] border-[#d4af37]/70 hover:bg-black/60'
              }`}
              title="स्प्लिट स्क्रीन व्यू (एडिटर व प्रीव्यू साथ-साथ)"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>{splitView ? 'सिंगल व्यू' : 'स्प्लिट व्यू'}</span>
            </button>

            {/* Android App & APK Button */}
            <button
              onClick={() => setIsAndroidModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#d4af37] bg-gradient-to-r from-[#87091f] to-[#064e3b] text-[#ffd700] text-xs font-bold transition-all shadow-sm active:scale-95 animate-pulse"
              title="ऐप इंस्टॉल करें व APK फ़ाइल डाउनलोड करें"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>📲 ऐप / APK</span>
            </button>

            {/* Saved Drafts Button */}
            <button
              onClick={onOpenDraftsModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#d4af37]/70 bg-black/40 hover:bg-black/60 text-[#ffd700] text-xs font-bold transition-all shadow-sm active:scale-95"
              title="सहेजे गए कार्ड देखें"
            >
              <FolderHeart className="w-3.5 h-3.5" />
              <span>ड्राफ्ट्स ({savedCardsCount})</span>
            </button>

            {/* View Envelope Animation */}
            <button
              onClick={onViewEnvelope}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#87091f] hover:bg-[#630514] border border-[#ffd700]/70 text-[#ffd700] text-xs font-bold transition-all shadow-sm active:scale-95"
              title="लिफाफा एनीमेशन देखें"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>लिफाफा</span>
            </button>
          </div>
        </div>

        {/* 3 Main Tabs Header */}
        <div className="max-w-5xl mx-auto px-3 pb-2 pt-1">
          <div className="grid grid-cols-3 gap-1.5 sm:gap-3 bg-black/40 p-1.5 rounded-2xl border border-[#d4af37]/40 shadow-inner">
            {/* Tab 1: हिंदू शादी */}
            <button
              onClick={() => onTabChange('hindu_wedding')}
              className={`py-2.5 px-2 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-center ${
                activeTab === 'hindu_wedding'
                  ? 'bg-gradient-to-r from-[#87091f] to-[#b22222] text-[#ffd700] border-2 border-[#ffd700] shadow-lg font-bold scale-[1.02]'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <GaneshaIcon size={22} />
              <span className="font-devanagari-royal text-xs sm:text-sm font-bold leading-tight">
                १. हिंदू शादी
              </span>
            </button>

            {/* Tab 2: मुस्लिम शादी */}
            <button
              onClick={() => onTabChange('muslim_wedding')}
              className={`py-2.5 px-2 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-center ${
                activeTab === 'muslim_wedding'
                  ? 'bg-gradient-to-r from-[#064e3b] to-[#047857] text-[#ffd700] border-2 border-[#ffd700] shadow-lg font-bold scale-[1.02]'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <CrescentStarIcon size={22} />
              <span className="font-devanagari-royal text-xs sm:text-sm font-bold leading-tight">
                २. मुस्लिम शादी
              </span>
            </button>

            {/* Tab 3: जन्मदिन */}
            <button
              onClick={() => onTabChange('birthday')}
              className={`py-2.5 px-2 rounded-xl transition-all flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2 text-center ${
                activeTab === 'birthday'
                  ? 'bg-gradient-to-r from-[#ec4899] to-[#8b5cf6] text-white border-2 border-yellow-300 shadow-lg font-bold scale-[1.02]'
                  : 'text-stone-300 hover:text-white hover:bg-white/10'
              }`}
            >
              <BirthdayCakeIcon size={22} />
              <span className="font-devanagari-royal text-xs sm:text-sm font-bold leading-tight">
                ३. जन्मदिन
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Tab Content Area */}
      <main className="max-w-5xl mx-auto px-3 sm:px-6 pt-5">
        {/* Category Description Banner */}
        <div className="mb-4 text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold border shadow-sm">
            {activeTab === 'hindu_wedding' ? (
              <span className="bg-[#fdf6e7] text-[#87091f] border-[#d4af37] px-3 py-0.5 rounded-full border">
                🚩 वैदिक हिंदू विवाह संस्कार एवं मांगलिक रस्में
              </span>
            ) : activeTab === 'muslim_wedding' ? (
              <span className="bg-emerald-50 text-[#064e3b] border-emerald-300 px-3 py-0.5 rounded-full border">
                🌙 अक़्द-ए-निकाह व दावत-ए-वलीमा दावतनामा
              </span>
            ) : (
              <span className="bg-pink-50 text-pink-700 border-pink-300 px-3 py-0.5 rounded-full border">
                🎂 बर्थडे पार्टी सेलिब्रेशन इनविटेशन कार्ड
              </span>
            )}
          </div>
        </div>

        {/* Mode Switcher Pills: [ 📝 फॉर्म | 🎨 विजुअल एडिटर | 👁️ लाइव प्रीव्यू ] */}
        <div className="mb-5 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-1 bg-[#2c0408]/90 p-1.5 rounded-2xl border border-[#d4af37]/70 shadow-xl max-w-md w-full">
            <button
              type="button"
              onClick={() => setContentMode('form')}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs font-bold ${
                contentMode === 'form'
                  ? 'bg-gradient-to-r from-[#ffd700] to-[#f59e0b] text-[#3d0208] shadow font-extrabold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>१. फॉर्म</span>
            </button>

            <button
              type="button"
              onClick={() => setContentMode('editor')}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs font-bold ${
                contentMode === 'editor'
                  ? 'bg-gradient-to-r from-[#ffd700] to-[#f59e0b] text-[#3d0208] shadow font-extrabold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Palette className="w-3.5 h-3.5" />
              <span>२. विजुअल एडिटर</span>
            </button>

            <button
              type="button"
              onClick={() => setContentMode('preview')}
              className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs font-bold ${
                contentMode === 'preview'
                  ? 'bg-gradient-to-r from-[#ffd700] to-[#f59e0b] text-[#3d0208] shadow font-extrabold'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>३. लाइव प्रीव्यू</span>
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {saveSuccessToast && (
          <div className="fixed top-20 right-5 z-50 bg-[#064e3b] text-[#ffd700] px-4 py-2.5 rounded-2xl border-2 border-[#d4af37] shadow-2xl flex items-center gap-2 font-bold text-xs animate-bounce">
            <Check className="w-4 h-4 text-[#ffd700]" />
            <span>कार्ड ड्राफ्ट सफलतापूर्वक सुरक्षित कर लिया गया!</span>
          </div>
        )}

        {/* Content Area: Single or Split View */}
        {splitView ? (
          /* Split View Layout (Desktop) */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              {contentMode === 'editor' ? (
                <VisualDesignEditor
                  card={currentCard}
                  onChange={onCardChange}
                  onSaveDraft={handleSaveDraft}
                  onExportImage={handleExportImage}
                />
              ) : (
                <>
                  {activeTab === 'hindu_wedding' && (
                    <HinduForm
                      data={currentCard as HinduWeddingData}
                      onChange={(updated) => onCardChange(updated)}
                      onGenerate={onViewEnvelope}
                      pageButterflyEnabled={pageButterflyEnabled}
                      setPageButterflyEnabled={setPageButterflyEnabled}
                      cardButterflyEnabled={cardButterflyEnabled}
                      setCardButterflyEnabled={setCardButterflyEnabled}
                    />
                  )}
                  {activeTab === 'muslim_wedding' && (
                    <MuslimForm
                      data={currentCard as MuslimWeddingData}
                      onChange={(updated) => onCardChange(updated)}
                      onGenerate={onViewEnvelope}
                      pageButterflyEnabled={pageButterflyEnabled}
                      setPageButterflyEnabled={setPageButterflyEnabled}
                      cardButterflyEnabled={cardButterflyEnabled}
                      setCardButterflyEnabled={setCardButterflyEnabled}
                    />
                  )}
                  {activeTab === 'birthday' && (
                    <BirthdayForm
                      data={currentCard as BirthdayData}
                      onChange={(updated) => onCardChange(updated)}
                      onGenerate={onViewEnvelope}
                      pageButterflyEnabled={pageButterflyEnabled}
                      setPageButterflyEnabled={setPageButterflyEnabled}
                      cardButterflyEnabled={cardButterflyEnabled}
                      setCardButterflyEnabled={setCardButterflyEnabled}
                    />
                  )}
                </>
              )}
            </div>

            {/* Real-Time Live Preview Pane */}
            <div className="sticky top-28 space-y-2">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#87091f]" /> लाइव कार्ड प्रीव्यू (तुरंत अपडेट)
                </span>
                <button
                  type="button"
                  onClick={onViewCardDirect}
                  className="text-xs text-[#87091f] hover:underline font-bold"
                >
                  फुल स्क्रीन में खोलें →
                </button>
              </div>

              <div className="rounded-3xl overflow-y-auto overflow-x-visible border-2 border-[#d4af37] shadow-xl max-h-[80vh]">
                {activeTab === 'hindu_wedding' && (
                  <HinduCardView
                    data={currentCard as HinduWeddingData}
                    onOpenEdit={() => setContentMode('editor')}
                    onAddBlessing={() => {}}
                    onReopenEnvelope={onViewEnvelope}
                    onBackToHome={() => {}}
                    cardButterflyEnabled={cardButterflyEnabled}
                    butterflyStyle={butterflyStyle}
                    butterflyCount={butterflyCount}
                    butterflySize={butterflySize}
                  />
                )}
                {activeTab === 'muslim_wedding' && (
                  <MuslimCardView
                    data={currentCard as MuslimWeddingData}
                    onOpenEdit={() => setContentMode('editor')}
                    onAddBlessing={() => {}}
                    onReopenEnvelope={onViewEnvelope}
                    onBackToHome={() => {}}
                    cardButterflyEnabled={cardButterflyEnabled}
                    butterflyStyle={butterflyStyle}
                    butterflyCount={butterflyCount}
                    butterflySize={butterflySize}
                  />
                )}
                {activeTab === 'birthday' && (
                  <BirthdayCardView
                    data={currentCard as BirthdayData}
                    onOpenEdit={() => setContentMode('editor')}
                    onAddWish={() => {}}
                    onReopenEnvelope={onViewEnvelope}
                    onBackToHome={() => {}}
                    cardButterflyEnabled={cardButterflyEnabled}
                    butterflyStyle={butterflyStyle}
                    butterflyCount={butterflyCount}
                    butterflySize={butterflySize}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Standard Single Tab View */
          <div>
            {/* 1. Details Form */}
            {contentMode === 'form' && (
              <>
                {activeTab === 'hindu_wedding' && (
                  <HinduForm
                    data={currentCard as HinduWeddingData}
                    onChange={(updated) => onCardChange(updated)}
                    onGenerate={onViewEnvelope}
                    pageButterflyEnabled={pageButterflyEnabled}
                    setPageButterflyEnabled={setPageButterflyEnabled}
                    cardButterflyEnabled={cardButterflyEnabled}
                    setCardButterflyEnabled={setCardButterflyEnabled}
                  />
                )}

                {activeTab === 'muslim_wedding' && (
                  <MuslimForm
                    data={currentCard as MuslimWeddingData}
                    onChange={(updated) => onCardChange(updated)}
                    onGenerate={onViewEnvelope}
                    pageButterflyEnabled={pageButterflyEnabled}
                    setPageButterflyEnabled={setPageButterflyEnabled}
                    cardButterflyEnabled={cardButterflyEnabled}
                    setCardButterflyEnabled={setCardButterflyEnabled}
                  />
                )}

                {activeTab === 'birthday' && (
                  <BirthdayForm
                    data={currentCard as BirthdayData}
                    onChange={(updated) => onCardChange(updated)}
                    onGenerate={onViewEnvelope}
                    pageButterflyEnabled={pageButterflyEnabled}
                    setPageButterflyEnabled={setPageButterflyEnabled}
                    cardButterflyEnabled={cardButterflyEnabled}
                    setCardButterflyEnabled={setCardButterflyEnabled}
                  />
                )}
              </>
            )}

            {/* 2. Visual Design Editor (Photo, Background, Fonts) */}
            {contentMode === 'editor' && (
              <div className="space-y-4">
                <VisualDesignEditor
                  card={currentCard}
                  onChange={onCardChange}
                  onSaveDraft={handleSaveDraft}
                  onExportImage={handleExportImage}
                />

                <div className="flex justify-center pt-2">
                  <button
                    type="button"
                    onClick={() => setContentMode('preview')}
                    className="px-6 py-2.5 bg-[#87091f] text-[#ffd700] rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg hover:bg-[#630514] transition-all"
                  >
                    <Eye className="w-4 h-4" />
                    <span>डिज़ाइन का लाइव प्रीव्यू देखें</span>
                  </button>
                </div>
              </div>
            )}

            {/* 3. Live Card Preview (Real-Time interactive preview) */}
            {contentMode === 'preview' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/90 border border-[#d4af37] rounded-2xl shadow-sm">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#ffd700]" />
                    यह आपका लाइव कार्ड प्रीव्यू है। इसमें सभी बदलाव तुरंत दिखते हैं।
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setContentMode('editor')}
                      className="px-3 py-1.5 bg-[#fdf6e7] border border-[#d4af37] rounded-xl text-xs font-bold text-[#87091f] hover:bg-[#f6ebd4]"
                    >
                      डिज़ाइन बदलें
                    </button>
                    <button
                      type="button"
                      onClick={onViewCardDirect}
                      className="px-3 py-1.5 bg-[#87091f] text-[#ffd700] rounded-xl text-xs font-bold hover:bg-[#630514]"
                    >
                      पूर्ण स्क्रीन
                    </button>
                  </div>
                </div>

                <div className="rounded-3xl overflow-visible border-3 border-[#d4af37] shadow-2xl">
                  {activeTab === 'hindu_wedding' && (
                    <HinduCardView
                      data={currentCard as HinduWeddingData}
                      onOpenEdit={() => setContentMode('editor')}
                      onAddBlessing={() => {}}
                      onReopenEnvelope={onViewEnvelope}
                      onBackToHome={() => setContentMode('form')}
                      cardButterflyEnabled={cardButterflyEnabled}
                      butterflyStyle={butterflyStyle}
                      butterflyCount={butterflyCount}
                      butterflySize={butterflySize}
                    />
                  )}
                  {activeTab === 'muslim_wedding' && (
                    <MuslimCardView
                      data={currentCard as MuslimWeddingData}
                      onOpenEdit={() => setContentMode('editor')}
                      onAddBlessing={() => {}}
                      onReopenEnvelope={onViewEnvelope}
                      onBackToHome={() => setContentMode('form')}
                      cardButterflyEnabled={cardButterflyEnabled}
                      butterflyStyle={butterflyStyle}
                      butterflyCount={butterflyCount}
                      butterflySize={butterflySize}
                    />
                  )}
                  {activeTab === 'birthday' && (
                    <BirthdayCardView
                      data={currentCard as BirthdayData}
                      onOpenEdit={() => setContentMode('editor')}
                      onAddWish={() => {}}
                      onReopenEnvelope={onViewEnvelope}
                      onBackToHome={() => setContentMode('form')}
                      cardButterflyEnabled={cardButterflyEnabled}
                      butterflyStyle={butterflyStyle}
                      butterflyCount={butterflyCount}
                      butterflySize={butterflySize}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Bottom Action Bar for Quick Generation and Export */}
      <div className="fixed bottom-3 inset-x-3 z-40 max-w-2xl mx-auto">
        <div className="bg-[#3a0208]/95 border-2 border-[#d4af37] backdrop-blur-md rounded-2xl px-4 py-2.5 shadow-2xl flex items-center justify-between gap-2 text-[#ffd700] font-devanagari-serif">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-black/40 hover:bg-black/60 border border-[#d4af37]/60 text-xs font-bold flex items-center gap-1 active:scale-95"
              title="ड्राफ्ट सुरक्षित करें"
            >
              <Save className="w-3.5 h-3.5 text-[#ffd700]" />
              <span className="hidden sm:inline">ड्राफ्ट सहेजें</span>
            </button>

            <button
              type="button"
              onClick={handleExportImage}
              disabled={isExporting}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#064e3b] hover:bg-[#022c22] border border-[#d4af37]/60 text-xs font-bold flex items-center gap-1 active:scale-95"
              title="कार्ड इमेज डाउनलोड करें"
            >
              <Download className="w-3.5 h-3.5 text-[#ffd700]" />
              <span className="hidden sm:inline">{isExporting ? 'डाउनलोडिंग...' : 'इमेज डाउनलोड'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-[#87091f] hover:bg-[#630514] border border-[#ffd700]/60 text-xs font-bold flex items-center gap-1 active:scale-95"
              title="कार्ड अलग से शेयर करें (WhatsApp, लिंक, इमेज)"
            >
              <Share2 className="w-3.5 h-3.5 text-[#ffd700]" />
              <span className="hidden sm:inline">शेयर</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onOpenEnvelopeGallery && (
              <button
                type="button"
                onClick={onOpenEnvelopeGallery}
                className="px-3 py-1.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 border border-amber-400 text-amber-200 text-xs font-bold flex items-center gap-1 active:scale-95 transition-all"
                title="सुंदर लिफाफा डिज़ाइन चुनें"
              >
                <Palette className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">लिफाफा बदलें</span>
              </button>
            )}
            <button
              type="button"
              onClick={onViewCardDirect}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 text-white text-xs font-bold flex items-center gap-1 active:scale-95"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>सीधा कार्ड देखें</span>
            </button>

            {/* Primary Generate Invitation button */}
            <button
              type="button"
              onClick={onViewEnvelope}
              className="px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-[#ffd700] via-[#f59e0b] to-[#ffd700] text-[#3d0208] text-xs sm:text-sm font-devanagari-royal font-bold uppercase tracking-wider shadow-lg hover:brightness-110 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4 text-[#3d0208]" />
              <span>कार्ड जनरेट करें</span>
            </button>
          </div>
        </div>
      </div>

      {/* Share Invitation Modal for current card */}
      {isShareModalOpen && (
        <ShareInvitationModal
          card={currentCard}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

      {/* Android Install & APK Modal */}
      {isAndroidModalOpen && (
        <AndroidInstallModal
          onClose={() => setIsAndroidModalOpen(false)}
        />
      )}
    </div>
  );
};
