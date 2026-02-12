export interface AudioMetadata {
  filename: string;
  duration: number;
  sampleRate?: number;
  channels?: number;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const SUPPORTED_TYPES = ['audio/wav', 'audio/mpeg', 'audio/mp3'];

export function validateAudioFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: 'File size exceeds 50MB limit' };
  }

  const extension = file.name.toLowerCase().split('.').pop();
  const isValidExtension = extension === 'wav' || extension === 'mp3';
  const isValidType = SUPPORTED_TYPES.some(type => file.type.includes(type.split('/')[1]));

  if (!isValidExtension && !isValidType) {
    return { valid: false, error: 'Unsupported file format. Please use WAV or MP3 files.' };
  }

  return { valid: true };
}

export async function extractMetadata(file: File): Promise<AudioMetadata> {
  const audioContext = new AudioContext();
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    
    return {
      filename: file.name,
      duration: audioBuffer.duration,
      sampleRate: audioBuffer.sampleRate,
      channels: audioBuffer.numberOfChannels
    };
  } catch (error) {
    console.error('Failed to extract metadata:', error);
    return {
      filename: file.name,
      duration: 0
    };
  } finally {
    await audioContext.close();
  }
}
