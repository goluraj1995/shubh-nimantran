import React, { useState, useEffect } from 'react';
import { CardCategory, MusicSettings } from '../types/invitation';
import { cardAudio } from '../utils/audio';
import { readAudioFile, formatAudioFileSize } from '../utils/audioUpload';
import {
  Music, Volume2, VolumeX, Play, Pause, Upload,
  Trash2, RefreshCw, AlertCircle, CheckCircle2, Sliders
} from 'lucide-react';

interface CustomMusicPlayerProps {
  category: CardCategory;
  musicSettings?: MusicSettings;
  legacyMusicUrl?: string;
  onChange: (updatedSettings: MusicSettings) => void;
  compact?: boolean;
}

export const CustomMusicPlayer: React.FC<CustomMusicPlayerProps> = ({
  category,
  musicSettings,
  legacyMusicUrl,
  onChange,
  compact = false
}) => {
  const currentSettings: MusicSettings = musicSettings || {
    mode: legacyMusicUrl ? 'custom' : 'default',
    audioUrl: legacyMusicUrl,
    volume: 0.7,
    isMuted: false
  };

  const [isPlaying, setIsPlaying] = useState<boolean>(cardAudio.isPlaying());
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync player volume with audio utility
  useEffect(() => {
    if (typeof currentSettings.volume === 'number') {
      cardAudio.setVolume(currentSettings.volume);
    }
  }, [currentSettings.volume]);

  const handlePlayToggle = () => {
    if (currentSettings.mode === 'none') {
      setErrorMessage('वर्तमान में "कोई संगीत नहीं" चुना गया है। कृपया पहले डिफ़ॉल्ट धुन या कस्टम ऑडियो चुनें।');
      setStatusMessage(null);
      return;
    }

    if (isPlaying) {
      cardAudio.pause();
      setIsPlaying(false);
    } else {
      cardAudio.play(category, currentSettings.audioUrl);
      setIsPlaying(true);
    }
  };

  const handleMuteToggle = () => {
    const newMuted = !currentSettings.isMuted;
    if (newMuted) {
      cardAudio.mute();
      setIsPlaying(false);
    } else {
      cardAudio.unmute(category, currentSettings.audioUrl);
      setIsPlaying(true);
    }
    onChange({
      ...currentSettings,
      isMuted: newMuted
    });
  };

  const handleVolumeChange = (vol: number) => {
    cardAudio.setVolume(vol);
    onChange({
      ...currentSettings,
      volume: vol
    });
  };

  const handleAudioUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Prevent concurrent uploads
    if (isUploading) return;

    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setErrorMessage(null);
      setStatusMessage(`"${file.name}" Supabase क्लाउड पर अपलोड हो रहा है... कृपया प्रतीक्षा करें`);

      // Upload to Supabase via readAudioFile() in src/utils/audioUpload.ts
      const result = await readAudioFile(file);

      // Stop previous playback
      cardAudio.pause();
      setIsPlaying(false);

      // Save Supabase public URL into musicSettings.audioUrl ONLY after upload finishes
      onChange({
        mode: 'custom',
        audioUrl: result.audioUrl,
        audioFileName: file.name,
        isStoredPermanently: result.isStoredPermanently,
        fileSizeBytes: result.fileSizeBytes,
        volume: currentSettings.volume ?? 0.7,
        isMuted: false
      });

      setStatusMessage(`ऑडियो "${file.name}" (${formatAudioFileSize(result.fileSizeBytes)}) Supabase स्टोरेज पर सुरक्षित अपलोड हो गया!`);
      setErrorMessage(null);

      // Auto-preview custom audio for user confirmation
      cardAudio.play(category, result.audioUrl);
      setIsPlaying(true);
    } catch (err: any) {
      // Clear status and show clear error message without corrupting current card state
      setStatusMessage(null);
      setErrorMessage(err?.message || 'ऑडियो अपलोड करने में विफल। कृपया पुनः प्रयास करें।');
    } finally {
      setIsUploading(false);
      // Reset input element value so the user can re-select if needed
      e.target.value = '';
    }
  };

  const handleSelectMode = (mode: 'default' | 'custom' | 'none') => {
    cardAudio.pause();
    setIsPlaying(false);
    setErrorMessage(null);

    if (mode === 'none') {
      cardAudio.mute();
    }

    onChange({
      ...currentSettings,
      mode
    });
  };

  const handleRemoveCustomAudio = () => {
    cardAudio.pause();
    setIsPlaying(false);
    setErrorMessage(null);

    onChange({
      mode: 'default',
      audioUrl: undefined,
      audioFileName: undefined,
      isStoredPermanently: true,
      volume: currentSettings.volume ?? 0.7,
      isMuted: false
    });
    setStatusMessage('कस्टम ऑडियो हटा दिया गया। डिफ़ॉल्ट धुन बहाल की गई।');
  };

  const getDefaultMelodyName = () => {
    switch (category) {
      case 'hindu_wedding':
        return 'पारंपरिक मंगल शहनाई व तानपूरा (Shehnai & Tanpura)';
      case 'muslim_wedding':
        return 'रूहानी सूफ़ी नेय व संतूर (Soulful Sufi Ney Flute)';
      case 'birthday':
        return 'बर्थडे पार्टी मेलोडी व म्यूजिक बॉक्स (Party Music Box)';
    }
  };

  return (
    <div className="bg-[#fdfaf5] border border-[#d4af37]/60 rounded-2xl p-3.5 sm:p-4 text-xs font-devanagari-serif space-y-3.5 shadow-sm">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#d4af37]/30 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-[#87091f] text-[#ffd700] rounded-xl shadow-xs">
            <Music className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="font-devanagari-royal font-bold text-stone-900 block text-xs sm:text-sm">
              संगीत व बैकग्राउंड ऑडियो प्लेयर (Audio & Music)
            </span>
            <span className="text-[10px] text-stone-500">
              कस्टम MP3 अपलोड करें (Supabase Cloud), डिफ़ॉल्ट धुन चुनें या म्यूट रखें।
            </span>
          </div>
        </div>

        {/* Live Audio Playback Indicator */}
        <div className="flex items-center gap-1.5">
          {isPlaying && (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              बज रहा है
            </span>
          )}
        </div>
      </div>

      {/* 3 Audio Mode Options */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-bold text-center">
        {/* Option 1: Default Melody */}
        <button
          type="button"
          onClick={() => handleSelectMode('default')}
          disabled={isUploading}
          className={`p-2 rounded-xl border text-left transition-all ${
            currentSettings.mode === 'default'
              ? 'bg-[#fdf6e7] border-[#87091f] text-[#87091f] ring-1 ring-[#87091f] shadow-xs'
              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
          } ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-xs">१. डिफ़ॉल्ट धुन</span>
            {currentSettings.mode === 'default' && <CheckCircle2 className="w-3.5 h-3.5 text-[#87091f]" />}
          </div>
          <span className="text-[10px] text-stone-500 font-normal block truncate">
            {category === 'hindu_wedding' ? 'शहनाई' : category === 'muslim_wedding' ? 'सूफ़ी धुन' : 'बर्थडे धुन'}
          </span>
        </button>

        {/* Option 2: Custom Upload */}
        <button
          type="button"
          onClick={() => handleSelectMode('custom')}
          disabled={isUploading}
          className={`p-2 rounded-xl border text-left transition-all ${
            currentSettings.mode === 'custom'
              ? 'bg-[#fdf6e7] border-[#87091f] text-[#87091f] ring-1 ring-[#87091f] shadow-xs'
              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
          } ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-xs">२. कस्टम ऑडियो (MP3)</span>
            {currentSettings.mode === 'custom' && <CheckCircle2 className="w-3.5 h-3.5 text-[#87091f]" />}
          </div>
          <span className="text-[10px] text-stone-500 font-normal block truncate">
            {currentSettings.audioFileName || 'अपनी ऑडियो फ़ाइल'}
          </span>
        </button>

        {/* Option 3: No Music */}
        <button
          type="button"
          onClick={() => handleSelectMode('none')}
          disabled={isUploading}
          className={`p-2 rounded-xl border text-left transition-all ${
            currentSettings.mode === 'none'
              ? 'bg-[#fdf6e7] border-[#87091f] text-[#87091f] ring-1 ring-[#87091f] shadow-xs'
              : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
          } ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-xs">३. कोई संगीत नहीं</span>
            {currentSettings.mode === 'none' && <CheckCircle2 className="w-3.5 h-3.5 text-[#87091f]" />}
          </div>
          <span className="text-[10px] text-stone-500 font-normal block">
            शांत / म्यूट कार्ड
          </span>
        </button>
      </div>

      {/* Mode Details Section */}
      {currentSettings.mode === 'default' && (
        <div className="p-3 bg-white border border-[#d4af37]/40 rounded-xl flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-bold text-stone-800 block">सक्रिय धुन:</span>
            <span className="text-xs text-[#87091f] font-bold">{getDefaultMelodyName()}</span>
          </div>
          <button
            type="button"
            onClick={handlePlayToggle}
            className="px-3 py-1.5 bg-[#87091f] text-[#ffd700] rounded-xl font-bold flex items-center gap-1 text-[11px] hover:bg-[#630514] active:scale-95"
          >
            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{isPlaying ? 'रोकें' : 'सुनें'}</span>
          </button>
        </div>
      )}

      {currentSettings.mode === 'custom' && (
        <div className="p-3 bg-white border border-[#d4af37]/60 rounded-xl space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-bold text-stone-800 text-[11px]">
              फ़ोन या कंप्यूटर से ऑडियो चुनें (MP3, WAV, M4A, OGG, AAC - Max 20MB):
            </span>

            <label
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs shadow-xs transition-all ${
                isUploading
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed opacity-75'
                  : 'bg-[#87091f] text-[#ffd700] cursor-pointer hover:bg-[#630514] active:scale-95'
              }`}
            >
              {isUploading ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Upload className="w-3.5 h-3.5" />
              )}
              <span>{isUploading ? 'क्लाउड पर अपलोड हो रहा है...' : 'ऑडियो फ़ाइल चुनें'}</span>
              <input
                type="file"
                accept="audio/*,.mp3,.wav,.m4a,.ogg,.aac,.mp4,.webm"
                onChange={handleAudioUpload}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>

          {currentSettings.audioUrl ? (
            <div className="p-2.5 bg-[#fdf6e7] border border-[#d4af37]/60 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-800 text-xs truncate max-w-[200px] sm:max-w-xs">
                  🎵 {currentSettings.audioFileName || 'कस्टम ऑडियो'}
                </span>
                {currentSettings.fileSizeBytes && (
                  <span className="text-[10px] text-stone-500">
                    {formatAudioFileSize(currentSettings.fileSizeBytes)}
                  </span>
                )}
              </div>

              {/* Storage & Compatibility explanation badge */}
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] pt-1 border-t border-[#d4af37]/30">
                {currentSettings.audioUrl.includes('supabase.co') ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Supabase क्लाउड स्टोरेज में सुरक्षित (छोटा लिंक व तेज़ लोडिंग)
                  </span>
                ) : currentSettings.audioUrl.startsWith('data:') ? (
                  <span className="text-blue-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    पारंपरिक Base64 ऑडियो (पुराने निमंत्रण के साथ पूर्णतः संगत)
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ऑडियो सुरक्षित है
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleRemoveCustomAudio}
                  disabled={isUploading}
                  className={`text-rose-700 hover:text-rose-900 font-bold flex items-center gap-1 ${
                    isUploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <Trash2 className="w-3 h-3" />
                  <span>ऑडियो हटाएं</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-2.5 bg-stone-50 border border-dashed border-stone-300 rounded-xl text-center text-[11px] text-stone-500">
              अभी कोई कस्टम ऑडियो नहीं चुना गया है। ऊपर दिए बटन से अपना पसंदीदा MP3 चुनें।
            </div>
          )}
        </div>
      )}

      {currentSettings.mode === 'none' && (
        <div className="p-3 bg-stone-100 rounded-xl text-stone-600 text-[11px] flex items-center gap-2">
          <VolumeX className="w-4 h-4 text-stone-400 shrink-0" />
          <span>इस कार्ड में कोई संगीत नहीं बजेगा। यदि आप संगीत जोड़ना चाहें तो ऊपर से विकल्प चुनें।</span>
        </div>
      )}

      {/* Progress / Success Message */}
      {statusMessage && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-800 font-medium flex items-center gap-2">
          {isUploading ? (
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600 animate-spin shrink-0" />
          ) : (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          )}
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-[11px] text-rose-800 font-medium flex items-center gap-2 animate-in fade-in duration-150">
          <AlertCircle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Interactive Music Player Controller (Play/Pause, Mute/Unmute, Volume) */}
      {currentSettings.mode !== 'none' && (
        <div className="p-3 bg-[#f5ecdc] border border-[#d4af37]/50 rounded-xl space-y-2">
          <div className="flex items-center justify-between font-bold text-stone-800 text-[11px]">
            <span className="flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-[#87091f]" /> प्लेयर कंट्रोल्स (Play, Mute & Volume)
            </span>
            <span className="text-[10px] text-stone-500">
              आवाज: {Math.round((currentSettings.volume ?? 0.7) * 100)}%
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
            {/* Play & Mute Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePlayToggle}
                disabled={isUploading}
                className={`flex-1 py-1.5 px-3 rounded-xl font-bold flex items-center justify-center gap-1.5 text-xs shadow-xs transition-all active:scale-95 ${
                  isPlaying
                    ? 'bg-[#87091f] text-[#ffd700]'
                    : 'bg-white text-stone-800 border border-stone-300 hover:bg-stone-50'
                } ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-[#87091f]" />}
                <span>{isPlaying ? 'संगीत रोकें (Pause)' : 'संगीत बजाएं (Play)'}</span>
              </button>

              <button
                type="button"
                onClick={handleMuteToggle}
                disabled={isUploading}
                className={`py-1.5 px-3 rounded-xl font-bold border transition-all text-xs flex items-center gap-1 ${
                  currentSettings.isMuted
                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                } ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}`}
                title="म्यूट / अनम्यूट"
              >
                {currentSettings.isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-stone-700" />}
                <span>{currentSettings.isMuted ? 'म्यूट है' : 'म्यूट'}</span>
              </button>
            </div>

            {/* Volume Slider */}
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-stone-200">
              <Volume2 className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={currentSettings.volume ?? 0.7}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                disabled={isUploading}
                className="w-full accent-[#87091f]"
              />
            </div>
          </div>

          <p className="text-[10px] text-stone-500 italic">
            * मोबाइल ब्राउज़र ऑटोप्ले रोक सकते हैं, इसलिए मेहमान "संगीत सुनें" बटन दबाकर संगीत शुरू कर सकते हैं।
          </p>
        </div>
      )}
    </div>
  );
};
