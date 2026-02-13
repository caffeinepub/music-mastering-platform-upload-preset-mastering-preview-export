import type { MasteringPreset } from './presets';

export class MasteringEngine {
  private audioContext: AudioContext;
  private sourceBuffer: AudioBuffer | null = null;
  private referenceBuffer: AudioBuffer | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  
  // Original chain
  private originalGainNode: GainNode;
  
  // Mastered chain
  private lowShelfFilter: BiquadFilterNode;
  private midPeakFilter: BiquadFilterNode;
  private highShelfFilter: BiquadFilterNode;
  private saturationNode: WaveShaperNode;
  private compressor: DynamicsCompressorNode;
  private limiter: DynamicsCompressorNode;
  private stereoWidthSplitter: ChannelSplitterNode;
  private stereoWidthMerger: ChannelMergerNode;
  private stereoWidthGainL: GainNode;
  private stereoWidthGainR: GainNode;
  private stereoWidthMidGain: GainNode;
  private stereoWidthSideGain: GainNode;
  private outputGainNode: GainNode;
  
  // Reference chain
  private referenceGainNode: GainNode;
  private referenceLoudnessGain: GainNode;
  
  private currentMode: 'original' | 'mastered' | 'reference' = 'original';
  private currentPreset: MasteringPreset | null = null;
  private loudnessMatchingEnabled: boolean = false;
  
  // Connection state tracking
  private isStereoWidthConnected: boolean = false;
  private isOriginalConnectedToDestination: boolean = false;
  private isOutputConnectedToDestination: boolean = false;
  private isReferenceConnectedToDestination: boolean = false;

  constructor() {
    this.audioContext = new AudioContext();
    
    // Original chain
    this.originalGainNode = this.audioContext.createGain();
    this.originalGainNode.gain.value = 1;
    
    // Mastered chain - EQ
    this.lowShelfFilter = this.audioContext.createBiquadFilter();
    this.lowShelfFilter.type = 'lowshelf';
    
    this.midPeakFilter = this.audioContext.createBiquadFilter();
    this.midPeakFilter.type = 'peaking';
    
    this.highShelfFilter = this.audioContext.createBiquadFilter();
    this.highShelfFilter.type = 'highshelf';
    
    // Saturation (WaveShaper)
    this.saturationNode = this.audioContext.createWaveShaper();
    this.setSaturationCurve(0);
    this.saturationNode.oversample = '4x';
    
    // Compression
    this.compressor = this.audioContext.createDynamicsCompressor();
    
    // Limiter (hard compression)
    this.limiter = this.audioContext.createDynamicsCompressor();
    this.limiter.ratio.value = 20;
    this.limiter.attack.value = 0.001;
    
    // Stereo width (M/S processing)
    this.stereoWidthSplitter = this.audioContext.createChannelSplitter(2);
    this.stereoWidthMerger = this.audioContext.createChannelMerger(2);
    this.stereoWidthGainL = this.audioContext.createGain();
    this.stereoWidthGainR = this.audioContext.createGain();
    this.stereoWidthMidGain = this.audioContext.createGain();
    this.stereoWidthSideGain = this.audioContext.createGain();
    
    // Output gain
    this.outputGainNode = this.audioContext.createGain();
    
    // Reference chain
    this.referenceGainNode = this.audioContext.createGain();
    this.referenceGainNode.gain.value = 1;
    this.referenceLoudnessGain = this.audioContext.createGain();
    this.referenceLoudnessGain.gain.value = 1;
    
    // Connect base mastered chain (up to limiter)
    this.lowShelfFilter.connect(this.midPeakFilter);
    this.midPeakFilter.connect(this.highShelfFilter);
    this.highShelfFilter.connect(this.saturationNode);
    this.saturationNode.connect(this.compressor);
    this.compressor.connect(this.limiter);
    
    // Connect reference chain
    this.referenceGainNode.connect(this.referenceLoudnessGain);
  }

  private setSaturationCurve(drive: number): void {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    const driveAmount = drive / 100;
    
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      if (driveAmount === 0) {
        curve[i] = x;
      } else {
        curve[i] = ((3 + driveAmount) * x * 20 * deg) / (Math.PI + driveAmount * Math.abs(x));
      }
    }
    
