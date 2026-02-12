import type { MasteringEngine } from './engine';
import type { MasteringPreset } from './presets';

export async function exportToWav(
  engine: MasteringEngine,
  preset: MasteringPreset,
  onProgress?: (progress: number) => void
): Promise<Blob> {
  const sourceBuffer = engine.getAudioBuffer();
  if (!sourceBuffer) {
    throw new Error('No audio loaded');
  }

  onProgress?.(10);

  // Create offline context for rendering
  const offlineContext = new OfflineAudioContext(
    sourceBuffer.numberOfChannels,
    sourceBuffer.length,
    sourceBuffer.sampleRate
  );

  onProgress?.(20);

  // Create processing chain in offline context
  const source = offlineContext.createBufferSource();
  source.buffer = sourceBuffer;

  // EQ
  const lowShelf = offlineContext.createBiquadFilter();
  lowShelf.type = 'lowshelf';
  lowShelf.frequency.value = preset.eq.lowShelf.frequency;
  lowShelf.gain.value = preset.eq.lowShelf.gain;

  const midPeak = offlineContext.createBiquadFilter();
  midPeak.type = 'peaking';
  midPeak.frequency.value = preset.eq.midPeak.frequency;
  midPeak.gain.value = preset.eq.midPeak.gain;
  midPeak.Q.value = preset.eq.midPeak.q;

  const highShelf = offlineContext.createBiquadFilter();
  highShelf.type = 'highshelf';
  highShelf.frequency.value = preset.eq.highShelf.frequency;
  highShelf.gain.value = preset.eq.highShelf.gain;

  // Saturation
  const saturation = offlineContext.createWaveShaper();
  saturation.oversample = '4x';
  
  const samples = 44100;
  const curve = new Float32Array(samples);
  const deg = Math.PI / 180;
  
  if (preset.saturation?.enabled) {
    const driveAmount = preset.saturation.drive / 100;
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = ((3 + driveAmount) * x * 20 * deg) / (Math.PI + driveAmount * Math.abs(x));
    }
  } else {
    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1;
      curve[i] = x;
    }
  }
  
  saturation.curve = curve;

  // Compression
  const compressor = offlineContext.createDynamicsCompressor();
  compressor.threshold.value = preset.compression.threshold;
  compressor.knee.value = preset.compression.knee;
  compressor.ratio.value = preset.compression.ratio;
  compressor.attack.value = preset.compression.attack;
  compressor.release.value = preset.compression.release;

  // Limiter
  const limiter = offlineContext.createDynamicsCompressor();
  limiter.threshold.value = preset.limiter.threshold;
  limiter.ratio.value = 20;
  limiter.attack.value = 0.001;
  limiter.release.value = preset.limiter.release;

  // Stereo width
  const stereoSplitter = offlineContext.createChannelSplitter(2);
  const stereoMerger = offlineContext.createChannelMerger(2);
  const stereoGainL = offlineContext.createGain();
  const stereoGainR = offlineContext.createGain();
  const stereoMidGain = offlineContext.createGain();
  const stereoSideGain = offlineContext.createGain();

  if (preset.stereoWidth?.enabled) {
    const width = preset.stereoWidth.width;
    const mid = 0.5;
    const side = (width - 1) * 0.5;
    
    stereoGainL.gain.value = 0.5;
    stereoGainR.gain.value = 0.5;
    stereoMidGain.gain.value = mid;
    stereoSideGain.gain.value = side;
  } else {
    stereoGainL.gain.value = 0.5;
    stereoGainR.gain.value = 0.5;
    stereoMidGain.gain.value = 0.5;
    stereoSideGain.gain.value = 0;
  }

  // Output gain
  const outputGain = offlineContext.createGain();
  outputGain.gain.value = preset.outputGain;

  // Connect chain
  source.connect(lowShelf);
  lowShelf.connect(midPeak);
  midPeak.connect(highShelf);
  highShelf.connect(saturation);
  saturation.connect(compressor);
  compressor.connect(limiter);
  limiter.connect(stereoSplitter);
  
  // Stereo width connections
  stereoSplitter.connect(stereoGainL, 0);
  stereoSplitter.connect(stereoGainR, 1);
  stereoGainL.connect(stereoMidGain);
  stereoGainR.connect(stereoMidGain);
  stereoGainL.connect(stereoSideGain);
  stereoGainR.connect(stereoSideGain);
  stereoMidGain.connect(stereoMerger, 0, 0);
  stereoMidGain.connect(stereoMerger, 0, 1);
  stereoSideGain.connect(stereoMerger, 0, 0);
  stereoSideGain.connect(stereoMerger, 0, 1);
  
  stereoMerger.connect(outputGain);
  outputGain.connect(offlineContext.destination);

  source.start(0);

  onProgress?.(40);

  // Render
  const renderedBuffer = await offlineContext.startRendering();

  onProgress?.(70);

  // Convert to WAV
  const wavBlob = audioBufferToWav(renderedBuffer);

  onProgress?.(100);

  return wavBlob;
}

function audioBufferToWav(buffer: AudioBuffer): Blob {
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1; // PCM
  const bitDepth = 16;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numberOfChannels * bytesPerSample;

  const data = interleave(buffer);
  const dataLength = data.length * bytesPerSample;
  const headerLength = 44;
  const totalLength = headerLength + dataLength;

  const arrayBuffer = new ArrayBuffer(totalLength);
  const view = new DataView(arrayBuffer);

  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, totalLength - 8, true);
  writeString(view, 8, 'WAVE');

  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // fmt chunk size
  view.setUint16(20, format, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true); // byte rate
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);

  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, dataLength, true);

  // Write audio data
  let offset = 44;
  for (let i = 0; i < data.length; i++) {
    const sample = Math.max(-1, Math.min(1, data[i]));
    const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    view.setInt16(offset, intSample, true);
    offset += 2;
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

function interleave(buffer: AudioBuffer): Float32Array {
  const numberOfChannels = buffer.numberOfChannels;
  const length = buffer.length * numberOfChannels;
  const result = new Float32Array(length);

  let offset = 0;
  for (let i = 0; i < buffer.length; i++) {
    for (let channel = 0; channel < numberOfChannels; channel++) {
      result[offset++] = buffer.getChannelData(channel)[i];
    }
  }

  return result;
}

function writeString(view: DataView, offset: number, string: string): void {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}
