import React, { useState } from 'react';
import { HinduWeddingData, HinduCeremony } from '../types/invitation';
import { readImageFileAsDataUrl } from '../utils/imageUpload';
import { CustomMusicPlayer } from './CustomMusicPlayer';
import { Heart, Sparkles, MapPin, Upload, Plus, Trash2, Calendar, Clock, Palette } from 'lucide-react';

import { computeCardTitle } from '../utils/normalizeInvitation';

interface HinduFormProps {
  data: HinduWeddingData;
  onChange: (updated: HinduWeddingData) => void;
  onGenerate: () => void;
  pageButterflyEnabled?: boolean;
  setPageButterflyEnabled?: (val: boolean) => void;
  cardButterflyEnabled?: boolean;
  setCardButterflyEnabled?: (val: boolean) => void;
}

export const HinduForm: React.FC<HinduFormProps> = ({
  data,
  onChange,
  onGenerate,
  pageButterflyEnabled = true,
  setPageButterflyEnabled,
  cardButterflyEnabled = true,
  setCardButterflyEnabled
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'couple' | 'ceremonies' | 'venue' | 'theme'>('couple');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFieldChange = (field: keyof HinduWeddingData, value: any) => {
    const updated = { ...data, [field]: value };
    if (field === 'groomName' || field === 'brideName') {
      updated.title = computeCardTitle(updated);
    }
    onChange(updated);
  };

  const handleToggleCeremony = (id: string) => {
    const updated = data.ceremonies.map((c) =>
      c.id === id ? { ...c, enabled: !c.enabled } : c
    );
    onChange({ ...data, ceremonies: updated });
  };

  const handleUpdateCeremony = (id: string, field: keyof HinduCeremony, value: any) => {
    const updated = data.ceremonies.map((c) =>
      c.id === id ? { ...c, [field]: value } : c
    );
    onChange({ ...data, ceremonies: updated });
  };

  const handleAddCeremony = () => {
    const newCeremony: HinduCeremony = {
      id: `c-${Date.now()}`,
      name: 'नई रस्म / कार्यक्रम',
      subTitle: 'कार्यक्रम विवरण',
      date: data.weddingDateDisplay,
      time: 'सायं 05:00 बजे',
      location: data.venueName,
      description: 'समारोह का विस्तृत विवरण...',
      dressCode: 'पारंपरिक परिधान',
      icon: 'sparkles',
      enabled: true
    };
    onChange({ ...data, ceremonies: [...data.ceremonies, newCeremony] });
  };

  const handleDeleteCeremony = (id: string) => {
    onChange({
      ...data,
      ceremonies: data.ceremonies.filter((c) => c.id !== id)
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
        photos: [{ id: `photo-${Date.now()}`, url: dataUrl, caption: 'वर-वधू' }, ...data.photos]
      });
    } catch (err: any) {
      setUploadError(err.message || 'फोटो अपलोड करने में विफल');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-[#fffaf0] border-2 border-[#d4af37] rounded-3xl p-4 sm:p-7 shadow-xl card-paper-traditional text-left font-devanagari-serif text-xs">
      {/* Sub Tabs */}
      <div className="flex border-b border-[#d4af37]/40 pb-3 mb-5 gap-2 overflow-x-auto font-bold">
        <button
          type="button"
          onClick={() => setActiveSubTab('couple')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'couple'
              ? 'bg-[#87091f] text-[#ffd700] shadow'
              : 'text-stone-700 bg-stone-100 hover:bg-[#f3e5ab]/30'
          }`}
        >
          <Heart className="w-3.5 h-3.5" /> वर-वधू व परिवार
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('ceremonies')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'ceremonies'
              ? 'bg-[#87091f] text-[#ffd700] shadow'
              : 'text-stone-700 bg-stone-100 hover:bg-[#f3e5ab]/30'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" /> रस्में ({data.ceremonies.filter(c => c.enabled).length} चुनी हुई)
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('venue')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'venue'
              ? 'bg-[#87091f] text-[#ffd700] shadow'
              : 'text-stone-700 bg-stone-100 hover:bg-[#f3e5ab]/30'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" /> तारीख, मुहूर्त व स्थल
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('theme')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'theme'
              ? 'bg-[#87091f] text-[#ffd700] shadow'
              : 'text-stone-700 bg-stone-100 hover:bg-[#f3e5ab]/30'
          }`}
        >
          <Palette className="w-3.5 h-3.5" /> थीम व फोटो
        </button>
      </div>

      {/* Tab 1: Couple & Family Details */}
      {activeSubTab === 'couple' && (
        <div className="space-y-4">
          <div className="p-3 bg-[#fdf6e7] border border-[#d4af37] rounded-xl text-stone-800">
            <strong>वर एवं वधू पक्ष का विवरण भरें:</strong>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-white border border-[#d4af37]/60 rounded-2xl space-y-2">
              <span className="font-devanagari-royal font-bold text-sm text-[#87091f] block">वर पक्ष (Groom)</span>
              <div>
                <label className="block font-bold text-stone-700 mb-1">वर का नाम *</label>
                <input
                  type="text"
                  required
                  value={data.groomName}
                  onChange={(e) => handleFieldChange('groomName', e.target.value)}
                  placeholder="उदा. चि. कबीर"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#87091f]"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">वर के माता-पिता *</label>
                <input
                  type="text"
                  required
                  value={data.groomParents}
                  onChange={(e) => handleFieldChange('groomParents', e.target.value)}
                  placeholder="उदा. सुपुत्र: श्रीमती सरोज एवं श्री राजेंद्र शर्मा"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">वर के दादा-दादी</label>
                <input
                  type="text"
                  value={data.groomGrandparents || ''}
                  onChange={(e) => handleFieldChange('groomGrandparents', e.target.value)}
                  placeholder="उदा. पौत्र: श्रीमती एवं स्व. श्री रामगोपाल शर्मा"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>
            </div>

            <div className="p-3.5 bg-white border border-[#d4af37]/60 rounded-2xl space-y-2">
              <span className="font-devanagari-royal font-bold text-sm text-[#87091f] block">वधू पक्ष (Bride)</span>
              <div>
                <label className="block font-bold text-stone-700 mb-1">वधू का नाम *</label>
                <input
                  type="text"
                  required
                  value={data.brideName}
                  onChange={(e) => handleFieldChange('brideName', e.target.value)}
                  placeholder="उदा. आयु. आर्या"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#87091f]"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">वधू के माता-पिता *</label>
                <input
                  type="text"
                  required
                  value={data.brideParents}
                  onChange={(e) => handleFieldChange('brideParents', e.target.value)}
                  placeholder="उदा. सुपुत्री: श्रीमती सुनीता एवं श्री विजय कपूर"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>
              <div>
                <label className="block font-bold text-stone-700 mb-1">वधू के दादा-दादी</label>
                <input
                  type="text"
                  value={data.brideGrandparents || ''}
                  onChange={(e) => handleFieldChange('brideGrandparents', e.target.value)}
                  placeholder="उदा. पौत्री: श्रीमती एवं स्व. श्री दयाकिशन कपूर"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-800 mb-1">स्नेहपूर्ण निमंत्रण संदेश</label>
            <textarea
              rows={3}
              value={data.invitationMainText}
              onChange={(e) => handleFieldChange('invitationMainText', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-800 mb-1">दर्शनाभिलाषी</label>
              <input
                type="text"
                value={data.darshanabhilashi}
                onChange={(e) => handleFieldChange('darshanabhilashi', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-800 mb-1">स्वागताकांक्षी</label>
              <input
                type="text"
                value={data.swagatakankshi}
                onChange={(e) => handleFieldChange('swagatakankshi', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block font-bold text-stone-800 mb-1">बाल मनुहार</label>
              <input
                type="text"
                value={data.balManuhar}
                onChange={(e) => handleFieldChange('balManuhar', e.target.value)}
                placeholder="उदा. मेरी चाचू की शादी में जलूल-जलूल आना!"
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-800 mb-1">विनीत (प्रेषक)</label>
              <input
                type="text"
                value={data.vinit}
                onChange={(e) => handleFieldChange('vinit', e.target.value)}
                placeholder="उदा. समस्त शर्मा परिवार"
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Ceremonies Checkboxes (हल्दी, मेहंदी, बारात, वरमाला, विवाह संस्कार, सात फेरे, विदाई) */}
      {activeSubTab === 'ceremonies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-devanagari-royal font-bold text-sm text-[#87091f]">
                विवाह की रस्में (Ceremonies Checkboxes)
              </h4>
              <p className="text-[11px] text-stone-600">
                कार्ड में केवल वही रस्में दिखाई देंगी जिन्हें आप यहाँ चेक (Select) करेंगे:
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddCeremony}
              className="px-3 py-1.5 bg-[#87091f] text-[#ffd700] rounded-xl font-bold flex items-center gap-1 shadow-sm hover:bg-[#630514]"
            >
              <Plus className="w-3.5 h-3.5" /> नई रस्म
            </button>
          </div>

          <div className="space-y-3">
            {data.ceremonies.map((c) => (
              <div
                key={c.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  c.enabled
                    ? 'bg-[#fdf8ef] border-[#d4af37] shadow-sm'
                    : 'bg-stone-100 border-stone-300 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={c.enabled}
                      onChange={() => handleToggleCeremony(c.id)}
                      className="w-4 h-4 text-[#87091f] rounded accent-[#87091f]"
                    />
                    <span className="font-devanagari-royal font-bold text-sm text-[#7a0c1e]">
                      {c.name} {c.enabled ? '(शामिल है)' : '(छोड़ा गया)'}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleDeleteCeremony(c.id)}
                    className="text-rose-600 p-1 hover:bg-rose-50 rounded-lg"
                    title="हटाएँ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {c.enabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    <div>
                      <label className="block text-[10px] text-stone-500 font-bold">रस्म का नाम</label>
                      <input
                        type="text"
                        value={c.name}
                        onChange={(e) => handleUpdateCeremony(c.id, 'name', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-[#d4af37]/60 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500 font-bold">तारीख व दिन</label>
                      <input
                        type="text"
                        value={c.date}
                        onChange={(e) => handleUpdateCeremony(c.id, 'date', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-[#d4af37]/60 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500 font-bold">शुभ समय</label>
                      <input
                        type="text"
                        value={c.time}
                        onChange={(e) => handleUpdateCeremony(c.id, 'time', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-[#d4af37]/60 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500 font-bold">स्थान / वेन्यू</label>
                      <input
                        type="text"
                        value={c.location}
                        onChange={(e) => handleUpdateCeremony(c.id, 'location', e.target.value)}
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

      {/* Tab 3: Date, Muhurat & Venue */}
      {activeSubTab === 'venue' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-800 mb-1">विवाह तारीख व समय (ISO) *</label>
              <input
                type="datetime-local"
                required
                value={data.weddingDateIso.slice(0, 16)}
                onChange={(e) => handleFieldChange('weddingDateIso', e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-800 mb-1">कार्ड में दिखने वाली तारीख *</label>
              <input
                type="text"
                required
                value={data.weddingDateDisplay}
                onChange={(e) => handleFieldChange('weddingDateDisplay', e.target.value)}
                placeholder="उदा. शनिवार, 20 मार्च 2027"
                className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-800 mb-1">शुभ विवाह लग्न एवं मुहूर्त *</label>
            <input
              type="text"
              required
              value={data.weddingMuhurat}
              onChange={(e) => handleFieldChange('weddingMuhurat', e.target.value)}
              placeholder="उदा. शुभ लग्न एवं पाणिग्रहण: सायं 07:15 बजे (गोधूलि वेला)"
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-800 mb-1">विवाह स्थल / वाटिका का नाम *</label>
            <input
              type="text"
              required
              value={data.venueName}
              onChange={(e) => handleFieldChange('venueName', e.target.value)}
              placeholder="उदा. राजमहल पैलेस एवं हेरिटेज वाटिका"
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-800 mb-1">विवाह स्थल का पूरा पता *</label>
            <input
              type="text"
              required
              value={data.venueAddress}
              onChange={(e) => handleFieldChange('venueAddress', e.target.value)}
              placeholder="उदा. लेक पिछोला रोड, उदयपुर, राजस्थान"
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

      {/* Tab 4: Theme, Fonts & Phone Gallery Photos */}
      {activeSubTab === 'theme' && (
        <div className="space-y-4">
          {/* Butterfly Animation Controls */}
          <div className="p-3.5 bg-white border border-[#d4af37]/60 rounded-2xl space-y-3">
            <span className="font-bold text-stone-800 block text-xs sm:text-sm flex items-center gap-1.5">
              🦋 तितली एनीमेशन नियंत्रण (Butterfly Animation)
            </span>
            <div className="flex items-center justify-between text-xs bg-[#fdf6e7] p-2.5 rounded-xl border border-[#d4af37]/40">
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
            <div className="flex items-center justify-between text-xs bg-[#fdf6e7] p-2.5 rounded-xl border border-[#d4af37]/40">
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
            <span className="font-bold text-stone-800 block">फ़ोन गैलरी से वर-वधू की फ़ोटो चुनें:</span>
            {uploadError && (
              <div className="p-2 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs font-bold">
                {uploadError}
              </div>
            )}
            <label className="flex items-center justify-center gap-2 px-4 py-3 bg-[#fdf6e7] border-2 border-dashed border-[#d4af37] rounded-xl cursor-pointer hover:bg-[#fbf0da] transition-all">
              <Upload className="w-4 h-4 text-[#87091f]" />
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
            <label className="block font-bold text-stone-800 mb-1">कार्ड कलर थीम (10 Beautiful Themes)</label>
            <select
              value={data.theme}
              onChange={(e) => handleFieldChange('theme', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-bold"
            >
              <option value="ganesh_mangalam">गणेश मंगलम (Ganesh Mangalam - Red & Gold)</option>
              <option value="ganesh_ashirwad">गणेश आशीर्वाद (Ganesh Ashirwad - Cream & Gold)</option>
              <option value="royal_rajwada">रॉयल राजवाड़ा (Royal Rajwada - Maroon)</option>
              <option value="radha_krishna">राधा-कृष्ण प्रेम (Radha Krishna - Pink & Gold)</option>
              <option value="shubh_swarnim">शुभ स्वर्णिम (Shubh Swarnim - Ivory & Gold)</option>
              <option value="morpankh_utsav">मोरपंख उत्सव (Morpankh Utsav - Peacock Blue)</option>
              <option value="gulabi_pushp">गुलाबी पुष्प (Gulabi Pushp - Rose Pink)</option>
              <option value="emerald_royal">एमराल्ड रॉयल (Emerald Royal - Deep Green)</option>
              <option value="mandap_utsav">मंडप उत्सव (Mandap Utsav - Saffron & Red)</option>
              <option value="modern_pastel">मॉडर्न पेस्टल (Modern Pastel - Peach & Lavender)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-stone-800 mb-1">फ़ॉन्ट स्टाइल</label>
            <select
              value={data.fontFamily}
              onChange={(e) => handleFieldChange('fontFamily', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300"
            >
              <option value="royal">शाही देवनागरी (Rozha One & Serif)</option>
              <option value="classic">पारंपरिक देवनागरी (Yatra One)</option>
              <option value="serif">शुद्ध वैदिक सेरिफ़ (Noto Serif Devanagari)</option>
            </select>
          </div>

          {/* Dedicated Custom Music Player */}
          <div className="pt-2">
            <CustomMusicPlayer
              category="hindu_wedding"
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
          onClick={() => {
            console.log('[DIAGNOSTIC 1: Before Generate Hindu]', { envelopeStyle: data.envelopeStyle });
            onGenerate();
          }}
          className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-[#87091f] via-[#b22222] to-[#7a0c1e] text-[#ffd700] font-devanagari-royal font-bold text-sm uppercase tracking-wider rounded-2xl shadow-xl hover:from-[#630514] hover:to-[#54030f] transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-[#ffd700]" />
          <span>हिंदू विवाह निमंत्रण पत्र तैयार करें (Generate & View)</span>
        </button>
      </div>
    </div>
  );
};
