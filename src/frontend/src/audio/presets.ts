export interface MasteringPreset {
  name: string;
  description: string;
  eq: {
    lowShelf: { frequency: number; gain: number };
    midPeak: { frequency: number; gain: number; q: number };
    highShelf: { frequency: number; gain: number };
  };
  compression: {
    threshold: number;
    knee: number;
    ratio: number;
    attack: number;
    release: number;
  };
  limiter: {
    threshold: number;
    release: number;
  };
  saturation?: {
    enabled: boolean;
    drive: number;
  };
  stereoWidth?: {
    enabled: boolean;
    width: number;
  };
  outputGain: number;
}

export const MASTERING_PRESETS: Record<string, MasteringPreset> = {
  clean: {
    name: 'Clean',
    description: 'Transparent mastering for well-balanced mixes',
    eq: {
      lowShelf: { frequency: 80, gain: 1.2 },
      midPeak: { frequency: 2000, gain: 0.5, q: 0.7 },
      highShelf: { frequency: 10000, gain: 1.2 }
    },
    compression: {
      threshold: -18,
      knee: 6,
      ratio: 2.5,
      attack: 0.003,
      release: 0.25
    },
    limiter: {
      threshold: -1,
      release: 0.05
    },
    saturation: {
      enabled: false,
      drive: 0
    },
    stereoWidth: {
      enabled: true,
      width: 1.1
    },
    outputGain: 2.2
  },
  warm: {
    name: 'Warm',
    description: 'Adds warmth and analog character',
    eq: {
      lowShelf: { frequency: 100, gain: 2.5 },
      midPeak: { frequency: 1000, gain: -0.5, q: 1.0 },
      highShelf: { frequency: 8000, gain: -0.5 }
    },
    compression: {
      threshold: -16,
      knee: 8,
      ratio: 3.5,
      attack: 0.005,
      release: 0.3
    },
    limiter: {
      threshold: -0.5,
      release: 0.08
    },
    saturation: {
      enabled: true,
      drive: 15
    },
    stereoWidth: {
      enabled: true,
      width: 1.0
    },
    outputGain: 3.2
  },
  loud: {
    name: 'Loud',
    description: 'Maximum loudness for streaming platforms',
    eq: {
      lowShelf: { frequency: 60, gain: 2 },
      midPeak: { frequency: 3000, gain: 1.5, q: 0.8 },
      highShelf: { frequency: 12000, gain: 2.5 }
    },
    compression: {
      threshold: -20,
      knee: 10,
      ratio: 5,
      attack: 0.001,
      release: 0.2
    },
    limiter: {
      threshold: -0.3,
      release: 0.03
    },
    saturation: {
      enabled: true,
      drive: 10
    },
    stereoWidth: {
      enabled: true,
      width: 1.15
    },
    outputGain: 4.5
  },
  bass: {
    name: 'Bass Boost',
    description: 'Enhanced low-end for bass-heavy genres',
    eq: {
      lowShelf: { frequency: 80, gain: 4.5 },
      midPeak: { frequency: 200, gain: 2.5, q: 1.2 },
      highShelf: { frequency: 10000, gain: 0.5 }
    },
    compression: {
      threshold: -16,
      knee: 8,
      ratio: 3.5,
      attack: 0.01,
      release: 0.35
    },
    limiter: {
      threshold: -0.5,
      release: 0.1
    },
    saturation: {
      enabled: true,
      drive: 20
    },
    stereoWidth: {
      enabled: true,
      width: 0.95
    },
    outputGain: 3
  },
  bright: {
    name: 'Bright',
    description: 'Adds clarity and presence',
    eq: {
      lowShelf: { frequency: 100, gain: 0 },
      midPeak: { frequency: 4000, gain: 2.5, q: 0.9 },
      highShelf: { frequency: 8000, gain: 3.5 }
    },
    compression: {
      threshold: -18,
      knee: 6,
      ratio: 2.5,
      attack: 0.002,
      release: 0.25
    },
    limiter: {
      threshold: -0.8,
      release: 0.05
    },
    saturation: {
      enabled: false,
      drive: 0
    },
    stereoWidth: {
      enabled: true,
      width: 1.2
    },
    outputGain: 2.8
  },
  vintage: {
    name: 'Vintage',
    description: 'Classic analog tape sound with rich harmonics',
    eq: {
      lowShelf: { frequency: 120, gain: 2 },
      midPeak: { frequency: 800, gain: 1, q: 1.5 },
      highShelf: { frequency: 6000, gain: -1.5 }
    },
    compression: {
      threshold: -14,
      knee: 10,
      ratio: 4,
      attack: 0.008,
      release: 0.4
    },
    limiter: {
      threshold: -0.8,
      release: 0.1
    },
    saturation: {
      enabled: true,
      drive: 25
    },
    stereoWidth: {
      enabled: true,
      width: 0.9
    },
    outputGain: 3.5
  },
  modern: {
    name: 'Modern',
    description: 'Contemporary sound with wide stereo and punch',
    eq: {
      lowShelf: { frequency: 70, gain: 2.5 },
      midPeak: { frequency: 2500, gain: 1.5, q: 0.6 },
      highShelf: { frequency: 10000, gain: 2 }
    },
    compression: {
      threshold: -19,
      knee: 7,
      ratio: 4,
      attack: 0.002,
      release: 0.22
    },
    limiter: {
      threshold: -0.4,
      release: 0.04
    },
    saturation: {
      enabled: true,
      drive: 12
    },
    stereoWidth: {
      enabled: true,
      width: 1.3
    },
    outputGain: 4
  },
  voiceClean: {
    name: 'Voice Clean',
    description: 'Optimized for vocal clarity and intelligibility',
    eq: {
      lowShelf: { frequency: 120, gain: -2.5 },
      midPeak: { frequency: 3000, gain: 2.8, q: 1.0 },
      highShelf: { frequency: 8000, gain: -1.0 }
    },
    compression: {
      threshold: -16,
      knee: 8,
      ratio: 3.0,
      attack: 0.005,
      release: 0.3
    },
    limiter: {
      threshold: -1.0,
      release: 0.06
    },
    saturation: {
      enabled: false,
      drive: 0
    },
    stereoWidth: {
      enabled: true,
      width: 1.0
    },
    outputGain: 2.5
  }
};
