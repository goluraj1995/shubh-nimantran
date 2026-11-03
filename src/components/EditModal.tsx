import React, { useState } from 'react';
import { WeddingData, HinduRitual, GalleryPhoto } from '../types/wedding';
import { X, Save, RotateCcw, Download, Upload, Plus, Trash2, Edit3, Heart, MapPin, Music, Sparkles, BookOpen, Image as ImageIcon } from 'lucide-react';
import { GaneshaIcon } from './GaneshaIcon';

interface EditModalProps {
  data: WeddingData;
  onSave: (newData: WeddingData) => void;
  onClose: () => void;
  onReset: () => void;
}

export const EditModal: React.FC<EditModalProps> = ({
  data,
  onSave,
  onClose,
  onReset
}) => {
  const [formData, setFormData] = useState<WeddingData>({ ...data });
  const [activeTab, setActiveTab] = useState<'couple' | 'texts' | 'event' | 'rituals' | 'gallery'>('couple');

  const handleChange = (field: keyof WeddingData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  // Rituals Handlers
  const handleToggleRitual = (index: number) => {
    setFormData((prev) => {
      const updated = [...prev.rituals];
      updated[index] = { ...updated[index], enabled: !updated[index].enabled };
      return { ...prev, rituals: updated };
    });
  };

  const handleUpdateRitual = (index: number, field: keyof HinduRitual, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.rituals];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, rituals: updated };
    });
  };

  const handleAddRitual = () => {
    const newRitual: HinduRitual = {
      id: `ritual-${Date.now()}`,
      name: 'नई रस्म / कार्यक्रम',
      subTitle: 'कार्यक्रम विवरण',
      date: formData.weddingDateDisplay,
      time: 'सायं 05:00 बजे',
      location: formData.venueName,
      description: 'समारोह का विस्तृत विवरण यहाँ लिखें...',
      dressCode: 'पारंपरिक परिधान',
      icon: 'sparkles',
      enabled: true
    };
    setFormData((prev) => ({
      ...prev,
      rituals: [...prev.rituals, newRitual]
    }));
  };

  const handleDeleteRitual = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      rituals: prev.rituals.filter((_, idx) => idx !== index)
    }));
  };

  // Gallery Photos Handlers
  const handleAddPhoto = () => {
    const newPhoto: GalleryPhoto = {
      id: `g-${Date.now()}`,
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
      caption: 'विवाह की मधुर स्मृति',
      category: 'couple'
    };
    setFormData((prev) => ({
      ...prev,
      gallery: [...prev.gallery, newPhoto]
    }));
  };

  const handleUpdatePhoto = (index: number, field: keyof GalleryPhoto, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.gallery];
      updated[index] = { ...updated[index], [field]: value as any };
      return { ...prev, gallery: updated };
    });
  };

  const handleDeletePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, idx) => idx !== index)
    }));
  };

  // Export / Import JSON
  const handleExportJson = () => {
    const jsonString = JSON.stringify(formData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `shubh_vivah_patrika_${formData.groomName}_${formData.brideName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (imported.groomName && imported.brideName) {
          setFormData(imported);
          alert('विवाह निमंत्रण डेटा सफलतापूर्वक लोड किया गया!');
        }
      } catch (err) {
        alert('अमान्य JSON फ़ाइल प्रारूप।');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#fffaf0] border-3 border-[#d4af37] rounded-3xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-[#d4af37]/50 bg-[#fdf6e7] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#7a0c1e] text-[#ffd700] rounded-xl shadow-sm">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-devanagari-royal font-bold text-lg text-[#630514]">
                विवाह पत्रिका विवरण संपादित करें (Customize)
              </h3>
              <p className="text-xs font-devanagari-serif text-stone-600">
                वर-वधू, परिवार, रस्मों, समय, स्थल व फोटो को अपनी आवश्यकतानुसार बदलें।
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-200 text-stone-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs in Hindi */}
        <div className="flex border-b border-[#d4af37]/40 bg-[#fbf2e0] overflow-x-auto p-1.5 text-xs font-devanagari-serif font-bold">
          <button
            onClick={() => setActiveTab('couple')}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'couple'
                ? 'bg-gradient-to-r from-[#87091f] to-[#b22222] text-[#ffd700] shadow'
                : 'text-stone-800 hover:bg-[#f3e5ab]/40'
            }`}
          >
            <Heart className="w-3.5 h-3.5" /> वर-वधू व परिवार
          </button>

          <button
            onClick={() => setActiveTab('rituals')}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'rituals'
                ? 'bg-gradient-to-r from-[#87091f] to-[#b22222] text-[#ffd700] shadow'
                : 'text-stone-800 hover:bg-[#f3e5ab]/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> विवाह की रस्में ({formData.rituals.filter(r => r.enabled).length})
          </button>

          <button
            onClick={() => setActiveTab('event')}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'event'
                ? 'bg-gradient-to-r from-[#87091f] to-[#b22222] text-[#ffd700] shadow'
                : 'text-stone-800 hover:bg-[#f3e5ab]/40'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" /> तिथि, मुहूर्त व स्थल
          </button>

          <button
            onClick={() => setActiveTab('texts')}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'texts'
                ? 'bg-gradient-to-r from-[#87091f] to-[#b22222] text-[#ffd700] shadow'
                : 'text-stone-800 hover:bg-[#f3e5ab]/40'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" /> श्लोक व संदेश
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2 rounded-xl whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'gallery'
                ? 'bg-gradient-to-r from-[#87091f] to-[#b22222] text-[#ffd700] shadow'
                : 'text-stone-800 hover:bg-[#f3e5ab]/40'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> फोटो गैलरी
          </button>
        </div>

        {/* Tab Form Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 font-devanagari-serif text-xs">
          {activeTab === 'couple' && (
            <div className="space-y-4">
              <div className="p-3 bg-[#fdf6e7] border border-[#d4af37] rounded-xl text-stone-800">
                <strong>वर एवं वधू पक्ष का विवरण:</strong>
              </div>

              {/* Groom Details */}
              <div className="p-4 bg-[#fdf8ef] border border-[#d4af37]/60 rounded-2xl space-y-3">
                <h4 className="font-devanagari-royal font-bold text-sm text-[#87091f]">वर पक्ष (Groom Details)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">वर का नाम *</label>
                    <input
                      type="text"
                      required
                      value={formData.groomName}
                      onChange={(e) => handleChange('groomName', e.target.value)}
                      placeholder="उदा. चि. कबीर"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#d4af37] text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">वर के माता-पिता *</label>
                    <input
                      type="text"
                      required
                      value={formData.groomParents}
                      onChange={(e) => handleChange('groomParents', e.target.value)}
                      placeholder="उदा. सुपुत्र: श्रीमती सरोज एवं श्री राजेंद्र शर्मा"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#d4af37] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">वर के दादा-दादी / कुल</label>
                    <input
                      type="text"
                      value={formData.groomGrandparents}
                      onChange={(e) => handleChange('groomGrandparents', e.target.value)}
                      placeholder="उदा. पौत्र: श्रीमती एवं स्व. श्री रामगोपाल शर्मा"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#d4af37] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">वर का शहर / निवास</label>
                    <input
                      type="text"
                      value={formData.groomCity || ''}
                      onChange={(e) => handleChange('groomCity', e.target.value)}
                      placeholder="उदा. उदयपुर, राजस्थान"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#d4af37] text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Bride Details */}
              <div className="p-4 bg-[#fdf8ef] border border-[#d4af37]/60 rounded-2xl space-y-3">
                <h4 className="font-devanagari-royal font-bold text-sm text-[#87091f]">वधू पक्ष (Bride Details)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">वधू का नाम *</label>
                    <input
                      type="text"
                      required
                      value={formData.brideName}
                      onChange={(e) => handleChange('brideName', e.target.value)}
                      placeholder="उदा. आयु. आर्या"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#d4af37] text-xs font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">वधू के माता-पिता *</label>
                    <input
                      type="text"
                      required
                      value={formData.brideParents}
                      onChange={(e) => handleChange('brideParents', e.target.value)}
                      placeholder="उदा. सुपुत्री: श्रीमती सुनीता एवं श्री विजय कपूर"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#d4af37] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">वधू के दादा-दादी / कुल</label>
                    <input
                      type="text"
                      value={formData.brideGrandparents}
                      onChange={(e) => handleChange('brideGrandparents', e.target.value)}
                      placeholder="उदा. पौत्री: श्रीमती एवं स्व. श्री दयाकिशन कपूर"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#d4af37] text-xs"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">वधू का शहर / निवास</label>
                    <input
                      type="text"
                      value={formData.brideCity || ''}
                      onChange={(e) => handleChange('brideCity', e.target.value)}
                      placeholder="उदा. जयपुर, राजस्थान"
                      className="w-full px-3 py-2 rounded-xl bg-white border border-[#d4af37] text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Family Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">दर्शनाभिलाषी</label>
                  <input
                    type="text"
                    value={formData.darshanabhilashi}
                    onChange={(e) => handleChange('darshanabhilashi', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#fdf8ef] border border-[#d4af37] text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">स्वागतकर्ता / स्वागताकांक्षी</label>
                  <input
                    type="text"
                    value={formData.swagatakankshi}
                    onChange={(e) => handleChange('swagatakankshi', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#fdf8ef] border border-[#d4af37] text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">बाल मनुहार</label>
                  <input
                    type="text"
                    value={formData.balManuhar}
                    onChange={(e) => handleChange('balManuhar', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#fdf8ef] border border-[#d4af37] text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">विनीत (प्रेषक)</label>
                  <input
                    type="text"
                    value={formData.vinit}
                    onChange={(e) => handleChange('vinit', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#fdf8ef] border border-[#d4af37] text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rituals' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-devanagari-royal font-bold text-sm text-[#87091f]">
                    हिंदू विवाह की पारंपरिक रस्में (Rituals)
                  </h4>
                  <p className="text-[11px] text-stone-600">
                    जिन रस्मों को दिखाना चाहते हैं उन्हें चेक रखें, बाकी को अनचेक कर सकते हैं।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddRitual}
                  className="px-3.5 py-1.5 bg-[#87091f] text-[#ffd700] rounded-xl font-bold flex items-center gap-1 shadow-sm hover:bg-[#630514]"
                >
                  <Plus className="w-3.5 h-3.5" /> रस्म जोड़ें
                </button>
              </div>

              <div className="space-y-3">
                {formData.rituals.map((r, idx) => (
                  <div
                    key={r.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      r.enabled
                        ? 'bg-[#fdf8ef] border-[#d4af37]'
                        : 'bg-stone-100 border-stone-300 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={r.enabled}
                          onChange={() => handleToggleRitual(idx)}
                          className="w-4 h-4 text-[#87091f] rounded accent-[#87091f]"
                        />
                        <span className="font-devanagari-royal font-bold text-sm text-[#7a0c1e]">
                          {r.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteRitual(idx)}
                        className="text-rose-600 p-1 hover:bg-rose-50 rounded-lg"
                        title="हटाएँ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      <input
                        type="text"
                        placeholder="रस्म का नाम"
                        value={r.name}
                        onChange={(e) => handleUpdateRitual(idx, 'name', e.target.value)}
                        className="px-2.5 py-1.5 bg-white border border-[#d4af37]/60 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="उप-शीर्षक (उदा. उबटन एवं मंगलगान)"
                        value={r.subTitle || ''}
                        onChange={(e) => handleUpdateRitual(idx, 'subTitle', e.target.value)}
                        className="px-2.5 py-1.5 bg-white border border-[#d4af37]/60 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="तारीख व दिन (उदा. शुक्रवार, 19 मार्च 2027)"
                        value={r.date}
                        onChange={(e) => handleUpdateRitual(idx, 'date', e.target.value)}
                        className="px-2.5 py-1.5 bg-white border border-[#d4af37]/60 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="शुभ समय (उदा. प्रातः 10:00 बजे)"
                        value={r.time}
                        onChange={(e) => handleUpdateRitual(idx, 'time', e.target.value)}
                        className="px-2.5 py-1.5 bg-white border border-[#d4af37]/60 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="स्थान / वेन्यू"
                        value={r.location}
                        onChange={(e) => handleUpdateRitual(idx, 'location', e.target.value)}
                        className="px-2.5 py-1.5 bg-white border border-[#d4af37]/60 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        placeholder="परिधान / ड्रेस कोड (वैकल्पिक)"
                        value={r.dressCode || ''}
                        onChange={(e) => handleUpdateRitual(idx, 'dressCode', e.target.value)}
                        className="px-2.5 py-1.5 bg-white border border-[#d4af37]/60 rounded-lg text-xs"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="रस्म का विवरण"
                      value={r.description}
                      onChange={(e) => handleUpdateRitual(idx, 'description', e.target.value)}
                      className="w-full mt-2 px-2.5 py-1.5 bg-white border border-[#d4af37]/60 rounded-lg text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'event' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-800 mb-1">विवाह तारीख व समय (ISO) *</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.weddingDateIso.slice(0, 16)}
                    onChange={(e) => handleChange('weddingDateIso', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d4af37] text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-800 mb-1">हिंदी में प्रदर्शित तारीख *</label>
                  <input
                    type="text"
                    required
                    value={formData.weddingDateDisplay}
                    onChange={(e) => handleChange('weddingDateDisplay', e.target.value)}
                    placeholder="उदा. शनिवार, 20 मार्च 2027"
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d4af37] text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">शुभ विवाह लग्न एवं मुहूर्त *</label>
                <input
                  type="text"
                  required
                  value={formData.weddingMuhurat}
                  onChange={(e) => handleChange('weddingMuhurat', e.target.value)}
                  placeholder="उदा. शुभ लग्न एवं पाणिग्रहण: सायं 07:15 बजे (गोधूलि वेला)"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#d4af37] text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">विवाह स्थल / वाटिका का नाम *</label>
                <input
                  type="text"
                  required
                  value={formData.venueName}
                  onChange={(e) => handleChange('venueName', e.target.value)}
                  placeholder="उदा. राजमहल पैलेस एवं हेरिटेज वाटिका"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#d4af37] text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">विवाह स्थल का पूरा पता *</label>
                <input
                  type="text"
                  required
                  value={formData.venueAddress}
                  onChange={(e) => handleChange('venueAddress', e.target.value)}
                  placeholder="उदा. लेक पिछोला रोड, हरदास जी की मगरी, उदयपुर, राजस्थान - 313001"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#d4af37] text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">Google Maps लोकेशन लिंक (विवाह स्थल का रास्ता) *</label>
                <input
                  type="url"
                  required
                  value={formData.googleMapsUrl}
                  onChange={(e) => handleChange('googleMapsUrl', e.target.value)}
                  placeholder="https://maps.google.com/?q=..."
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#d4af37] text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">वैकल्पिक शहनाई संगीत MP3 URL</label>
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-[#87091f]" />
                  <input
                    type="url"
                    placeholder="https://... (रिक्त छोड़ने पर अंतर्निहित शहनाई बजेगी)"
                    value={formData.musicUrl || ''}
                    onChange={(e) => handleChange('musicUrl', e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-[#d4af37] text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'texts' && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-stone-800 mb-1">शीर्षक वंदना</label>
                <input
                  type="text"
                  value={formData.headline}
                  onChange={(e) => handleChange('headline', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#d4af37] text-xs font-devanagari-royal"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">गणेश वंदना श्लोक</label>
                <textarea
                  rows={2}
                  value={formData.shloka}
                  onChange={(e) => handleChange('shloka', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#d4af37] text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">मांगलिक परिणय श्लोक</label>
                <textarea
                  rows={2}
                  value={formData.mangalShloka}
                  onChange={(e) => handleChange('mangalShloka', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#d4af37] text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">स्नेहपूर्ण हिंदी निमंत्रण संदेश</label>
                <textarea
                  rows={4}
                  value={formData.invitationMainText}
                  onChange={(e) => handleChange('invitationMainText', e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#d4af37] text-xs leading-relaxed"
                />
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-devanagari-royal font-bold text-sm text-[#87091f]">
                    वर-वधू फोटो गैलरी
                  </h4>
                  <p className="text-[11px] text-stone-600">
                    यहाँ से तस्वीरों के लिंक व कैप्शन बदलें।
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddPhoto}
                  className="px-3.5 py-1.5 bg-[#87091f] text-[#ffd700] rounded-xl font-bold flex items-center gap-1 shadow-sm hover:bg-[#630514]"
                >
                  <Plus className="w-3.5 h-3.5" /> फोटो जोड़ें
                </button>
              </div>

              <div className="space-y-3">
                {formData.gallery.map((photo, idx) => (
                  <div key={photo.id} className="p-3 bg-[#fdf8ef] border border-[#d4af37]/60 rounded-2xl flex items-center gap-3">
                    <img src={photo.url} alt="preview" className="w-14 h-14 object-cover rounded-xl border border-[#d4af37]" />
                    <div className="flex-1 space-y-1">
                      <input
                        type="url"
                        placeholder="फोटो URL"
                        value={photo.url}
                        onChange={(e) => handleUpdatePhoto(idx, 'url', e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-stone-300 rounded text-xs"
                      />
                      <input
                        type="text"
                        placeholder="कैप्शन (उदा. हल्दी व फूलों की रंगत)"
                        value={photo.caption}
                        onChange={(e) => handleUpdatePhoto(idx, 'caption', e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-stone-300 rounded text-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(idx)}
                      className="text-rose-600 p-2 hover:bg-rose-50 rounded-lg"
                      title="हटाएँ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </form>

        {/* Modal Footer Controls */}
        <div className="p-4 border-t border-[#d4af37]/50 bg-[#fdf6e7] flex flex-wrap items-center justify-between gap-2 font-devanagari-serif">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              className="px-3 py-1.5 text-xs text-stone-700 hover:text-stone-900 border border-stone-400 rounded-xl flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> डिफ़ॉल्ट रीसेट
            </button>
            <button
              type="button"
              onClick={handleExportJson}
              className="px-3 py-1.5 text-xs text-[#87091f] hover:bg-[#f3e5ab]/30 border border-[#d4af37] rounded-xl flex items-center gap-1 font-bold"
            >
              <Download className="w-3.5 h-3.5" /> डेटा डाउनलोड (JSON)
            </button>
            <label className="px-3 py-1.5 text-xs text-stone-800 hover:bg-stone-200 border border-stone-400 rounded-xl flex items-center gap-1 cursor-pointer">
              <Upload className="w-3.5 h-3.5" /> अपलोड (JSON)
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-200 rounded-xl"
            >
              रद्द करें
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-gradient-to-r from-[#87091f] to-[#b22222] text-[#ffd700] font-devanagari-royal font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:from-[#630514] hover:to-[#87091f] transition-all flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" /> बदलाव सहेजें
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
