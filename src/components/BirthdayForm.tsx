import React, { useState } from 'react';
import { BirthdayData, BirthdayActivity } from '../types/invitation';
import { readImageFileAsDataUrl } from '../utils/imageUpload';
import { CustomMusicPlayer } from './CustomMusicPlayer';
import { Sparkles, MapPin, Upload, Plus, Trash2, Palette, Gift, User, Cake } from 'lucide-react';
import { BirthdayCakeIcon } from './BirthdayMotifs';

import { computeCardTitle } from '../utils/normalizeInvitation';

interface BirthdayFormProps {
  data: BirthdayData;
  onChange: (updated: BirthdayData) => void;
  onGenerate: () => void;
  pageButterflyEnabled?: boolean;
  setPageButterflyEnabled?: (val: boolean) => void;
  cardButterflyEnabled?: boolean;
  setCardButterflyEnabled?: (val: boolean) => void;
}

export const BirthdayForm: React.FC<BirthdayFormProps> = ({
  data,
  onChange,
  onGenerate,
  pageButterflyEnabled = true,
  setPageButterflyEnabled,
  cardButterflyEnabled = true,
  setCardButterflyEnabled
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'person' | 'activities' | 'venue' | 'theme'>('person');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFieldChange = (field: keyof BirthdayData, value: any) => {
    const updated = { ...data, [field]: value };
    if (field === 'celebrantName') {
      updated.title = computeCardTitle(updated);
    }
    onChange(updated);
  };

  const handleToggleActivity = (id: string) => {
    const updated = data.activities.map((a) =>
      a.id === id ? { ...a, enabled: !a.enabled } : a
    );
    onChange({ ...data, activities: updated });
  };

  const handleUpdateActivity = (id: string, field: keyof BirthdayActivity, value: any) => {
    const updated = data.activities.map((a) =>
      a.id === id ? { ...a, [field]: value } : a
    );
    onChange({ ...data, activities: updated });
  };

  const handleAddActivity = () => {
    const newAct: BirthdayActivity = {
      id: `ba-${Date.now()}`,
      title: 'नई एक्टिविटी / गेम',
      time: 'शाम 06:00 बजे',
      description: 'गेम्स व मस्ती का विवरण...',
      enabled: true
    };
    onChange({ ...data, activities: [...data.activities, newAct] });
  };

  const handleDeleteActivity = (id: string) => {
    onChange({
      ...data,
      activities: data.activities.filter((a) => a.id !== id)
    });
  };

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
        photos: [{ id: `bphoto-${Date.now()}`, url: dataUrl, caption: 'बर्थडे फ़ोटो' }, ...data.photos]
      });
    } catch (err: any) {
      setUploadError(err.message || 'फोटो अपलोड करने में विफल');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-[#fff9f5] border-2 border-pink-400 rounded-3xl p-4 sm:p-7 shadow-xl card-paper-birthday text-left font-birthday text-xs">
      {/* Sub Tabs */}
      <div className="flex border-b border-pink-200 pb-3 mb-5 gap-2 overflow-x-auto font-bold">
        <button
          type="button"
          onClick={() => setActiveSubTab('person')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'person'
              ? 'bg-[#ec4899] text-white shadow'
              : 'text-stone-700 bg-stone-100 hover:bg-pink-50'
          }`}
        >
          <User className="w-3.5 h-3.5" /> जिसका जन्मदिन है
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('activities')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'activities'
              ? 'bg-[#ec4899] text-white shadow'
              : 'text-stone-700 bg-stone-100 hover:bg-pink-50'
          }`}
        >
          <Cake className="w-3.5 h-3.5" /> पार्टी कार्यक्रम ({data.activities.filter(a => a.enabled).length} चुने हुए)
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('venue')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'venue'
              ? 'bg-[#ec4899] text-white shadow'
              : 'text-stone-700 bg-stone-100 hover:bg-pink-50'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" /> तारीख व पार्टी वेन्यू
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('theme')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap ${
            activeSubTab === 'theme'
              ? 'bg-[#ec4899] text-white shadow'
              : 'text-stone-700 bg-stone-100 hover:bg-pink-50'
          }`}
        >
          <Palette className="w-3.5 h-3.5" /> थीम व गैलरी फोटो
        </button>
      </div>

      {/* Tab 1: Person Details */}
      {activeSubTab === 'person' && (
        <div className="space-y-4">
          <div className="p-3 bg-pink-50 border border-pink-200 rounded-xl text-pink-900 font-bold flex items-center gap-2">
            <BirthdayCakeIcon size={20} />
            <span>जिसका जन्मदिन है, उनका विवरण भरें:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">नाम (Celebrant Name) *</label>
              <input
                type="text"
                required
                value={data.celebrantName}
                onChange={(e) => handleFieldChange('celebrantName', e.target.value)}
                placeholder="उदा. आरव शर्मा / रिया / रोहित"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-pink-500 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">उम्र / माइलस्टोन (वैकल्पिक)</label>
              <input
                type="text"
                value={data.age || ''}
                onChange={(e) => handleFieldChange('age', e.target.value)}
                placeholder="उदा. 1st Birthday / 5वां जन्मदिन / 18वां / 25वां / 50वां"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">प्यारी सी टैगलाइन / बायो</label>
            <input
              type="text"
              value={data.celebrantBio || ''}
              onChange={(e) => handleFieldChange('celebrantBio', e.target.value)}
              placeholder="उदा. हमारा नन्हा राजकुमार अब 5 साल का होने जा रहा है!"
              className="w-full px-3 py-2 rounded-xl border border-stone-300"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">निमंत्रण संदेश</label>
            <textarea
              rows={3}
              value={data.invitationMainText}
              onChange={(e) => handleFieldChange('invitationMainText', e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 font-devanagari-serif leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">पार्टी होस्ट्स (माता-पिता / आयोजक)</label>
              <input
                type="text"
                value={data.hostsName}
                onChange={(e) => handleFieldChange('hostsName', e.target.value)}
                placeholder="उदा. नेहा एवं रोहित शर्मा (माता-पिता)"
                className="w-full px-3 py-2 rounded-xl border border-stone-300"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">RSVP संपर्क नंबर</label>
              <input
                type="text"
                value={data.rsvpContact}
                onChange={(e) => handleFieldChange('rsvpContact', e.target.value)}
                placeholder="उदा. 98765 XXXXX / 98123 XXXXX"
                className="w-full px-3 py-2 rounded-xl border border-stone-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Party Activities Checkboxes */}
      {activeSubTab === 'activities' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-bold text-sm text-[#db2777]">
                पार्टी कार्यक्रम व गतिविधियां (Activities Checkboxes)
              </h4>
              <p className="text-[11px] text-stone-600">
                कार्ड में केवल वही कार्यक्रम दिखेंगे जिन्हें आप यहाँ चेक (Select) करेंगे:
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddActivity}
              className="px-3 py-1.5 bg-pink-600 text-white rounded-xl font-bold flex items-center gap-1 shadow-sm hover:bg-pink-700"
            >
              <Plus className="w-3.5 h-3.5" /> एक्टिविटी जोड़ें
            </button>
          </div>

          <div className="space-y-3">
            {data.activities.map((act) => (
              <div
                key={act.id}
                className={`p-3.5 rounded-2xl border transition-all ${
                  act.enabled
                    ? 'bg-gradient-to-r from-pink-50 to-orange-50 border-pink-300 shadow-sm'
                    : 'bg-stone-100 border-stone-300 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={act.enabled}
                      onChange={() => handleToggleActivity(act.id)}
                      className="w-4 h-4 text-pink-600 rounded accent-pink-600"
                    />
                    <span className="font-bold text-sm text-pink-900">
                      {act.title} {act.enabled ? '(शामिल है)' : '(छोड़ा गया)'}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleDeleteActivity(act.id)}
                    className="text-rose-600 p-1 hover:bg-rose-50 rounded-lg"
                    title="हटाएँ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {act.enabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                    <div>
                      <label className="block text-[10px] text-stone-500 font-bold">कार्यक्रम का शीर्षक</label>
                      <input
                        type="text"
                        value={act.title}
                        onChange={(e) => handleUpdateActivity(act.id, 'title', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-pink-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-stone-500 font-bold">समय</label>
                      <input
                        type="text"
                        value={act.time}
                        onChange={(e) => handleUpdateActivity(act.id, 'time', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-pink-300 rounded-lg text-xs"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-stone-500 font-bold">विवरण</label>
                      <input
                        type="text"
                        value={act.description}
                        onChange={(e) => handleUpdateActivity(act.id, 'description', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-pink-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Venue & Date */}
      {activeSubTab === 'venue' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">पार्टी तारीख व समय (ISO) *</label>
              <input
                type="datetime-local"
                required
                value={data.partyDateIso.slice(0, 16)}
                onChange={(e) => handleFieldChange('partyDateIso', e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold"
              />
            </div>
            <div>
              <label className="block font-bold text-stone-700 mb-1">कार्ड में दिखने वाली तारीख *</label>
              <input
                type="text"
                required
                value={data.partyDateDisplay}
                onChange={(e) => handleFieldChange('partyDateDisplay', e.target.value)}
                placeholder="उदा. शनिवार, 15 मई 2027"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">पार्टी का समय *</label>
            <input
              type="text"
              required
              value={data.partyTimeDisplay}
              onChange={(e) => handleFieldChange('partyTimeDisplay', e.target.value)}
              placeholder="उदा. शाम 05:30 बजे से रात 09:30 बजे तक"
              className="w-full px-3 py-2 rounded-xl border border-stone-300"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">पार्टी वेन्यू का नाम *</label>
            <input
              type="text"
              required
              value={data.venueName}
              onChange={(e) => handleFieldChange('venueName', e.target.value)}
              placeholder="उदा. वंडरलैंड किड्स प्ले ज़ोन एवं पार्टी क्लब"
              className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">वेन्यू का पूरा पता *</label>
            <input
              type="text"
              required
              value={data.venueAddress}
              onChange={(e) => handleFieldChange('venueAddress', e.target.value)}
              placeholder="उदा. प्लॉट 42, पार्क स्ट्रीट, नई दिल्ली"
              className="w-full px-3 py-2 rounded-xl border border-stone-300"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">पार्टी ड्रेस कोड (वैकल्पिक)</label>
            <input
              type="text"
              value={data.dressCode || ''}
              onChange={(e) => handleFieldChange('dressCode', e.target.value)}
              placeholder="उदा. सुपरहीरो / फैंसी ड्रेस / कलरफुल पार्टी वेयर"
              className="w-full px-3 py-2 rounded-xl border border-stone-300"
            />
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">Google Maps लोकेशन लिंक *</label>
            <input
              type="url"
              required
              value={data.googleMapsUrl}
              onChange={(e) => handleFieldChange('googleMapsUrl', e.target.value)}
              placeholder="https://maps.google.com/?q=..."
              className="w-full px-3 py-2 rounded-xl border border-stone-300"
            />
          </div>
        </div>
      )}

      {/* Tab 4: Theme & Gallery Photo */}
      {activeSubTab === 'theme' && (
        <div className="space-y-4">
          {/* Butterfly Animation Controls */}
          <div className="p-3.5 bg-white border border-pink-300 rounded-2xl space-y-3">
            <span className="font-bold text-stone-800 block text-xs sm:text-sm flex items-center gap-1.5">
              🦋 तितली एनीमेशन नियंत्रण (Butterfly Animation)
            </span>
            <div className="flex items-center justify-between text-xs bg-pink-50 p-2.5 rounded-xl border border-pink-200">
              <span className="font-medium text-stone-800">पेज तितली एनीमेशन (Page Butterflies):</span>
              <button
                type="button"
                onClick={() => setPageButterflyEnabled?.(!pageButterflyEnabled)}
                className={`px-3 py-1 rounded-lg font-bold transition-all text-xs ${
                  pageButterflyEnabled ? 'bg-pink-600 text-white shadow' : 'bg-stone-300 text-stone-700'
                }`}
              >
                {pageButterflyEnabled ? 'चालू (ON)' : 'बंद (OFF)'}
              </button>
            </div>
            <div className="flex items-center justify-between text-xs bg-pink-50 p-2.5 rounded-xl border border-pink-200">
              <span className="font-medium text-stone-800">कार्ड तितली एनीमेशन (Card Butterflies):</span>
              <button
                type="button"
                onClick={() => setCardButterflyEnabled?.(!cardButterflyEnabled)}
                className={`px-3 py-1 rounded-lg font-bold transition-all text-xs ${
                  cardButterflyEnabled ? 'bg-pink-600 text-white shadow' : 'bg-stone-300 text-stone-700'
                }`}
              >
                {cardButterflyEnabled ? 'चालू (ON)' : 'बंद (OFF)'}
              </button>
            </div>
          </div>

          <div className="p-3 bg-white border border-pink-300 rounded-2xl space-y-2">
            <span className="font-bold text-stone-800 block">फ़ोन गैलरी से बर्थडे बॉय / गर्ल की फ़ोटो चुनें:</span>
            {uploadError && (
              <div className="p-2 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs font-bold">
                {uploadError}
              </div>
            )}
            <label className="flex items-center justify-center gap-2 px-4 py-3 bg-pink-50 border-2 border-dashed border-pink-400 rounded-xl cursor-pointer hover:bg-pink-100/50 transition-all">
              <Upload className="w-4 h-4 text-pink-600" />
              <span className="font-bold text-stone-700">
                {isUploading ? 'फ़ोटो लोड हो रही है...' : 'फ़ोन / कंप्यूटर की गैलरी से फ़ोटो चुनें'}
              </span>
              <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
            </label>
            {data.heroImageUrl && (
              <div className="flex items-center gap-3 pt-2">
                <img src={data.heroImageUrl} alt="Preview" className="w-16 h-16 object-cover rounded-xl border-2 border-pink-400" />
                <span className="text-xs text-stone-600">वर्तमान मुख्य फ़ोटो चयनित है</span>
              </div>
            )}
          </div>

          <div>
            <label className="block font-bold text-stone-700 mb-1">बर्थडे पार्टी थीम (10 Beautiful Themes)</label>
            <select
              value={data.theme}
              onChange={(e) => handleFieldChange('theme', e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 font-bold"
            >
              <option value="modern_pastel">मॉडर्न पेस्टल (Modern Pastel - Peach & Lavender)</option>
              <option value="gulabi_pushp">गुलाबी पुष्प (Gulabi Pushp - Rose Pink)</option>
              <option value="radha_krishna">राधा-कृष्ण प्रेम (Radha Krishna - Pink & Gold)</option>
              <option value="royal_rajwada">रॉयल राजवाड़ा (Royal Rajwada - Maroon)</option>
              <option value="shubh_swarnim">शुभ स्वर्णिम (Shubh Swarnim - Ivory & Gold)</option>
              <option value="morpankh_utsav">मोरपंख उत्सव (Morpankh Utsav - Peacock Blue)</option>
              <option value="emerald_royal">एमराल्ड रॉयल (Emerald Royal - Deep Green)</option>
              <option value="mandap_utsav">मंडप उत्सव (Mandap Utsav - Saffron & Red)</option>
              <option value="ganesh_mangalam">गणेश मंगलम (Ganesh Mangalam - Red & Gold)</option>
              <option value="ganesh_ashirwad">गणेश आशीर्वाद (Ganesh Ashirwad - Cream & Gold)</option>
            </select>
          </div>

          {/* Dedicated Custom Music Player */}
          <div className="pt-2">
            <CustomMusicPlayer
              category="birthday"
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
      <div className="mt-6 pt-4 border-t border-pink-200 flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onGenerate}
          className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-pink-600 via-purple-600 to-sky-500 text-white font-bold text-sm uppercase tracking-wider rounded-2xl shadow-xl hover:opacity-95 transition-all flex items-center justify-center gap-2 active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>जन्मदिन निमंत्रण पत्र तैयार करें (Generate & View)</span>
        </button>
      </div>
    </div>
  );
};
