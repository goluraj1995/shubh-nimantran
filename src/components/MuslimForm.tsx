import React, { useState } from 'react';
import { MuslimWeddingData, MuslimEvent } from '../types/invitation';
import { readImageFileAsDataUrl } from '../utils/imageUpload';
import { CustomMusicPlayer } from './CustomMusicPlayer';
import { Heart, Sparkles, MapPin, Upload, Plus, Trash2, Palette, Globe, BookOpen } from 'lucide-react';
import { CrescentStarIcon } from './IslamicMotifs';

import { computeCardTitle } from '../utils/normalizeInvitation';

interface MuslimFormProps {
  data: MuslimWeddingData;
  onChange: (updated: MuslimWeddingData) => void;
  onGenerate: () => void;
  pageButterflyEnabled?: boolean;
  setPageButterflyEnabled?: (val: boolean) => void;
  cardButterflyEnabled?: boolean;
  setCardButterflyEnabled?: (val: boolean) => void;
}

export const MuslimForm: React.FC<MuslimFormProps> = ({
  data,
  onChange,
  onGenerate,
  pageButterflyEnabled = true,
  setPageButterflyEnabled,
  cardButterflyEnabled = true,
  setCardButterflyEnabled
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'couple' | 'events' | 'texts' | 'venue' | 'theme'>('couple');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFieldChange = (field: keyof MuslimWeddingData, value: any) => {
    const updated = { ...data, [field]: value };
    if (field === 'groomName' || field === 'brideName') {
      updated.title = computeCardTitle(updated);
    }
    onChange(updated);
  };

  const handleToggleEvent = (id: string) => {
    const updated = data.events.map((e) =>
      e.id === id ? { ...e, enabled: !e.enabled } : e
    );
    onChange({ ...data, events: updated });
  };

  const handleUpdateEvent = (id: string, field: keyof MuslimEvent, value: any) => {
    const updated = data.events.map((e) =>
      e.id === id ? { ...e, [field]: value } : e
    );
    onChange({ ...data, events: updated });
  };

  const handleAddEvent = () => {
    const newEvent: MuslimEvent = {
      id: `me-${Date.now()}`,
      name: 'नया कार्यक्रम / तक़रीब',
      nameUrdu: 'نئی تقریب',
      date: data.weddingDateDisplay,
      time: 'शाम 07:00 बजे',
      location: data.venueName,
      description: 'समारोह का विस्तृत विवरण...',
      enabled: true
    };
    onChange({ ...data, events: [...data.events, newEvent] });
  };

  const handleDeleteEvent = (id: string) => {
    onChange({
      ...data,
      events: data.events.filter((e) => e.id !== id)
    });
  };

  // Gallery file upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      setUploadError(null);
      const dataUrl = await readImageFileAsDataUrl(file);
      onChange({
        ...data,
        heroImageUrl: dataUrl,
        photos: [{ id: `mphoto-${Date.now()}`, url: dataUrl, caption: 'दूल्हा व दुल्हन' }, ...data.photos]
      });
    } catch (err: any) {
      setUploadError(err.message || 'फोटो अपलोड करने में विफल');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-[#f7faf7] border-2 border-[#d4af37] rounded-3xl p-4 sm:p-7 shadow-xl card-paper-islamic text-left font-devanagari-serif text-xs">
      {/* Sub Tabs */}
      <div className="flex border-b border-[#d4af37]/40 pb-3 mb-5 gap-2 overflow-x-auto font-bold">
        <button
          type="button"
          onClick={() => setActiveSubTab('couple')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'couple'
              ? 'bg-[#064e3b] text-[#ffd700] shadow'
              : 'text-stone-700 bg-stone-100 hover:bg-emerald-50'
          }`}
        >
          <Heart className="w-3.5 h-3.5" /> दूल्हा-दुल्हन व खानदान
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('events')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'events'
              ? 'bg-[#064e3b] text-[#ffd700] shadow'
              : 'text-stone-700 bg-stone-100 hover:bg-emerald-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> रसूमात ({data.events.filter(e => e.enabled).length} चुनी हुई)
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('texts')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'texts'
              ? 'bg-[#064e3b] text-[#ffd700] shadow'
              : 'text-stone-700 bg-stone-100 hover:bg-emerald-50'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" /> आयत, भाषा व संदेश
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('venue')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'venue'
              ? 'bg-[#064e3b] text-[#ffd700] shadow'
              : 'text-stone-700 bg-stone-100 hover:bg-emerald-50'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" /> तारीख व मुक़ाम (वेन्यू)
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('theme')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'theme'
              ? 'bg-[#064e3b] text-[#ffd700] shadow'
              : 'text-stone-700 bg-stone-100 hover:bg-emerald-50'
          }`}
        >
          <Palette className="w-3.5 h-3.5" /> थीम व फोटो
        </button>
      </div>

      {/* Tab 1: Groom, Bride & Family Details */}
      {activeSubTab === 'couple' && (
        <div className="space-y-4">
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-950 font-bold flex items-center gap-2">
            <CrescentStarIcon size={18} />
            <span>दूल्हा व दुल्हन पक्ष का विवरण दर्ज करें:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-white border border-[#d4af37]/60 rounded-2xl space-y-2">
              <span className="font-devanagari-royal font-bold text-sm text-[#064e3b] block">दूल्हा (Groom)</span>
              <div>
                <label className="block font-bold text-stone-700 mb-1">दूल्हे का नाम *</label>
                <input
                  type="text"
                  required
                  value={data.groomName}
                  onChange={(e) => handleFieldChange('groomName', e.target.value)}
                  placeholder="उदा. मोहम्मद ज़ैद"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">वालिदैन (माता-पिता) *</label>
                <input
                  type="text"
                  required
                  value={data.groomParents}
                  onChange={(e) => handleFieldChange('groomParents', e.target.value)}
                  placeholder="उदा. फ़रज़ंद-ए-अज़ीज़: मोहतरमा परवीन एवं जनाब मोहम्मद रफ़ीक़ ख़ान"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">ख़ानदान / शहर</label>
                <input
                  type="text"
                  value={data.groomFamily}
                  onChange={(e) => handleFieldChange('groomFamily', e.target.value)}
                  placeholder="उदा. ख़ानदान: ख़ान व पठान परिवार (लखनऊ)"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>
            </div>

            <div className="p-3.5 bg-white border border-[#d4af37]/60 rounded-2xl space-y-2">
              <span className="font-devanagari-royal font-bold text-sm text-[#064e3b] block">दुल्हन (Bride)</span>
              <div>
                <label className="block font-bold text-stone-700 mb-1">दुल्हन का नाम *</label>
                <input
                  type="text"
                  required
                  value={data.brideName}
                  onChange={(e) => handleFieldChange('brideName', e.target.value)}
                  placeholder="उदा. आयशा सिद्दीकी"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#059669]"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">वालिदैन (माता-पिता) *</label>
                <input
                  type="text"
                  required
                  value={data.brideParents}
                  onChange={(e) => handleFieldChange('brideParents', e.target.value)}
                  placeholder="उदा. दुख़्तर-ए-नेकअख्तर: मोहतरमा शबाना एवं जनाब तारिक़ सिद्दीकी"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">ख़ानदान / शहर</label>
                <input
                  type="text"
                  value={data.brideFamily}
                  onChange={(e) => handleFieldChange('brideFamily', e.target.value)}
                  placeholder="उदा. ख़ानदान: सिद्दीकी परिवार (दिल्ली)"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-800 mb-1">चश्म-ए-बराह (इंतजार में)</label>
              <input
                type="text"
                value={data.chashmeBaraah}
                onChange={(e) => handleFieldChange('chashmeBaraah', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-800 mb-1">दावतीन / मुंतज़मीन</label>
              <input
                type="text"
                value={data.daawatan}
                onChange={(e) => handleFieldChange('daawatan', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Islamic Events (निकाह, दावत-ए-वलीमा, रस्म-ए-हिना, बारात व इस्तकबाल, रुखसती) */}
      {activeSubTab === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-devanagari-royal font-bold text-sm text-[#064e3b]">
                तक़ारीब-ए-निकाह व वलीमा (Events Checkboxes)
              </h4>
              <p className="text-[11px] text-stone-600">
                कार्ड में केवल वही रस्में दिखाई देंगी जिन्हें आप यहाँ चेक (Select) करेंगे:
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddEvent}
              className="px-3 py-1.5 bg-[#064e3b] text-[#ffd700] rounded-xl font-bold flex items-center gap-1 shadow-sm hover:bg-[#022c22]"
            >
              <Plus className="w-3.5 h-3.5" /> नया इवेंट
            </button>
          </div>

          <div className="space-y-3">
            {data.events.map((evt) => (
              <div
                key={evt.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  evt.enabled
                    ? 'bg-[#f0fdf4] border-[#d4af37] shadow-sm'
                    : 'bg-stone-100 border-stone-300 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={evt.enabled}
                      onChange={() => handleToggleEvent(evt.id)}
                      className="w-4 h-4 text-[#064e3b] rounded accent-[#064e3b]"
                    />
                    <span className="font-devanagari-royal font-bold text-sm text-[#064e3b]">
                      {evt.name} {evt.nameUrdu ? `(${evt.nameUrdu})` : ''} {evt.enabled ? '(शामिल है)' : '(छोड़ा गया)'}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleDeleteEvent(evt.id)}
                    className="text-rose-600 p-1 hover:bg-rose-50 rounded-lg"
                    title="हटाएँ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {evt.enabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    <div>
                      <label className="block text-[10px] text-stone-500 font-bold">इवेंट का नाम (हिंदी)</label>
                      <input
                        type="text"
                        value={evt.name}
                        onChange={(e) => handleUpdateEvent(evt.id, 'name', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-[#d4af37]/60 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500 font-bold">इवेंट का नाम (उर्दू - वैकल्पिक)</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={evt.nameUrdu || ''}
                        onChange={(e) => handleUpdateEvent(evt.id, 'nameUrdu', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-[#d4af37]/60 rounded-lg text-xs font-urdu"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500 font-bold">तारीख व दिन</label>
                      <input
                        type="text"
                        value={evt.date}
                        onChange={(e) => handleUpdateEvent(evt.id, 'date', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-[#d4af37]/60 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500 font-bold">वक्त (समय)</label>
                      <input
                        type="text"
                        value={evt.time}
                        onChange={(e) => handleUpdateEvent(evt.id, 'time', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-[#d4af37]/60 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Religious Wording & Languages (Bismillah, Ayat, Hindi/Urdu) */}
      {activeSubTab === 'texts' && (
        <div className="space-y-4">
          <div>
            <label className="block font-bold text-stone-800 mb-1">कार्ड की भाषा (Language Mode)</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleFieldChange('languageMode', 'hindi')}
                className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                  data.languageMode === 'hindi'
                    ? 'bg-[#064e3b] text-white border-[#064e3b]'
                    : 'bg-white text-stone-700 border-stone-300'
                }`}
              >
                हिंदी (Hindi)
              </button>
              <button
                type="button"
                onClick={() => handleFieldChange('languageMode', 'urdu')}
                className={`py-2 px-3 rounded-xl font-bold border font-urdu transition-all ${
                  data.languageMode === 'urdu'
                    ? 'bg-[#064e3b] text-white border-[#064e3b]'
                    : 'bg-white text-stone-700 border-stone-300'
                }`}
              >
                اُردُو (Urdu - RTL)
              </button>
              <button
                type="button"
                onClick={() => handleFieldChange('languageMode', 'english')}
                className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                  data.languageMode === 'english'
                    ? 'bg-[#064e3b] text-white border-[#064e3b]'
                    : 'bg-white text-stone-700 border-stone-300'
                }`}
              >
                English
              </button>
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-800 mb-1">बिस्मिल्लाह टेक्स्ट (अरबी / उर्दू)</label>
            <input
              type="text"
              dir="rtl"
              value={data.bismillahText}
              onChange={(e) => handleFieldChange('bismillahText', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-urdu text-base text-[#064e3b]"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-800 mb-1">कुरआन-ए-पाक की आयत</label>
            <textarea
              rows={2}
              dir="rtl"
              value={data.quranAyat}
              onChange={(e) => handleFieldChange('quranAyat', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-urdu text-base text-[#064e3b]"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-800 mb-1">आयत का अनुवाद</label>
            <textarea
              rows={2}
              value={data.quranAyatTranslation}
              onChange={(e) => handleFieldChange('quranAyatTranslation', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-800 mb-1">दावतनामा मुख्य संदेश</label>
            <textarea
              rows={3}
              value={data.invitationMainText}
              onChange={(e) => handleFieldChange('invitationMainText', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs leading-relaxed"
            />
          </div>
        </div>
      )}

      {/* Tab 4: Date & Venue */}
      {activeSubTab === 'venue' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-800 mb-1">निकाह तारीख व समय (ISO) *</label>
              <input
                type="datetime-local"
                required
                value={data.weddingDateIso.slice(0, 16)}
                onChange={(e) => handleFieldChange('weddingDateIso', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-800 mb-1">कार्ड में दिखने वाली तारीख (हिजरी सहित) *</label>
              <input
                type="text"
                required
                value={data.weddingDateDisplay}
                onChange={(e) => handleFieldChange('weddingDateDisplay', e.target.value)}
                placeholder="उदा. रविवार, 11 अप्रैल 2027 (29 शव्वाल 1448 हिजरी)"
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-800 mb-1">निकाह व वलीमा का वक्त *</label>
            <input
              type="text"
              required
              value={data.nikahTimeDisplay}
              onChange={(e) => handleFieldChange('nikahTimeDisplay', e.target.value)}
              placeholder="उदा. निकाह: शाम 07:30 बजे | दावत-ए-वलीमा: रात 08:30 बजे से"
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-800 mb-1">मुक़ाम-ए-तक़रीब (वेन्यू का नाम) *</label>
            <input
              type="text"
              required
              value={data.venueName}
              onChange={(e) => handleFieldChange('venueName', e.target.value)}
              placeholder="उदा. शाही नूर-महल बैंक्वेट्स"
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-800 mb-1">वेन्यू का पूरा पता *</label>
            <input
              type="text"
              required
              value={data.venueAddress}
              onChange={(e) => handleFieldChange('venueAddress', e.target.value)}
              placeholder="उदा. हज़रतगंज मेन रोड, लखनऊ, उत्तर प्रदेश"
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-800 mb-1">Google Maps लोकेशन लिंक *</label>
            <input
              type="url"
              required
              value={data.googleMapsUrl}
              onChange={(e) => handleFieldChange('googleMapsUrl', e.target.value)}
              placeholder="https://maps.google.com/?q=..."
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300"
            />
          </div>
        </div>
      )}

      {/* Tab 5: Theme & Photos */}
      {activeSubTab === 'theme' && (
        <div className="space-y-4">
          {/* Butterfly Animation Controls */}
          <div className="p-3.5 bg-white border border-[#d4af37]/60 rounded-2xl space-y-3">
            <span className="font-bold text-stone-800 block text-xs sm:text-sm flex items-center gap-1.5">
              🦋 तितली एनीमेशन नियंत्रण (Butterfly Animation)
            </span>
            <div className="flex items-center justify-between text-xs bg-emerald-50 p-2.5 rounded-xl border border-[#d4af37]/40">
              <span className="font-medium text-stone-800">पेज तितली एनीमेशन (Page Butterflies):</span>
              <button
                type="button"
                onClick={() => setPageButterflyEnabled?.(!pageButterflyEnabled)}
                className={`px-3 py-1 rounded-lg font-bold transition-all text-xs ${
                  pageButterflyEnabled ? 'bg-emerald-700 text-white shadow' : 'bg-stone-300 text-stone-700'
                }`}
              >
                {pageButterflyEnabled ? 'चालू (ON)' : 'बंद (OFF)'}
              </button>
            </div>
            <div className="flex items-center justify-between text-xs bg-emerald-50 p-2.5 rounded-xl border border-[#d4af37]/40">
              <span className="font-medium text-stone-800">कार्ड तितली एनीमेशन (Card Butterflies):</span>
              <button
                type="button"
                onClick={() => setCardButterflyEnabled?.(!cardButterflyEnabled)}
                className={`px-3 py-1 rounded-lg font-bold transition-all text-xs ${
                  cardButterflyEnabled ? 'bg-emerald-700 text-white shadow' : 'bg-stone-300 text-stone-700'
                }`}
              >
                {cardButterflyEnabled ? 'चालू (ON)' : 'बंद (OFF)'}
              </button>
            </div>
          </div>

          <div className="p-3 bg-white border border-[#d4af37]/60 rounded-2xl space-y-2">
            <span className="font-bold text-stone-800 block">फ़ोन गैलरी से फ़ोटो अपलोड करें:</span>
            {uploadError && (
              <div className="p-2 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs font-bold">
                {uploadError}
              </div>
            )}
            <label className="flex items-center justify-center gap-2 px-4 py-3 bg-[#f0fdf4] border-2 border-dashed border-[#059669] rounded-xl cursor-pointer hover:bg-emerald-100/50 transition-all">
              <Upload className="w-4 h-4 text-[#064e3b]" />
              <span className="font-bold text-stone-700">
                {isUploading ? 'फ़ोटो लोड हो रही है...' : 'फ़ोन / कंप्यूटर की गैलरी से फ़ोटो चुनें'}
              </span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
            {data.heroImageUrl && (
              <div className="flex items-center gap-3 pt-2">
                <img src={data.heroImageUrl} alt="Preview" className="w-16 h-16 object-cover rounded-xl border-2 border-[#d4af37]" />
                <span className="text-xs text-stone-600">वर्तमान मुख्य फ़ोटो चयनित है</span>
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold text-stone-800 mb-1">थीम चयन (10 Beautiful Themes)</label>
            <select
              value={data.theme}
              onChange={(e) => handleFieldChange('theme', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-bold"
            >
              <option value="emerald_royal">एमराल्ड रॉयल (Emerald Royal - Deep Green)</option>
              <option value="morpankh_utsav">मोरपंख उत्सव (Morpankh Utsav - Peacock Blue)</option>
              <option value="shubh_swarnim">शुभ स्वर्णिम (Shubh Swarnim - Ivory & Gold)</option>
              <option value="royal_rajwada">रॉयल राजवाड़ा (Royal Rajwada - Maroon)</option>
              <option value="modern_pastel">मॉडर्न पेस्टल (Modern Pastel - Peach & Lavender)</option>
              <option value="ganesh_mangalam">गणेश मंगलम (Ganesh Mangalam - Red & Gold)</option>
              <option value="ganesh_ashirwad">गणेश आशीर्वाद (Ganesh Ashirwad - Cream & Gold)</option>
              <option value="radha_krishna">राधा-कृष्ण प्रेम (Radha Krishna - Pink & Gold)</option>
              <option value="gulabi_pushp">गुलाबी पुष्प (Gulabi Pushp - Rose Pink)</option>
              <option value="mandap_utsav">मंडप उत्सव (Mandap Utsav - Saffron & Red)</option>
            </select>
          </div>

          {/* Dedicated Custom Music Player */}
          <div className="pt-2">
            <CustomMusicPlayer
              category="muslim_wedding"
              musicSettings={data.musicSettings}
              legacyMusicUrl={data.musicUrl}
              onChange={(ms) => {
                onChange({
                  ...data,
                  musicSettings: ms,
                  musicUrl: ms.mode === 'none' ? undefined : (ms.audioUrl || data.musicUrl)
                });
              }}
            />
          </div>
        </div>
      )}

      {/* Generate Invitation Button */}
      <div className="mt-6 pt-4 border-t border-[#d4af37]/40 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onGenerate}
          className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-[#064e3b] via-[#047857] to-[#065f46] text-[#ffd700] font-devanagari-royal font-bold text-sm uppercase tracking-wider rounded-2xl shadow-xl hover:from-[#022c22] hover:to-[#064e3b] transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-[#ffd700]" />
          <span>निकाह व वलीमा निमंत्रण पत्र तैयार करें (Generate & View)</span>
        </button>
      </div>
    </div>
  );
};
