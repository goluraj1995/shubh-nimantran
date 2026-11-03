import React, { useState } from 'react';
import { CardCategory, AnyInvitationData, DesignSettings, CardPhoto, MusicSettings } from '../types/invitation';
import { PRESET_BACKGROUNDS, AVAILABLE_FONTS, getDefaultDesign } from '../utils/defaultDesign';
import { readImageFileAsDataUrl } from '../utils/imageUpload';
import { exportCardAsPdf } from '../utils/exportCard';
import { CustomMusicPlayer } from './CustomMusicPlayer';
import { ShareInvitationModal } from './ShareInvitationModal';
import {
  Crop, ZoomIn, ZoomOut, Move, RotateCw, Sun, Contrast, Image as ImageIcon,
  Type, Palette, Undo, RotateCcw, Save, Download, Printer, Check, Upload,
  Sparkles, X, Plus, Trash2, RefreshCw, FileText, Music, Share2
} from 'lucide-react';

interface VisualDesignEditorProps {
  card: AnyInvitationData;
  onChange: (updated: AnyInvitationData) => void;
  onSaveDraft: () => void;
  onExportImage: () => void;
  onClose?: () => void;
}

export const VisualDesignEditor: React.FC<VisualDesignEditorProps> = ({
  card,
  onChange,
  onSaveDraft,
  onExportImage,
  onClose
}) => {
  const [editorTab, setEditorTab] = useState<'photo' | 'background' | 'typography' | 'music'>('photo');
  const [historyStack, setHistoryStack] = useState<DesignSettings[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [editingPhotoIndex, setEditingPhotoIndex] = useState<number | null>(null);
  const [editorNotice, setEditorNotice] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Current design settings with category fallback
  const design: DesignSettings = card.design || getDefaultDesign(card.category);

  // Push to undo stack
  const updateDesign = (newDesign: DesignSettings) => {
    setHistoryStack((prev) => [design, ...prev.slice(0, 15)]);
    onChange({
      ...card,
      design: newDesign
    });
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const [previous, ...rest] = historyStack;
    setHistoryStack(rest);
    onChange({
      ...card,
      design: previous
    });
  };

  const handleResetDesign = () => {
    setShowResetConfirm(true);
  };

  const executeResetDesign = () => {
    const defaultDesign = getDefaultDesign(card.category);
    updateDesign(defaultDesign);
    setShowResetConfirm(false);
    setEditorNotice('डिज़ाइन सेटिंग्स डिफ़ॉल्ट पर रीसेट कर दी गईं!');
    setTimeout(() => setEditorNotice(null), 3000);
  };

  // 1. Photo Transform Helpers
  const updateTransform = (field: keyof DesignSettings['photoTransform'], value: any) => {
    updateDesign({
      ...design,
      photoTransform: {
        ...design.photoTransform,
        [field]: value
      }
    });
  };

  // Replace Main Photo
  const handleMainPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const dataUrl = await readImageFileAsDataUrl(file);
      onChange({
        ...card,
        originalHeroImageUrl: card.originalHeroImageUrl || card.heroImageUrl,
        heroImageUrl: dataUrl
      });
    } catch (err: any) {
      setEditorNotice(err.message || 'फ़ोटो अपलोड करने में त्रुटि');
    } finally {
      setIsUploading(false);
    }
  };

  // Revert to Original Photo
  const handleRevertOriginalPhoto = () => {
    if (card.originalHeroImageUrl) {
      onChange({
        ...card,
        heroImageUrl: card.originalHeroImageUrl
      });
      setEditorNotice('मूल फ़ोटो बहाल कर दी गई!');
      setTimeout(() => setEditorNotice(null), 2500);
    }
  };

  // Add new Gallery Photo from phone
  const handleAddGalleryPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const dataUrl = await readImageFileAsDataUrl(file);
      const newPhoto: CardPhoto = {
        id: `photo-${Date.now()}`,
        url: dataUrl,
        caption: 'विशेष पल'
      };
      onChange({
        ...card,
        photos: [newPhoto, ...(card.photos || [])]
      });
      setEditorNotice('गैलरी में नई फ़ोटो जोड़ी गई!');
      setTimeout(() => setEditorNotice(null), 2500);
    } catch (err: any) {
      setEditorNotice(err.message || 'गैलरी फ़ोटो अपलोड करने में त्रुटि');
    } finally {
      setIsUploading(false);
    }
  };

  // Replace existing Gallery Photo
  const handleReplaceGalleryPhoto = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const dataUrl = await readImageFileAsDataUrl(file);
      const updatedPhotos = [...(card.photos || [])];
      updatedPhotos[index] = {
        ...updatedPhotos[index],
        url: dataUrl
      };
      onChange({
        ...card,
        photos: updatedPhotos
      });
      setEditorNotice('फ़ोटो सफलतापूर्वक बदली गई!');
      setTimeout(() => setEditorNotice(null), 2500);
    } catch (err: any) {
      setEditorNotice(err.message || 'फ़ोटो बदलने में त्रुटि');
    } finally {
      setIsUploading(false);
    }
  };

  // Delete Gallery Photo
  const handleDeleteGalleryPhoto = (index: number) => {
    const updatedPhotos = (card.photos || []).filter((_, i) => i !== index);
    onChange({
      ...card,
      photos: updatedPhotos
    });
  };

  // 2. Background Settings Helpers
  const updateBackground = (field: keyof DesignSettings['background'], value: any) => {
    updateDesign({
      ...design,
      background: {
        ...design.background,
        [field]: value
      }
    });
  };

  // Custom Background Upload (or blackboard replacement)
  const handleCustomBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const dataUrl = await readImageFileAsDataUrl(file);
      updateDesign({
        ...design,
        background: {
          ...design.background,
          bgType: 'custom_image',
          customBgUrl: dataUrl
        }
      });
      setEditorNotice('कस्टम बैकग्राउंड इमेज सेट हो गई!');
      setTimeout(() => setEditorNotice(null), 2500);
    } catch (err: any) {
      setEditorNotice(err.message || 'बैकग्राउंड इमेज अपलोड करने में त्रुटि');
    } finally {
      setIsUploading(false);
    }
  };

  // 3. Typography Helpers
  const updateTypography = (field: keyof DesignSettings['typography'], value: any) => {
    updateDesign({
      ...design,
      typography: {
        ...design.typography,
        [field]: value
      }
    });
  };

  return (
    <div className="bg-[#fffdf9] border-2 border-[#d4af37] rounded-3xl p-4 sm:p-6 shadow-2xl card-paper-traditional text-left font-devanagari-serif text-xs">
      {/* Top Header & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d4af37]/40 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#87091f] text-[#ffd700] rounded-xl shadow-sm">
            <Palette className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-devanagari-royal font-bold text-sm sm:text-base text-[#630514]">
              विजुअल डिज़ाइन एडिटर (Visual Design Editor)
            </h3>
            <p className="text-[11px] text-stone-600">
              फ़ोटो ज़ूम, मूव, क्रॉप, बैकग्राउंड और फ़ॉन्ट को अपनी पसंद से सजाएं।
            </p>
          </div>
        </div>

        {/* Undo, Reset & Export Actions */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyStack.length === 0}
            className={`p-1.5 rounded-xl border flex items-center gap-1 text-[11px] font-bold transition-all ${
              historyStack.length > 0
                ? 'bg-[#fdf6e7] text-[#87091f] border-[#d4af37] hover:bg-[#faedd1]'
                : 'bg-stone-100 text-stone-400 border-stone-200 cursor-not-allowed'
            }`}
            title="पूर्ववत करें (Undo)"
          >
            <Undo className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Undo</span>
          </button>

          <button
            type="button"
            onClick={handleResetDesign}
            className="p-1.5 rounded-xl border border-stone-300 bg-[#fdf8ef] hover:bg-stone-200 text-stone-700 flex items-center gap-1 text-[11px] font-bold"
            title="डिफ़ॉल्ट डिज़ाइन रीसेट करें"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">रीसेट</span>
          </button>

          <button
            type="button"
            onClick={onSaveDraft}
            className="px-3 py-1.5 rounded-xl bg-[#064e3b] text-[#ffd700] hover:bg-[#022c22] font-bold flex items-center gap-1 text-[11px] shadow-sm active:scale-95"
            title="ड्राफ्ट सुरक्षित करें"
          >
            <Save className="w-3.5 h-3.5" />
            <span>सहेजें</span>
          </button>

          <button
            type="button"
            onClick={onExportImage}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#87091f] to-[#b22222] text-[#ffd700] hover:from-[#630514] hover:to-[#87091f] font-bold flex items-center gap-1 text-[11px] shadow-md active:scale-95"
            title="कार्ड को PNG इमेज के रूप में डाउनलोड करें"
          >
            <Download className="w-3.5 h-3.5" />
            <span>इमेज डाउनलोड</span>
          </button>

          <button
            type="button"
            onClick={() => exportCardAsPdf('card-render-container', 'shubh_nimantran_card.pdf')}
            className="px-2.5 py-1.5 rounded-xl bg-[#1e293b] text-[#ffd700] hover:bg-black font-bold flex items-center gap-1 text-[11px] shadow-sm active:scale-95"
            title="PDF प्रिंट या सुरक्षित करें"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-[#87091f] text-[#ffd700] hover:bg-[#630514] font-bold flex items-center gap-1 text-[11px] shadow-sm active:scale-95"
            title="इस कार्ड को अलग से शेयर करें"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>शेयर</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-stone-200 text-stone-600 ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Editor Sub-Tabs: Photo | Background | Typography | Music */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 bg-[#f5ecdc] p-1 rounded-2xl border border-[#d4af37]/40 mb-4 font-bold text-center">
        <button
          type="button"
          onClick={() => setEditorTab('photo')}
          className={`py-2 px-1.5 rounded-xl transition-all flex items-center justify-center gap-1 text-[11px] ${
            editorTab === 'photo'
              ? 'bg-[#87091f] text-[#ffd700] shadow'
              : 'text-stone-700 hover:bg-white/60'
          }`}
        >
          <Crop className="w-3 h-3" />
          <span>१. फ़ोटो</span>
        </button>

        <button
          type="button"
          onClick={() => setEditorTab('background')}
          className={`py-2 px-1.5 rounded-xl transition-all flex items-center justify-center gap-1 text-[11px] ${
            editorTab === 'background'
              ? 'bg-[#87091f] text-[#ffd700] shadow'
              : 'text-stone-700 hover:bg-white/60'
          }`}
        >
          <ImageIcon className="w-3 h-3" />
          <span>२. बैकग्राउंड</span>
        </button>

        <button
          type="button"
          onClick={() => setEditorTab('typography')}
          className={`py-2 px-1.5 rounded-xl transition-all flex items-center justify-center gap-1 text-[11px] ${
            editorTab === 'typography'
              ? 'bg-[#87091f] text-[#ffd700] shadow'
              : 'text-stone-700 hover:bg-white/60'
          }`}
        >
          <Type className="w-3 h-3" />
          <span>३. फ़ॉन्ट</span>
        </button>

        <button
          type="button"
          onClick={() => setEditorTab('music')}
          className={`py-2 px-1.5 rounded-xl transition-all flex items-center justify-center gap-1 text-[11px] ${
            editorTab === 'music'
              ? 'bg-[#87091f] text-[#ffd700] shadow'
              : 'text-stone-700 hover:bg-white/60'
          }`}
        >
          <Music className="w-3 h-3" />
          <span>४. संगीत</span>
        </button>
      </div>

      {/* Inline Notice Banner */}
      {editorNotice && (
        <div className="p-2.5 mb-4 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl font-bold text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>{editorNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setEditorNotice(null)}
            className="text-stone-400 hover:text-stone-700"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. PHOTO EDITOR CONTROLS */}
      {editorTab === 'photo' && (
        <div className="space-y-4">
          {/* Main Photo Replacement */}
          <div className="p-3.5 bg-[#fdf8ef] border border-[#d4af37]/60 rounded-2xl space-y-2">
            <span className="font-bold text-stone-800 block text-xs">
              मुख्य फ़ोटो बदलें (फ़ोन गैलरी से चुनें):
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1.5 px-3.5 py-2 bg-[#87091f] text-[#ffd700] rounded-xl cursor-pointer hover:bg-[#630514] font-bold shadow-sm transition-all">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'फ़ोटो लोड हो रही है...' : 'फ़ोन गैलरी से फ़ोटो बदलें'}</span>
                <input type="file" accept="image/*" onChange={handleMainPhotoUpload} className="hidden" />
              </label>

              {card.originalHeroImageUrl && (
                <button
                  type="button"
                  onClick={handleRevertOriginalPhoto}
                  className="px-3 py-2 bg-white border border-stone-300 rounded-xl text-stone-700 hover:bg-stone-100 font-bold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3 text-[#87091f]" />
                  <span>मूल फ़ोटो वापस लाएँ (Revert)</span>
                </button>
              )}
            </div>
          </div>

          {/* Zoom & Fit/Fill Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Zoom Slider */}
            <div className="p-3 bg-white border border-stone-200 rounded-2xl space-y-1.5">
              <div className="flex items-center justify-between font-bold text-stone-800">
                <span className="flex items-center gap-1">
                  <ZoomIn className="w-3.5 h-3.5 text-[#87091f]" /> ज़ूम इन / आउट (Zoom)
                </span>
                <span className="text-[#87091f]">{Math.round(design.photoTransform.zoom * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.05"
                value={design.photoTransform.zoom}
                onChange={(e) => updateTransform('zoom', parseFloat(e.target.value))}
                className="w-full accent-[#87091f]"
              />
              <div className="flex justify-between text-[10px] text-stone-500">
                <span>50%</span>
                <span>100% (सामान्य)</span>
                <span>250%</span>
              </div>
            </div>

            {/* Fit vs Cover */}
            <div className="p-3 bg-white border border-stone-200 rounded-2xl space-y-1.5">
              <span className="font-bold text-stone-800 block">फ़्रेम फिट मोड (Fit / Fill)</span>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => updateTransform('fitMode', 'cover')}
                  className={`py-1.5 px-2 rounded-xl font-bold border transition-all ${
                    design.photoTransform.fitMode === 'cover'
                      ? 'bg-[#87091f] text-[#ffd700] border-[#87091f]'
                      : 'bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  फ़िल (Cover Full)
                </button>
                <button
                  type="button"
                  onClick={() => updateTransform('fitMode', 'contain')}
                  className={`py-1.5 px-2 rounded-xl font-bold border transition-all ${
                    design.photoTransform.fitMode === 'contain'
                      ? 'bg-[#87091f] text-[#ffd700] border-[#87091f]'
                      : 'bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  पूरी फ़ोटो (Contain Fit)
                </button>
              </div>
            </div>
          </div>

          {/* Move / Pan Controls (X and Y position) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white border border-stone-200 rounded-2xl space-y-1">
              <div className="flex items-center justify-between font-bold text-stone-800">
                <span className="flex items-center gap-1">
                  <Move className="w-3.5 h-3.5 text-[#87091f]" /> क्षैतिज स्थिति (Horizontal Pan X)
                </span>
                <span>{design.photoTransform.panX}%</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                step="2"
                value={design.photoTransform.panX}
                onChange={(e) => updateTransform('panX', parseInt(e.target.value))}
                className="w-full accent-[#87091f]"
              />
            </div>

            <div className="p-3 bg-white border border-stone-200 rounded-2xl space-y-1">
              <div className="flex items-center justify-between font-bold text-stone-800">
                <span className="flex items-center gap-1">
                  <Move className="w-3.5 h-3.5 text-[#87091f]" /> लंबवत स्थिति (Vertical Pan Y)
                </span>
                <span>{design.photoTransform.panY}%</span>
              </div>
              <input
                type="range"
                min="-60"
                max="60"
                step="2"
                value={design.photoTransform.panY}
                onChange={(e) => updateTransform('panY', parseInt(e.target.value))}
                className="w-full accent-[#87091f]"
              />
            </div>
          </div>

          {/* Rotation, Brightness & Contrast */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-white border border-stone-200 rounded-2xl space-y-1.5">
              <span className="font-bold text-stone-800 flex items-center gap-1">
                <RotateCw className="w-3.5 h-3.5 text-[#87091f]" /> घुमाएं (Rotate)
              </span>
              <button
                type="button"
                onClick={() => updateTransform('rotation', (design.photoTransform.rotation + 90) % 360)}
                className="w-full py-1.5 bg-[#fdf6e7] hover:bg-[#faedd1] text-[#87091f] font-bold rounded-xl border border-[#d4af37]"
              >
                90° घुमाएं ({design.photoTransform.rotation}°)
              </button>
            </div>

            <div className="p-3 bg-white border border-stone-200 rounded-2xl space-y-1">
              <div className="flex items-center justify-between font-bold text-stone-800">
                <span className="flex items-center gap-1">
                  <Sun className="w-3.5 h-3.5 text-amber-600" /> चमक (Brightness)
                </span>
                <span>{design.photoTransform.brightness}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="140"
                value={design.photoTransform.brightness}
                onChange={(e) => updateTransform('brightness', parseInt(e.target.value))}
                className="w-full accent-amber-600"
              />
            </div>

            <div className="p-3 bg-white border border-stone-200 rounded-2xl space-y-1">
              <div className="flex items-center justify-between font-bold text-stone-800">
                <span className="flex items-center gap-1">
                  <Contrast className="w-3.5 h-3.5 text-stone-700" /> कंट्रास्ट (Contrast)
                </span>
                <span>{design.photoTransform.contrast}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="140"
                value={design.photoTransform.contrast}
                onChange={(e) => updateTransform('contrast', parseInt(e.target.value))}
                className="w-full accent-stone-700"
              />
            </div>
          </div>

          {/* Gallery Photos Management Section */}
          <div className="p-3.5 bg-white border border-[#d4af37]/60 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-stone-800 block text-xs">
                  गैलरी फ़ोटो प्रबंधक (Gallery & Moments Photos):
                </span>
                <p className="text-[10px] text-stone-500">
                  कार्ड में दिखने वाली गैलरी फ़ोटो को कभी भी बदलें या नई फ़ोटो जोड़ें।
                </p>
              </div>

              <label className="flex items-center gap-1 px-3 py-1.5 bg-[#87091f] text-[#ffd700] rounded-xl cursor-pointer hover:bg-[#630514] font-bold shadow-sm transition-all text-[11px]">
                <Plus className="w-3.5 h-3.5" />
                <span>नई फ़ोटो जोड़ें</span>
                <input type="file" accept="image/*" onChange={handleAddGalleryPhoto} className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {(card.photos || []).map((photo, idx) => (
                <div key={photo.id || idx} className="relative group rounded-xl overflow-hidden border border-stone-200 bg-stone-50">
                  <img src={photo.url} alt={photo.caption} className="w-full h-20 object-cover" />
                  <div className="p-1 bg-stone-100 flex items-center justify-between">
                    <span className="text-[10px] text-stone-600 truncate max-w-[70px]">{photo.caption || `फ़ोटो #${idx + 1}`}</span>
                    <div className="flex items-center gap-1">
                      <label className="p-1 text-[#87091f] hover:bg-stone-200 rounded cursor-pointer" title="फ़ोटो बदलें">
                        <Upload className="w-3 h-3" />
                        <input type="file" accept="image/*" onChange={(e) => handleReplaceGalleryPhoto(idx, e)} className="hidden" />
                      </label>
                      <button
                        type="button"
                        onClick={() => handleDeleteGalleryPhoto(idx)}
                        className="p-1 text-red-600 hover:bg-stone-200 rounded"
                        title="हटाएँ"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. BACKGROUND EDITOR CONTROLS */}
      {editorTab === 'background' && (
        <div className="space-y-4">
          <div className="p-3 bg-[#fdf8ef] border border-[#d4af37] rounded-xl space-y-1">
            <span className="font-bold text-stone-800 block">
              कार्ड का बैकग्राउंड चुनें (चाकबोर्ड, ब्लैकबोर्ड, फ्लोरल, पारंपरिक, या अपनी छवि):
            </span>
            <p className="text-[11px] text-stone-600">
              आप ब्लैकबोर्ड या किसी भी बैकग्राउंड को अपनी व्यक्तिगत फ़ोटो से कभी भी बदल सकते हैं।
            </p>
          </div>

          {/* Preset Background Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {PRESET_BACKGROUNDS.map((bg) => {
              const isSelected = design.background.bgType === bg.id;

              return (
                <div
                  key={bg.id}
                  onClick={() => updateBackground('bgType', bg.id)}
                  className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center justify-between text-center relative overflow-hidden h-28 ${
                    isSelected
                      ? 'border-[#87091f] shadow-md ring-2 ring-[#ffd700]'
                      : 'border-stone-200 hover:border-[#d4af37]'
                  }`}
                  style={{
                    backgroundColor: bg.previewColor,
                    backgroundImage: bg.imageUrl ? `url(${bg.imageUrl})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]"></div>
                  <div className="relative z-10 w-full flex justify-end">
                    {isSelected && (
                      <span className="p-0.5 bg-[#87091f] text-[#ffd700] rounded-full">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>
                  <span className="relative z-10 font-bold text-xs text-white drop-shadow-md">
                    {bg.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Upload Personal Background Image & Replace Blackboard */}
          <div className="p-4 bg-white border border-[#d4af37]/60 rounded-2xl space-y-2">
            <span className="font-bold text-stone-800 block text-xs">
              अपना बैकग्राउंड या ब्लैकबोर्ड की जगह व्यक्तिगत फ़ोटो अपलोड करें:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1.5 px-4 py-2 bg-[#064e3b] text-[#ffd700] rounded-xl cursor-pointer hover:bg-[#022c22] font-bold shadow-sm transition-all">
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'बैकग्राउंड लोड हो रहा है...' : 'अपनी बैकग्राउंड फ़ोटो अपलोड करें'}</span>
                <input type="file" accept="image/*" onChange={handleCustomBgUpload} className="hidden" />
              </label>

              {design.background.customBgUrl && (
                <span className="text-[11px] text-emerald-800 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> व्यक्तिगत बैकग्राउंड सक्रिय है
                </span>
              )}
            </div>
          </div>

          {/* Plain Color Picker & Opacity */}
          {design.background.bgType === 'plain_color' && (
            <div className="p-3.5 bg-white border border-stone-200 rounded-2xl space-y-2">
              <span className="font-bold text-stone-800 block">एकसमान रंग (Plain Color) चुनें:</span>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={design.background.plainColor || '#fffaf0'}
                  onChange={(e) => updateBackground('plainColor', e.target.value)}
                  className="w-10 h-10 rounded-xl border border-stone-300 cursor-pointer"
                />
                <div className="flex flex-wrap gap-2">
                  {['#fffaf0', '#fdf6e7', '#f0fdf4', '#fff1f2', '#064e3b', '#5c0612', '#1e293b', '#ffffff'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => updateBackground('plainColor', color)}
                      className="w-7 h-7 rounded-full border-2 border-stone-300 shadow-sm"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Background Overlay Darkness Slider */}
          <div className="p-3 bg-white border border-stone-200 rounded-2xl space-y-1">
            <div className="flex items-center justify-between font-bold text-stone-800">
              <span>बैकग्राउंड लाइट/डार्क ओपैसिटी (Overlay Opacity)</span>
              <span>{design.background.overlayOpacity || 85}%</span>
            </div>
            <input
              type="range"
              min="30"
              max="95"
              step="5"
              value={design.background.overlayOpacity || 85}
              onChange={(e) => updateBackground('overlayOpacity', parseInt(e.target.value))}
              className="w-full accent-[#87091f]"
            />
          </div>
        </div>
      )}

      {/* 3. FONT & TYPOGRAPHY EDITOR CONTROLS */}
      {editorTab === 'typography' && (
        <div className="space-y-4">
          {/* Font Selector */}
          <div className="p-3.5 bg-white border border-[#d4af37]/60 rounded-2xl space-y-2">
            <span className="font-bold text-stone-800 block text-xs">
              फ़ॉन्ट स्टाइल चुनें (हिंदी, उर्दू, अंग्रेजी व चाकबोर्ड फ़ॉन्ट्स):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AVAILABLE_FONTS.map((f) => {
                const isSelected = design.typography.fontFamily === f.id;

                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => updateTypography('fontFamily', f.id)}
                    className={`p-2.5 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-[#87091f] bg-[#fdf6e7] shadow-sm font-bold ring-1 ring-[#87091f]'
                        : 'border-stone-200 hover:border-stone-400 bg-white'
                    }`}
                  >
                    <span className="text-[10px] text-stone-400 block font-normal">
                      {f.type === 'urdu' ? 'उर्दू (Urdu RTL)' : f.type}
                    </span>
                    <span className="text-xs text-[#3d0c15]" style={{ fontFamily: f.family }}>
                      {f.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Font Size & Alignment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Font Size Scale */}
            <div className="p-3 bg-white border border-stone-200 rounded-2xl space-y-1.5">
              <span className="font-bold text-stone-800 block">फ़ॉन्ट आकार (Font Size Scale)</span>
              <div className="grid grid-cols-4 gap-1.5 pt-1 font-bold">
                {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => updateTypography('fontSizeScale', sz)}
                    className={`py-1.5 rounded-xl border uppercase transition-all ${
                      design.typography.fontSizeScale === sz
                        ? 'bg-[#87091f] text-[#ffd700] border-[#87091f]'
                        : 'bg-stone-50 text-stone-700 border-stone-200'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Alignment */}
            <div className="p-3 bg-white border border-stone-200 rounded-2xl space-y-1.5">
              <span className="font-bold text-stone-800 block">टेक्स्ट अलाइनमेंट (Alignment)</span>
              <div className="grid grid-cols-3 gap-1.5 pt-1 font-bold">
                <button
                  type="button"
                  onClick={() => updateTypography('textAlignment', 'left')}
                  className={`py-1.5 rounded-xl border transition-all ${
                    design.typography.textAlignment === 'left'
                      ? 'bg-[#87091f] text-[#ffd700] border-[#87091f]'
                      : 'bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  बाएं (Left)
                </button>
                <button
                  type="button"
                  onClick={() => updateTypography('textAlignment', 'center')}
                  className={`py-1.5 rounded-xl border transition-all ${
                    design.typography.textAlignment === 'center'
                      ? 'bg-[#87091f] text-[#ffd700] border-[#87091f]'
                      : 'bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  मध्य (Center)
                </button>
                <button
                  type="button"
                  onClick={() => updateTypography('textAlignment', 'right')}
                  className={`py-1.5 rounded-xl border transition-all ${
                    design.typography.textAlignment === 'right'
                      ? 'bg-[#87091f] text-[#ffd700] border-[#87091f]'
                      : 'bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  दाएं (Right)
                </button>
              </div>
            </div>
          </div>

          {/* Text Color & Accent Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-white border border-stone-200 rounded-2xl space-y-1.5">
              <span className="font-bold text-stone-800 block">मुख्य टेक्स्ट रंग (Text Color)</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={design.typography.textColor}
                  onChange={(e) => updateTypography('textColor', e.target.value)}
                  className="w-9 h-9 rounded-xl border cursor-pointer"
                />
                <div className="flex flex-wrap gap-1.5">
                  {['#3d0c15', '#064e3b', '#2c1810', '#1e293b', '#ffffff', '#ffd700', '#b8860b'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => updateTypography('textColor', c)}
                      className="w-6 h-6 rounded-full border border-stone-300 shadow-sm"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 bg-white border border-stone-200 rounded-2xl space-y-1.5">
              <span className="font-bold text-stone-800 block">सुनहरा / हाइलाइट रंग (Accent Color)</span>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={design.typography.accentColor}
                  onChange={(e) => updateTypography('accentColor', e.target.value)}
                  className="w-9 h-9 rounded-xl border cursor-pointer"
                />
                <div className="flex flex-wrap gap-1.5">
                  {['#d4af37', '#ffd700', '#b8860b', '#ec4899', '#f97316', '#10b981', '#38bdf8'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => updateTypography('accentColor', c)}
                      className="w-6 h-6 rounded-full border border-stone-300 shadow-sm"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Text Effects (Shadow, Outline) */}
          <div className="p-3 bg-white border border-stone-200 rounded-2xl flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer font-bold select-none">
              <input
                type="checkbox"
                checked={design.typography.textShadow}
                onChange={(e) => updateTypography('textShadow', e.target.checked)}
                className="w-4 h-4 accent-[#87091f]"
              />
              <span>टेक्स्ट शैडो / चमक (Text Shadow Glow)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold select-none">
              <input
                type="checkbox"
                checked={design.typography.textOutline}
                onChange={(e) => updateTypography('textOutline', e.target.checked)}
                className="w-4 h-4 accent-[#87091f]"
              />
              <span>हाई-कंट्रास्ट आउटलाइन (Outline)</span>
            </label>
          </div>
        </div>
      )}

      {/* 4. MUSIC & AUDIO CONTROLS */}
      {editorTab === 'music' && (
        <div className="space-y-4">
          <CustomMusicPlayer
            category={card.category}
            musicSettings={card.musicSettings}
            legacyMusicUrl={card.musicUrl}
            onChange={(updatedMusic) => {
              onChange({
                ...card,
                musicSettings: updatedMusic,
                musicUrl: updatedMusic.mode === 'none' ? undefined : (updatedMusic.audioUrl || card.musicUrl)
              });
            }}
          />
        </div>
      )}

      {/* Share Invitation Modal */}
      {isShareModalOpen && (
        <ShareInvitationModal
          card={card}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

      {/* In-App Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fffdf9] border-2 border-[#d4af37] rounded-3xl p-5 max-w-sm w-full shadow-2xl text-center space-y-3 font-devanagari-serif text-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-[#87091f] flex items-center justify-center mx-auto shadow-inner">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-stone-900 font-devanagari-royal">
                डिज़ाइन रीसेट करें?
              </h4>
              <p className="text-stone-600 mt-1">
                क्या आप डिज़ाइन सेटिंग्स (फ़ोटो, फ़ॉन्ट, बैकग्राउंड) को मूल डिफ़ॉल्ट पर रीसेट करना चाहते हैं?
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={executeResetDesign}
                className="flex-1 py-2 bg-[#87091f] hover:bg-[#630514] text-[#ffd700] font-bold rounded-xl shadow-sm"
              >
                हाँ, रीसेट करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
