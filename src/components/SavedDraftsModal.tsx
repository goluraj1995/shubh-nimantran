import React, { useState } from 'react';
import { CardCategory, AnyInvitationData } from '../types/invitation';
import {
  X, Plus, Trash2, Calendar, Download, Upload,
  Check, Copy, Edit3, Eye, Share2, FolderHeart, Search, Sparkles
} from 'lucide-react';
import { GaneshaIcon } from './GaneshaIcon';
import { CrescentStarIcon } from './IslamicMotifs';
import { BirthdayCakeIcon } from './BirthdayMotifs';
import { ShareInvitationModal } from './ShareInvitationModal';

interface SavedDraftsModalProps {
  savedCards: AnyInvitationData[];
  currentCardId: string;
  onSelectCard: (id: string) => void;
  onPreviewCard: (id: string) => void;
  onNewCard: (category: CardCategory) => void;
  onDuplicateCard: (id: string) => void;
  onRenameCard: (id: string, newTitle: string) => void;
  onDeleteCard: (id: string) => void;
  onExportAll: () => void;
  onImportAll: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClose: () => void;
}

export const SavedDraftsModal: React.FC<SavedDraftsModalProps> = ({
  savedCards,
  currentCardId,
  onSelectCard,
  onPreviewCard,
  onNewCard,
  onDuplicateCard,
  onRenameCard,
  onDeleteCard,
  onExportAll,
  onImportAll,
  onClose
}) => {
  const [filterCategory, setFilterCategory] = useState<'all' | CardCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editTitleText, setEditTitleText] = useState('');
  const [sharingCard, setSharingCard] = useState<AnyInvitationData | null>(null);
  const [cardToDelete, setCardToDelete] = useState<AnyInvitationData | null>(null);

  const getCategoryBadge = (category: CardCategory) => {
    switch (category) {
      case 'hindu_wedding':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fdf6e7] text-[#87091f] border border-[#d4af37]">
            <GaneshaIcon size={14} /> हिंदू शादी
          </span>
        );
      case 'muslim_wedding':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#064e3b] border border-emerald-300">
            <CrescentStarIcon size={14} /> मुस्लिम शादी
          </span>
        );
      case 'birthday':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-pink-50 text-pink-700 border border-pink-300">
            <BirthdayCakeIcon size={14} /> जन्मदिन
          </span>
        );
    }
  };

  const getCardDate = (card: AnyInvitationData) => {
    if (card.category === 'birthday') return card.partyDateDisplay;
    return card.weddingDateDisplay;
  };

  const getCardNames = (card: AnyInvitationData) => {
    if (card.category === 'birthday') return `${card.celebrantName} ${card.age ? `(${card.age})` : ''}`;
    return `${card.groomName} संग ${card.brideName}`;
  };

  const handleStartRename = (card: AnyInvitationData) => {
    setEditingTitleId(card.id);
    setEditTitleText(card.title);
  };

  const handleSaveRename = (id: string) => {
    if (editTitleText.trim().length > 0) {
      onRenameCard(id, editTitleText.trim());
    }
    setEditingTitleId(null);
  };

  const filteredCards = savedCards.filter((card) => {
    const matchesCategory = filterCategory === 'all' || card.category === filterCategory;
    const matchesSearch =
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      getCardNames(card).toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#fffdf9] border-2 border-[#d4af37] rounded-3xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden my-auto text-left font-devanagari-serif text-xs">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-[#3a0208] text-[#ffd700] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#87091f] text-[#ffd700] rounded-xl shadow-xs">
              <FolderHeart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-devanagari-royal font-bold text-base sm:text-lg text-[#ffd700] leading-tight">
                सहेजे गए निमंत्रण पत्र डैशबोर्ड (Saved Invitations)
              </h3>
              <p className="text-[11px] text-amber-200/90">
                असीमित अलग-अलग निमंत्रण पत्र प्रबंधित, एडिट, क्लोन व शेयर करें।
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

        {/* Dashboard Actions Bar: Create New + Filters */}
        <div className="p-3.5 bg-[#fdf8ef] border-b border-stone-200 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-stone-800 text-xs">
              नया निमंत्रण बनाएँ (Create New Invitation):
            </span>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => onNewCard('hindu_wedding')}
                className="px-3 py-1.5 bg-[#87091f] text-[#ffd700] rounded-xl text-xs font-bold shadow-xs hover:bg-[#630514] flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> हिंदू शादी
              </button>
              <button
                type="button"
                onClick={() => onNewCard('muslim_wedding')}
                className="px-3 py-1.5 bg-[#064e3b] text-[#ffd700] rounded-xl text-xs font-bold shadow-xs hover:bg-[#022c22] flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> मुस्लिम शादी
              </button>
              <button
                type="button"
                onClick={() => onNewCard('birthday')}
                className="px-3 py-1.5 bg-[#ec4899] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#db2777] flex items-center gap-1 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" /> जन्मदिन
              </button>
            </div>
          </div>

          {/* Search & Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-stone-200">
            <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-stone-300 w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <input
                type="text"
                placeholder="खोजें (शीर्षक या नाम)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-xs text-stone-700"
              />
            </div>

            <div className="flex items-center gap-1 font-bold">
              <button
                type="button"
                onClick={() => setFilterCategory('all')}
                className={`px-2.5 py-1 rounded-lg text-[11px] transition-all ${
                  filterCategory === 'all'
                    ? 'bg-[#87091f] text-[#ffd700]'
                    : 'bg-white text-stone-600 border border-stone-200'
                }`}
              >
                सभी ({savedCards.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('hindu_wedding')}
                className={`px-2 py-1 rounded-lg text-[11px] transition-all ${
                  filterCategory === 'hindu_wedding'
                    ? 'bg-[#87091f] text-[#ffd700]'
                    : 'bg-white text-stone-600 border border-stone-200'
                }`}
              >
                हिंदू
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('muslim_wedding')}
                className={`px-2 py-1 rounded-lg text-[11px] transition-all ${
                  filterCategory === 'muslim_wedding'
                    ? 'bg-[#064e3b] text-[#ffd700]'
                    : 'bg-white text-stone-600 border border-stone-200'
                }`}
              >
                मुस्लिम
              </button>
              <button
                type="button"
                onClick={() => setFilterCategory('birthday')}
                className={`px-2 py-1 rounded-lg text-[11px] transition-all ${
                  filterCategory === 'birthday'
                    ? 'bg-[#ec4899] text-white'
                    : 'bg-white text-stone-600 border border-stone-200'
                }`}
              >
                बर्थडे
              </button>
            </div>
          </div>
        </div>

        {/* Saved Cards List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredCards.length === 0 ? (
            <div className="text-center py-12 text-stone-500 space-y-2">
              <FolderHeart className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-xs">कोई निमंत्रण पत्र नहीं मिला।</p>
              <p className="text-[11px] text-stone-400">ऊपर दिए गए बटनों से नया कार्ड तैयार करें!</p>
            </div>
          ) : (
            filteredCards.map((card) => {
              const isSelected = card.id === currentCardId;

              return (
                <div
                  key={card.id}
                  className={`p-4 rounded-2xl border-2 transition-all space-y-2.5 ${
                    isSelected
                      ? 'bg-[#fdf6e7] border-[#d4af37] shadow-md ring-2 ring-[#d4af37]/30'
                      : 'bg-white border-stone-200 hover:border-[#d4af37]/60'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {getCategoryBadge(card.category)}
                        {isSelected && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> सक्रिय (Active)
                          </span>
                        )}
                      </div>

                      {/* Rename input or title */}
                      {editingTitleId === card.id ? (
                        <div className="flex items-center gap-1.5 pt-1">
                          <input
                            type="text"
                            value={editTitleText}
                            onChange={(e) => setEditTitleText(e.target.value)}
                            className="px-2 py-1 bg-white border border-[#d4af37] rounded-lg text-xs font-bold text-stone-800 outline-none"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveRename(card.id)}
                            className="px-2 py-1 bg-[#87091f] text-[#ffd700] rounded-lg text-[10px] font-bold"
                          >
                            सहेजें
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingTitleId(null)}
                            className="px-2 py-1 bg-stone-200 text-stone-700 rounded-lg text-[10px]"
                          >
                            रद्द
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 pt-0.5">
                          <h4 className="font-devanagari-royal font-bold text-sm text-[#3d0c15]">
                            {card.title}
                          </h4>
                          <button
                            type="button"
                            onClick={() => handleStartRename(card)}
                            className="text-stone-400 hover:text-stone-600 text-[10px] underline"
                            title="नाम बदलें"
                          >
                            बदलें
                          </button>
                        </div>
                      )}

                      <p className="text-xs text-stone-600 font-bold">
                        {getCardNames(card)}
                      </p>

                      <p className="text-[11px] text-stone-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-stone-400" />
                        <span>{getCardDate(card)}</span>
                      </p>
                    </div>

                    {/* Action Buttons for this invitation */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {/* 1. Edit */}
                      <button
                        type="button"
                        onClick={() => onSelectCard(card.id)}
                        className="px-2.5 py-1.5 bg-[#fdf6e7] hover:bg-[#f6ebd4] text-[#87091f] border border-[#d4af37] rounded-xl font-bold flex items-center gap-1 text-[11px] transition-all"
                        title="एडिट करें"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>एडिट</span>
                      </button>

                      {/* 2. Preview */}
                      <button
                        type="button"
                        onClick={() => onPreviewCard(card.id)}
                        className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold flex items-center gap-1 text-[11px] transition-all"
                        title="पूर्वावलोकन देखें"
                      >
                        <Eye className="w-3 h-3" />
                        <span>प्रीव्यू</span>
                      </button>

                      {/* 3. Duplicate */}
                      <button
                        type="button"
                        onClick={() => onDuplicateCard(card.id)}
                        className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold flex items-center gap-1 text-[11px] transition-all"
                        title="प्रतिलिपि / क्लोन बनाएँ"
                      >
                        <Copy className="w-3 h-3 text-[#064e3b]" />
                        <span>कॉपी</span>
                      </button>

                      {/* 4. Share */}
                      <button
                        type="button"
                        onClick={() => setSharingCard(card)}
                        className="px-3 py-1.5 bg-[#87091f] hover:bg-[#630514] text-[#ffd700] rounded-xl font-bold flex items-center gap-1 text-[11px] transition-all shadow-xs active:scale-95"
                        title="अलग से शेयर करें"
                      >
                        <Share2 className="w-3 h-3" />
                        <span>शेयर</span>
                      </button>

                      {/* 5. Delete (with confirmation) */}
                      {savedCards.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setCardToDelete(card)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition-colors ml-1"
                          title="हटाएँ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer with Backup & Restore */}
        <div className="p-3.5 sm:p-4 border-t border-stone-200 bg-[#fdf8ef] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onExportAll}
              className="px-3 py-1.5 text-stone-700 hover:bg-stone-200 border border-stone-300 rounded-xl flex items-center gap-1 font-bold"
              title="सभी निमंत्रण पत्रों की बैकअप फ़ाइल डाउनलोड करें"
            >
              <Download className="w-3.5 h-3.5 text-[#87091f]" /> बैकअप (JSON)
            </button>
            <label className="px-3 py-1.5 text-stone-700 hover:bg-stone-200 border border-stone-300 rounded-xl flex items-center gap-1 font-bold cursor-pointer" title="बैकअप JSON से कार्ड रीस्टोर करें">
              <Upload className="w-3.5 h-3.5 text-[#064e3b]" /> रीस्टोर
              <input type="file" accept=".json" onChange={onImportAll} className="hidden" />
            </label>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#87091f] text-[#ffd700] font-bold rounded-xl active:scale-95"
          >
            पूर्ण (Done)
          </button>
        </div>
      </div>

      {/* Share Modal for specific card */}
      {sharingCard && (
        <ShareInvitationModal
          card={sharingCard}
          onClose={() => setSharingCard(null)}
        />
      )}

      {/* Delete Confirmation In-Modal Dialog */}
      {cardToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fffdf9] border-2 border-rose-600 rounded-3xl p-5 sm:p-6 max-w-sm w-full shadow-2xl text-center space-y-3.5 font-devanagari-serif text-xs">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto shadow-inner">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-stone-900 font-devanagari-royal">
                निमंत्रण पत्र हटाएं?
              </h4>
              <p className="text-stone-600 mt-1">
                क्या आप वाकई <strong className="text-stone-900">"{cardToDelete.title}"</strong> को हमेशा के लिए हटाना चाहते हैं?
              </p>
              <p className="text-[10px] text-rose-600 font-bold mt-0.5">
                यह क्रिया वापस नहीं ली जा सकती।
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setCardToDelete(null)}
                className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl active:scale-95 transition-all"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteCard(cardToDelete.id);
                  setCardToDelete(null);
                }}
                className="flex-1 py-2 bg-rose-700 hover:bg-rose-800 text-white font-bold rounded-xl shadow-sm active:scale-95 transition-all"
              >
                हाँ, हटाएं
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
