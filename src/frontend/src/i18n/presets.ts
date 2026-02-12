import type { Language } from './translations';

export interface PresetTranslation {
  name: string;
  description: string;
}

export const presetTranslations: Record<Language, Record<string, PresetTranslation>> = {
  'pt-BR': {
    clean: {
      name: 'Limpo',
      description: 'Masterização transparente para mixagens bem equilibradas',
    },
    warm: {
      name: 'Quente',
      description: 'Adiciona calor e caráter analógico',
    },
    loud: {
      name: 'Alto',
      description: 'Volume máximo para plataformas de streaming',
    },
    bass: {
      name: 'Reforço de Graves',
      description: 'Graves aprimorados para gêneros pesados em baixo',
    },
    bright: {
      name: 'Brilhante',
      description: 'Adiciona clareza e presença',
    },
    vintage: {
      name: 'Vintage',
      description: 'Som clássico de fita analógica com harmônicos ricos',
    },
    modern: {
      name: 'Moderno',
      description: 'Som contemporâneo com estéreo amplo e impacto',
    },
  },
  'en': {
    clean: {
      name: 'Clean',
      description: 'Transparent mastering for well-balanced mixes',
    },
    warm: {
      name: 'Warm',
      description: 'Adds warmth and analog character',
    },
    loud: {
      name: 'Loud',
      description: 'Maximum loudness for streaming platforms',
    },
    bass: {
      name: 'Bass Boost',
      description: 'Enhanced low-end for bass-heavy genres',
    },
    bright: {
      name: 'Bright',
      description: 'Adds clarity and presence',
    },
    vintage: {
      name: 'Vintage',
      description: 'Classic analog tape sound with rich harmonics',
    },
    modern: {
      name: 'Modern',
      description: 'Contemporary sound with wide stereo and punch',
    },
  },
};
