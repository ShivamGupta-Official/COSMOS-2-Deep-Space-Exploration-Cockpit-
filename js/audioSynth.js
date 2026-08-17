/* =========================================================================
   COSMOS-2: WEB AUDIO SYNTHESIZER & AUDIO SPECTRUM ANALYZER
   ========================================================================= */

export class AudioSynth {
  constructor() {
    this.enabled = true;
    this.audioCtx = null;
    this.engineOsc = null;
    this.engineGain = null;
    this.analyser = null;
    this.dataArray = null;
  }

  init() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Engine Hum Oscillator
      this.engineOsc = this.audioCtx.createOscillator();
      this.engineGain = this.audioCtx.createGain();
      
      // Spectrum Analyser for HUD Audio Waveform
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

      this.engineOsc.type = "triangle";
      this.engineOsc.frequency.setValueAtTime(50, this.audioCtx.currentTime);
      this.engineGain.gain.setValueAtTime(0.02, this.audioCtx.currentTime);

      this.engineOsc.connect(this.engineGain);
      this.engineGain.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
      
      this.engineOsc.start();
    }

    if (this.audioCtx && this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  updateEngine(speedRatio) {
    if (!this.enabled || !this.audioCtx || !this.engineGain) return;
    try {
      const targetGain = Math.min(0.02 + speedRatio * 0.08, 0.1);
      const targetFreq = 50 + speedRatio * 240;
      this.engineGain.gain.setTargetAtTime(targetGain, this.audioCtx.currentTime, 0.1);
      this.engineOsc.frequency.setTargetAtTime(targetFreq, this.audioCtx.currentTime, 0.1);
    } catch(e){}
  }

  getWaveformData() {
    if (this.analyser && this.dataArray) {
      this.analyser.getByteFrequencyData(this.dataArray);
      return this.dataArray;
    }
    return new Uint8Array(32);
  }

  playBeep(freq = 800, duration = 0.1) {
    if (!this.enabled || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch(e){}
  }

  playWarpSound() {
    if (!this.enabled || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(80, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1000, this.audioCtx.currentTime + 1.2);
      gain.gain.setValueAtTime(0.25, this.audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.audioCtx.currentTime + 1.4);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 1.4);
    } catch(e){}
  }

  playImpactSound() {
    if (!this.enabled || !this.audioCtx) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(120, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(30, this.audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.3);
    } catch(e){}
  }
}
