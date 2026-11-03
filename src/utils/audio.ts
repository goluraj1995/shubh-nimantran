/**
 * Multipurpose Auspicious & Festive Audio Synthesizer & Controller
 * Supports:
 * - Hindu Wedding: Shehnai, Tanpura & Temple Bells
 * - Muslim Wedding: Soulful Sufi Ney & Santur Harmony
 * - Birthday: Cheerful Party Melody & Chimes
 * Plus custom MP3 audio URL support.
 */

export type AudioCategory = 'hindu_wedding' | 'muslim_wedding' | 'birthday';

class CardAudioPlayer {
  private audioCtx: AudioContext | null = null;
  private isSynthPlaying = false;
  private timerId: number | null = null;
  private droneOsc: OscillatorNode | null = null;
  private droneGain: GainNode | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private isMuted = true;
  private volume = 0.7;
  private customUrl = '';
  private currentCategory: AudioCategory = 'hindu_wedding';

  private initCtx() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setCustomUrl(url: string) {
    this.customUrl = url;
    if (this.audioElement) {
      this.audioElement.src = url;
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
    if (this.droneGain && this.audioCtx) {
      this.droneGain.gain.setValueAtTime(0.008 * this.volume, this.audioCtx.currentTime);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public mute() {
    this.isMuted = true;
    if (this.audioElement) {
      this.audioElement.muted = true;
    }
    this.stopSynthMelody();
  }

  public unmute(category?: AudioCategory, trackUrl?: string) {
    this.isMuted = false;
    if (this.audioElement) {
      this.audioElement.muted = false;
      this.audioElement.volume = this.volume;
    }
    this.play(category || this.currentCategory, trackUrl || this.customUrl);
  }

  public play(categoryOrUrl?: AudioCategory | string, customMusicUrl?: string) {
    this.isMuted = false;
    let category: AudioCategory = 'hindu_wedding';
    let track = this.customUrl;

    if (categoryOrUrl === 'hindu_wedding' || categoryOrUrl === 'muslim_wedding' || categoryOrUrl === 'birthday') {
      category = categoryOrUrl;
      if (customMusicUrl) track = customMusicUrl;
    } else if (typeof categoryOrUrl === 'string' && categoryOrUrl.trim().length > 0) {
      track = categoryOrUrl;
    }

    this.currentCategory = category;

    if (track && track.trim().length > 0) {
      try {
        if (!this.audioElement) {
          this.audioElement = new Audio(track);
          this.audioElement.loop = true;
        } else if (this.audioElement.src !== track) {
          this.audioElement.src = track;
        }
        this.audioElement.volume = this.volume;
        this.audioElement.muted = false;
        this.audioElement.play().catch(() => {
          this.startSynthMelody(category);
        });
        return;
      } catch (err) {
        console.warn('Audio play error, falling back to synth', err);
      }
    }

    this.startSynthMelody(category);
  }

  public pause() {
    this.isMuted = true;
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.stopSynthMelody();
  }

  public toggle(categoryOrUrl?: AudioCategory | string, customMusicUrl?: string): boolean {
    if (this.isPlaying()) {
      this.pause();
      return false;
    } else {
      this.play(categoryOrUrl, customMusicUrl);
      return true;
    }
  }

  public isPlaying(): boolean {
    if (this.audioElement && !this.audioElement.paused && !this.audioElement.muted) {
      return true;
    }
    return this.isSynthPlaying && !this.isMuted;
  }

  private startSynthMelody(category: AudioCategory) {
    this.initCtx();
    if (!this.audioCtx) return;
    this.stopSynthMelody();
    this.isSynthPlaying = true;

    if (category === 'muslim_wedding') {
      this.playSufiMelody();
    } else if (category === 'birthday') {
      this.playBirthdayMelody();
    } else {
      this.playShehnaiMelody();
    }
  }

  // 1. Hindu Wedding: Shehnai & Tanpura
  private playShehnaiMelody() {
    if (!this.audioCtx) return;

    try {
      this.droneOsc = this.audioCtx.createOscillator();
      this.droneGain = this.audioCtx.createGain();
      this.droneOsc.type = 'sawtooth';
      this.droneOsc.frequency.setValueAtTime(146.83, this.audioCtx.currentTime); // D3
      this.droneGain.gain.setValueAtTime(0.006, this.audioCtx.currentTime);

      const filter = this.audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, this.audioCtx.currentTime);

      this.droneOsc.connect(filter);
      filter.connect(this.droneGain);
      this.droneGain.connect(this.audioCtx.destination);
      this.droneOsc.start();
    } catch {
      // ignore
    }

    const swaras: { [key: string]: number } = {
      'S': 293.66, 'R': 329.63, 'G': 369.99, 'M': 392.00,
      'P': 440.00, 'D': 493.88, 'N': 554.37, 'S2': 587.33, 'R2': 659.25
    };
    const pattern = ['S', 'R', 'G', 'P', 'D', 'S2', 'D', 'P', 'G', 'P', 'D', 'P', 'G', 'R', 'S', 'P', 'D', 'S2', 'R2', 'S2', 'D', 'P', 'G', 'R', 'S'];
    let step = 0;

    const playNext = () => {
      if (!this.isSynthPlaying || this.isMuted || !this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const freq = swaras[pattern[step % pattern.length]] || 440;

      const osc = this.audioCtx.createOscillator();
      const vibrato = this.audioCtx.createOscillator();
      const vibratoGain = this.audioCtx.createGain();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      vibrato.frequency.setValueAtTime(5.5, now);
      vibratoGain.gain.setValueAtTime(3.5, now);
      vibrato.connect(vibratoGain);
      vibratoGain.connect(osc.frequency);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.04, now + 0.4);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.95);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      vibrato.start(now);
      osc.start(now);
      vibrato.stop(now + 1.0);
      osc.stop(now + 1.0);

      step++;
      this.timerId = window.setTimeout(playNext, 440 + (step % 4 === 0 ? 300 : 0));
    };
    playNext();
  }

  // 2. Muslim Wedding: Soulful Sufi Ney & Santur
  private playSufiMelody() {
    if (!this.audioCtx) return;

    try {
      this.droneOsc = this.audioCtx.createOscillator();
      this.droneGain = this.audioCtx.createGain();
      this.droneOsc.type = 'sine';
      this.droneOsc.frequency.setValueAtTime(110, this.audioCtx.currentTime); // A2 drone
      this.droneGain.gain.setValueAtTime(0.008, this.audioCtx.currentTime);

      this.droneOsc.connect(this.droneGain);
      this.droneGain.connect(this.audioCtx.destination);
      this.droneOsc.start();
    } catch {
      // ignore
    }

    // Maqam Bayati / Hijaz serene notes: A3, Bb3, C4, D4, E4, F4, G4, A4
    const notes = [220, 233.08, 261.63, 293.66, 329.63, 349.23, 392.00, 440.00];
    const sequence = [0, 2, 3, 4, 5, 4, 3, 2, 0, 3, 4, 7, 5, 4, 3, 2, 0];
    let step = 0;

    const playNext = () => {
      if (!this.isSynthPlaying || this.isMuted || !this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const freq = notes[sequence[step % sequence.length]];

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine'; // Ney flute warmth
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.07, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.03, now + 0.6);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.4);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + 1.45);

      step++;
      this.timerId = window.setTimeout(playNext, 520);
    };
    playNext();
  }

  // 3. Birthday: Cheerful Party Melody
  private playBirthdayMelody() {
    if (!this.audioCtx) return;

    // Happy Birthday notes (C4, C4, D4, C4, F4, E4...)
    const happyBirthday = [
      { f: 261.63, d: 350 }, { f: 261.63, d: 250 }, { f: 293.66, d: 500 },
      { f: 261.63, d: 500 }, { f: 349.23, d: 500 }, { f: 329.63, d: 800 },
      { f: 261.63, d: 350 }, { f: 261.63, d: 250 }, { f: 293.66, d: 500 },
      { f: 261.63, d: 500 }, { f: 392.00, d: 500 }, { f: 349.23, d: 800 },
      { f: 261.63, d: 350 }, { f: 261.63, d: 250 }, { f: 523.25, d: 500 },
      { f: 440.00, d: 500 }, { f: 349.23, d: 500 }, { f: 329.63, d: 500 }, { f: 293.66, d: 600 }
    ];
    let step = 0;

    const playNext = () => {
      if (!this.isSynthPlaying || this.isMuted || !this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const note = happyBirthday[step % happyBirthday.length];

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle'; // Music box chime
      osc.frequency.setValueAtTime(note.f, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.09, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + (note.d / 1000) * 0.9);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now);
      osc.stop(now + note.d / 1000);

      step++;
      this.timerId = window.setTimeout(playNext, note.d + 50);
    };
    playNext();
  }

  private stopSynthMelody() {
    this.isSynthPlaying = false;
    if (this.timerId !== null) {
      window.clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.droneOsc) {
      try {
        this.droneOsc.stop();
        this.droneOsc.disconnect();
      } catch {
        // ignore
      }
      this.droneOsc = null;
    }
  }

  // Envelope Open Sound Flourish
  public playEnvelopeOpenSound(category: AudioCategory = 'hindu_wedding') {
    this.initCtx();
    if (!this.audioCtx) return;

    const now = this.audioCtx.currentTime;
    const notes = category === 'birthday' 
      ? [523.25, 659.25, 783.99, 1046.50] // Party horn / chime arpeggio
      : category === 'muslim_wedding'
      ? [220, 329.63, 440, 659.25] // Royal santur chime
      : [293.66, 369.99, 440.00, 587.33]; // Auspicious Shankh/Swar flourish

    notes.forEach((freq, idx) => {
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = category === 'birthday' ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0.001, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.09 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.09 + 1.2);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 1.25);
    });
  }
}

export const cardAudio = new CardAudioPlayer();
export const weddingAudio = cardAudio; // backwards compatibility