    this.saturationNode.curve = curve;
  }

  private applyStereoWidth(width: number): void {
    // M/S stereo width processing
    // width: 0 = mono, 1 = normal, >1 = wider
    const mid = 0.5;
    const side = (width - 1) * 0.5;
    
    this.stereoWidthGainL.gain.value = 0.5;
    this.stereoWidthGainR.gain.value = 0.5;
    this.stereoWidthMidGain.gain.value = mid;
    this.stereoWidthSideGain.gain.value = side;
  }

  private disconnectStereoWidthChain(): void {
    if (!this.isStereoWidthConnected) return;
    
    try {
      this.stereoWidthSplitter.disconnect();
      this.stereoWidthGainL.disconnect();
      this.stereoWidthGainR.disconnect();
      this.stereoWidthMidGain.disconnect();
      this.stereoWidthSideGain.disconnect();
      this.stereoWidthMerger.disconnect();
    } catch (e) {
      // Nodes may not be connected
    }
    
    this.isStereoWidthConnected = false;
  }

  private configureMasteredChainRouting(): void {
    // Disconnect existing connections from limiter and stereo width chain
    try {
      this.limiter.disconnect();
    } catch (e) {
      // Node may not be connected yet
    }
    
    this.disconnectStereoWidthChain();

    const isStereo = this.sourceBuffer && this.sourceBuffer.numberOfChannels === 2;
    const useStereoWidth = isStereo && this.currentPreset?.stereoWidth?.enabled;

    if (useStereoWidth) {
      // Connect stereo width processing (only for stereo sources)
      this.limiter.connect(this.stereoWidthSplitter);
      
      this.stereoWidthSplitter.connect(this.stereoWidthGainL, 0);
      this.stereoWidthSplitter.connect(this.stereoWidthGainR, 1);
      this.stereoWidthGainL.connect(this.stereoWidthMidGain);
      this.stereoWidthGainR.connect(this.stereoWidthMidGain);
      this.stereoWidthGainL.connect(this.stereoWidthSideGain);
      this.stereoWidthGainR.connect(this.stereoWidthSideGain);
      this.stereoWidthMidGain.connect(this.stereoWidthMerger, 0, 0);
      this.stereoWidthMidGain.connect(this.stereoWidthMerger, 0, 1);
      this.stereoWidthSideGain.connect(this.stereoWidthMerger, 0, 0);
      this.stereoWidthSideGain.connect(this.stereoWidthMerger, 0, 1);
      
      this.stereoWidthMerger.connect(this.outputGainNode);
      this.isStereoWidthConnected = true;
    } else {
      // Bypass stereo width - connect limiter directly to output
      this.limiter.connect(this.outputGainNode);
      this.isStereoWidthConnected = false;
    }
  }

  async loadAudio(file: File): Promise<void> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      this.sourceBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      // Reconfigure routing based on channel count
      if (this.currentPreset) {
        this.configureMasteredChainRouting();
      }
    } catch (error) {
      throw new Error('Failed to decode audio file. Please ensure it is a valid WAV or MP3 file.');
    }
  }

  async loadReference(file: File): Promise<void> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      this.referenceBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
      
      // Update loudness matching if enabled
      if (this.loudnessMatchingEnabled) {
        this.updateLoudnessMatching();
      }
    } catch (error) {
      throw new Error('Failed to decode reference file. Please ensure it is a valid WAV or MP3 file.');
    }
  }

  clearReference(): void {
    this.referenceBuffer = null;
    if (this.currentMode === 'reference') {
      this.pause();
      this.currentMode = 'mastered';
    }
  }

  hasReference(): boolean {
    return this.referenceBuffer !== null;
  }

  getReferenceMetadata(): { duration: number; sampleRate: number; channels: number } | null {
    if (!this.referenceBuffer) return null;
    return {
      duration: this.referenceBuffer.duration,
      sampleRate: this.referenceBuffer.sampleRate,
      channels: this.referenceBuffer.numberOfChannels
    };
  }

  private calculateRMS(buffer: AudioBuffer): number {
    let sum = 0;
    let count = 0;
    
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
      const data = buffer.getChannelData(channel);
      for (let i = 0; i < data.length; i++) {
        sum += data[i] * data[i];
        count++;
      }
    }
    
    return Math.sqrt(sum / count);
  }

  private updateLoudnessMatching(): void {
    if (!this.sourceBuffer || !this.referenceBuffer || !this.loudnessMatchingEnabled) {
      this.referenceLoudnessGain.gain.value = 1;
      return;
    }

    // Calculate RMS for both buffers
    const masteredRMS = this.calculateRMS(this.sourceBuffer);
    const referenceRMS = this.calculateRMS(this.referenceBuffer);
    
    // Apply gain adjustment to reference to match mastered loudness
    if (referenceRMS > 0) {
      const gainAdjustment = masteredRMS / referenceRMS;
      // Clamp to reasonable range
      this.referenceLoudnessGain.gain.value = Math.max(0.1, Math.min(10, gainAdjustment));
    }
  }

  setLoudnessMatching(enabled: boolean): void {
    this.loudnessMatchingEnabled = enabled;
    this.updateLoudnessMatching();
  }

  async applyPreset(preset: MasteringPreset): Promise<void> {
    if (!this.sourceBuffer) {
      throw new Error('No audio loaded');
    }

    this.currentPreset = preset;

    // Apply EQ settings
    this.lowShelfFilter.frequency.value = preset.eq.lowShelf.frequency;
    this.lowShelfFilter.gain.value = preset.eq.lowShelf.gain;
    
    this.midPeakFilter.frequency.value = preset.eq.midPeak.frequency;
    this.midPeakFilter.gain.value = preset.eq.midPeak.gain;
    this.midPeakFilter.Q.value = preset.eq.midPeak.q;
    
    this.highShelfFilter.frequency.value = preset.eq.highShelf.frequency;
    this.highShelfFilter.gain.value = preset.eq.highShelf.gain;
    
    // Apply saturation
    if (preset.saturation?.enabled) {
      this.setSaturationCurve(preset.saturation.drive);
    } else {
      this.setSaturationCurve(0);
    }
    
    // Apply compression settings
    this.compressor.threshold.value = preset.compression.threshold;
    this.compressor.knee.value = preset.compression.knee;
    this.compressor.ratio.value = preset.compression.ratio;
    this.compressor.attack.value = preset.compression.attack;
    this.compressor.release.value = preset.compression.release;
    
    // Apply limiter settings
    this.limiter.threshold.value = preset.limiter.threshold;
    this.limiter.release.value = preset.limiter.release;
    
    // Apply stereo width
    if (preset.stereoWidth?.enabled) {
      this.applyStereoWidth(preset.stereoWidth.width);
    } else {
      this.applyStereoWidth(1.0);
    }
    
    // Reconfigure routing based on channel count and preset
    this.configureMasteredChainRouting();
    
    // Apply output gain
    this.outputGainNode.gain.value = preset.outputGain;
    
    // Update loudness matching
    this.updateLoudnessMatching();
  }

  async play(mode: 'original' | 'mastered' | 'reference'): Promise<void> {
    if (!this.sourceBuffer) {
      throw new Error('No audio loaded');
    }

    if (mode === 'reference' && !this.referenceBuffer) {
      throw new Error('No reference audio loaded');
    }

    // Stop any existing playback
    this.pause();

    // Resume audio context if suspended
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // Ensure routing is configured for mastered mode
    if (mode === 'mastered' && this.currentPreset) {
      this.configureMasteredChainRouting();
    }

    // Create new source node
    this.sourceNode = this.audioContext.createBufferSource();
    
    // Connect based on mode
    if (mode === 'original') {
      this.sourceNode.buffer = this.sourceBuffer;
      this.sourceNode.connect(this.originalGainNode);
      this.originalGainNode.connect(this.audioContext.destination);
      this.isOriginalConnectedToDestination = true;
    } else if (mode === 'mastered') {
      this.sourceNode.buffer = this.sourceBuffer;
      this.sourceNode.connect(this.lowShelfFilter);
      this.outputGainNode.connect(this.audioContext.destination);
      this.isOutputConnectedToDestination = true;
    } else if (mode === 'reference') {
      this.sourceNode.buffer = this.referenceBuffer;
      this.sourceNode.connect(this.referenceGainNode);
      this.referenceLoudnessGain.connect(this.audioContext.destination);
      this.isReferenceConnectedToDestination = true;
    }
    
    this.currentMode = mode;
    this.sourceNode.start(0);
  }

  pause(): void {
    if (this.sourceNode) {
      try {
        this.sourceNode.stop();
      } catch (e) {
        // Already stopped
      }
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    
    // Disconnect nodes from destination only if they were connected
    if (this.isOriginalConnectedToDestination) {
      try {
        this.originalGainNode.disconnect(this.audioContext.destination);
      } catch (e) {
        // May not be connected
      }
      this.isOriginalConnectedToDestination = false;
    }
    
    if (this.isOutputConnectedToDestination) {
      try {
        this.outputGainNode.disconnect(this.audioContext.destination);
      } catch (e) {
        // May not be connected
      }
      this.isOutputConnectedToDestination = false;
    }
    
    if (this.isReferenceConnectedToDestination) {
      try {
        this.referenceLoudnessGain.disconnect(this.audioContext.destination);
      } catch (e) {
        // May not be connected
      }
      this.isReferenceConnectedToDestination = false;
    }
  }

  getAudioBuffer(): AudioBuffer | null {
    return this.sourceBuffer;
  }

  getAudioContext(): AudioContext {
    return this.audioContext;
  }

  getMasteredChainStart(): BiquadFilterNode {
    return this.lowShelfFilter;
  }

  getMasteredChainEnd(): GainNode {
    return this.outputGainNode;
  }

  getCurrentPreset(): MasteringPreset | null {
    return this.currentPreset;
  }

  dispose(): void {
    this.pause();
    this.audioContext.close();
  }
}
