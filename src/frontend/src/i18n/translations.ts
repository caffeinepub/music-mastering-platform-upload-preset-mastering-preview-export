export type Language = 'pt-BR' | 'en';

export interface Translations {
  // Header
  header: {
    tagline: string;
    studio: string;
  };
  
  // Auth
  auth: {
    login: string;
    logout: string;
    loggingIn: string;
  };
  
  // Profile Setup Modal
  profileSetup: {
    title: string;
    description: string;
    nameLabel: string;
    namePlaceholder: string;
    continueButton: string;
    saving: string;
  };
  
  // PWA Install
  pwaInstall: {
    install: string;
    installing: string;
  };
  
  // Landing Page
  landing: {
    hero: {
      title: string;
      titleHighlight: string;
      subtitle: string;
      getStarted: string;
    };
    workflow: {
      title: string;
      subtitle: string;
      step1Title: string;
      step1Description: string;
      step2Title: string;
      step2Description: string;
      step3Title: string;
      step3Description: string;
      step4Title: string;
      step4Description: string;
    };
    cta: {
      title: string;
      subtitle: string;
      button: string;
    };
  };
  
  // Studio Page
  studio: {
    title: string;
    subtitle: string;
    uploadSection: {
      title: string;
      button: string;
      dragDrop: string;
    };
    audioInfo: {
      title: string;
      duration: string;
      sampleRate: string;
      channels: string;
      mono: string;
      stereo: string;
    };
    presetSection: {
      title: string;
      description: string;
    };
    referenceSection: {
      title: string;
      description: string;
      loadButton: string;
      removeButton: string;
      loudnessMatching: string;
      loudnessMatchingHelp: string;
    };
    playback: {
      title: string;
      original: string;
      mastered: string;
      reference: string;
      play: string;
      pause: string;
    };
    export: {
      title: string;
      button: string;
      exporting: string;
    };
    toasts: {
      audioLoaded: string;
      audioLoadError: string;
      referenceLoaded: string;
      referenceLoadError: string;
      referenceLoadFirst: string;
      referenceRequired: string;
      presetApplied: string;
      presetApplyError: string;
      playbackError: string;
      exportSuccess: string;
      exportError: string;
      invalidFile: string;
    };
  };
  
  // Projects Panel
  projects: {
    title: string;
    subtitle: string;
    empty: string;
    emptyHint: string;
    deleteSuccess: string;
    deleteError: string;
  };
  
  // Help/FAQ
  help: {
    title: string;
    subtitle: string;
    faqs: Array<{
      question: string;
      answer: string;
    }>;
  };
  
  // Footer
  footer: {
    builtWith: string;
  };
  
  // Language Switcher
  language: {
    label: string;
    portuguese: string;
    english: string;
  };
}

export const translations: Record<Language, Translations> = {
  'pt-BR': {
    header: {
      tagline: 'Masterização de Áudio Profissional',
      studio: 'Estúdio',
    },
    auth: {
      login: 'Entrar',
      logout: 'Sair',
      loggingIn: 'Entrando...',
    },
    profileSetup: {
      title: 'Bem-vindo ao MasterTrack',
      description: 'Por favor, insira seu nome para completar a configuração do seu perfil.',
      nameLabel: 'Seu Nome',
      namePlaceholder: 'Digite seu nome',
      continueButton: 'Continuar',
      saving: 'Salvando...',
    },
    pwaInstall: {
      install: 'Baixar App',
      installing: 'Instalando...',
    },
    landing: {
      hero: {
        title: 'Masterização de Áudio Profissional',
        titleHighlight: 'No Seu Navegador',
        subtitle: 'Transforme suas faixas com presets de masterização de qualidade profissional. Faça upload, visualize e exporte masters com som profissional em minutos.',
        getStarted: 'Começar',
      },
      workflow: {
        title: 'Fluxo de Trabalho Simples em 4 Etapas',
        subtitle: 'Masterização profissional acessível. Sem software complexo ou plugins caros necessários.',
        step1Title: '1. Upload',
        step1Description: 'Selecione seu arquivo WAV ou MP3. Suportamos arquivos de até 50MB.',
        step2Title: '2. Escolha o Preset',
        step2Description: 'Selecione entre presets de masterização profissionais adaptados a diferentes estilos.',
        step3Title: '3. Visualizar',
        step3Description: 'Compare A/B sua faixa original com a versão masterizada em tempo real.',
        step4Title: '4. Exportar',
        step4Description: 'Baixe sua faixa masterizada profissionalmente como um arquivo WAV de alta qualidade.',
      },
      cta: {
        title: 'Pronto para Masterizar Sua Música?',
        subtitle: 'Junte-se a músicos e produtores que confiam no MasterTrack para masterização de áudio profissional.',
        button: 'Comece a Masterizar Agora',
      },
    },
    studio: {
      title: 'Estúdio de Masterização',
      subtitle: 'Faça upload da sua faixa, escolha um preset e masterize seu áudio',
      uploadSection: {
        title: 'Upload de Áudio',
        button: 'Selecionar Arquivo de Áudio',
        dragDrop: 'ou arraste e solte aqui',
      },
      audioInfo: {
        title: 'Informações do Áudio',
        duration: 'Duração',
        sampleRate: 'Taxa de Amostragem',
        channels: 'Canais',
        mono: 'Mono',
        stereo: 'Estéreo',
      },
      presetSection: {
        title: 'Escolha o Preset de Masterização',
        description: 'Selecione um preset que combine com o estilo da sua música',
      },
      referenceSection: {
        title: 'Modo Referência',
        description: 'Carregue uma faixa de referência profissional para comparar com sua saída masterizada',
        loadButton: 'Carregar Faixa de Referência',
        removeButton: 'Remover Referência',
        loudnessMatching: 'Correspondência de Volume',
        loudnessMatchingHelp: 'Ajusta automaticamente o volume da referência para corresponder à sua saída masterizada',
      },
      playback: {
        title: 'Reprodução',
        original: 'Original',
        mastered: 'Masterizado',
        reference: 'Referência',
        play: 'Reproduzir',
        pause: 'Pausar',
      },
      export: {
        title: 'Exportar',
        button: 'Exportar como WAV',
        exporting: 'Exportando',
      },
      toasts: {
        audioLoaded: 'Arquivo de áudio carregado com sucesso',
        audioLoadError: 'Falha ao carregar arquivo de áudio',
        referenceLoaded: 'Faixa de referência carregada com sucesso',
        referenceLoadError: 'Falha ao carregar arquivo de referência',
        referenceLoadFirst: 'Por favor, carregue seu arquivo de áudio primeiro',
        referenceRequired: 'Por favor, carregue uma faixa de referência primeiro',
        presetApplied: 'Preset aplicado',
        presetApplyError: 'Falha ao aplicar preset',
        playbackError: 'Erro de reprodução',
        exportSuccess: 'Exportação concluída com sucesso',
        exportError: 'Falha na exportação',
        invalidFile: 'Arquivo inválido',
      },
    },
    projects: {
      title: 'Seus Projetos',
      subtitle: 'Registros apenas de metadados (áudio não armazenado)',
      empty: 'Nenhum projeto ainda',
      emptyHint: 'Faça upload e masterize uma faixa para começar',
      deleteSuccess: 'Projeto excluído',
      deleteError: 'Falha ao excluir projeto',
    },
    help: {
      title: 'Ajuda & FAQ',
      subtitle: 'Perguntas comuns sobre masterização de áudio e nossa plataforma',
      faqs: [
        {
          question: 'Que resultados posso esperar?',
          answer: 'Nossos presets de masterização aplicam processamento de nível profissional incluindo EQ, compressão, saturação, aumento de largura estéreo e limitação. Os resultados dependem da qualidade do seu material de origem. Faixas bem gravadas verão a maior melhoria. Os presets são aproximações de cadeias de masterização profissionais e podem não corresponder à masterização de estúdio personalizada.',
        },
        {
          question: 'Quais são as limitações?',
          answer: 'O processamento acontece no seu navegador usando a API Web Audio. Faixas muito longas (mais de 10 minutos) ou arquivos grandes podem levar mais tempo para processar. Para melhores resultados, use arquivos de origem de alta qualidade (WAV preferido). Os presets de masterização são projetados para uso geral e podem não se adequar a todos os gêneros ou estilos de mixagem.',
        },
        {
          question: 'Meus dados de áudio são armazenados?',
          answer: 'Não. Todo o processamento de áudio acontece localmente no seu navegador. Armazenamos apenas metadados do projeto (nome da faixa, preset, timestamp) para sua conveniência. Seus arquivos de áudio reais e faixas de referência nunca são enviados para nossos servidores.',
        },
        {
          question: 'Qual preset devo escolher?',
          answer: 'Limpo: Masterização transparente para mixagens bem equilibradas. Quente: Adiciona calor e caráter analógico com saturação. Alto: Volume máximo para plataformas de streaming. Reforço de Graves: Graves aprimorados para gêneros pesados em baixo. Brilhante: Adiciona clareza e presença. Vintage: Som clássico de fita analógica com harmônicos ricos. Moderno: Som contemporâneo com estéreo amplo e impacto.',
        },
        {
          question: 'Como funciona o Modo Referência?',
          answer: 'O Modo Referência permite que você carregue uma faixa masterizada profissionalmente para comparar com sua saída masterizada. Use os botões A/B para alternar entre seu áudio masterizado e a faixa de referência. Isso ajuda você a entender como seu master se compara a lançamentos comerciais e orienta sua seleção de preset.',
        },
        {
          question: 'O que é Correspondência de Volume?',
          answer: 'A correspondência de volume ajusta automaticamente o volume da faixa de referência para corresponder ao volume percebido da sua saída masterizada. Isso facilita a comparação A/B removendo diferenças de volume. Nota: Este é um ajuste aproximado baseado em RMS e depende das características do seu áudio de origem. Não é uma medição verdadeira de LUFS/EBU R128.',
        },
      ],
    },
    footer: {
      builtWith: 'Feito com',
    },
    language: {
      label: 'Idioma',
      portuguese: 'Português',
      english: 'English',
    },
  },
  'en': {
    header: {
      tagline: 'Professional Audio Mastering',
      studio: 'Studio',
    },
    auth: {
      login: 'Login',
      logout: 'Logout',
      loggingIn: 'Logging in...',
    },
    profileSetup: {
      title: 'Welcome to MasterTrack',
      description: 'Please enter your name to complete your profile setup.',
      nameLabel: 'Your Name',
      namePlaceholder: 'Enter your name',
      continueButton: 'Continue',
      saving: 'Saving...',
    },
    pwaInstall: {
      install: 'Install App',
      installing: 'Installing...',
    },
    landing: {
      hero: {
        title: 'Professional Audio Mastering',
        titleHighlight: 'In Your Browser',
        subtitle: 'Transform your tracks with studio-quality mastering presets. Upload, preview, and export professional-sounding masters in minutes.',
        getStarted: 'Get Started',
      },
      workflow: {
        title: 'Simple 4-Step Workflow',
        subtitle: 'Professional mastering made accessible. No complex software or expensive plugins required.',
        step1Title: '1. Upload',
        step1Description: 'Select your WAV or MP3 file. We support files up to 50MB.',
        step2Title: '2. Choose Preset',
        step2Description: 'Select from professional mastering presets tailored to different styles.',
        step3Title: '3. Preview',
        step3Description: 'A/B compare your original track with the mastered version in real-time.',
        step4Title: '4. Export',
        step4Description: 'Download your professionally mastered track as a high-quality WAV file.',
      },
      cta: {
        title: 'Ready to Master Your Music?',
        subtitle: 'Join musicians and producers who trust MasterTrack for professional audio mastering.',
        button: 'Start Mastering Now',
      },
    },
    studio: {
      title: 'Mastering Studio',
      subtitle: 'Upload your track, choose a preset, and master your audio',
      uploadSection: {
        title: 'Upload Audio',
        button: 'Select Audio File',
        dragDrop: 'or drag and drop here',
      },
      audioInfo: {
        title: 'Audio Information',
        duration: 'Duration',
        sampleRate: 'Sample Rate',
        channels: 'Channels',
        mono: 'Mono',
        stereo: 'Stereo',
      },
      presetSection: {
        title: 'Choose Mastering Preset',
        description: 'Select a preset that matches your music style',
      },
      referenceSection: {
        title: 'Reference Mode',
        description: 'Load a professional reference track to compare with your mastered output',
        loadButton: 'Load Reference Track',
        removeButton: 'Remove Reference',
        loudnessMatching: 'Loudness Matching',
        loudnessMatchingHelp: 'Automatically adjusts reference volume to match your mastered output',
      },
      playback: {
        title: 'Playback',
        original: 'Original',
        mastered: 'Mastered',
        reference: 'Reference',
        play: 'Play',
        pause: 'Pause',
      },
      export: {
        title: 'Export',
        button: 'Export as WAV',
        exporting: 'Exporting',
      },
      toasts: {
        audioLoaded: 'Audio file loaded successfully',
        audioLoadError: 'Failed to load audio file',
        referenceLoaded: 'Reference track loaded successfully',
        referenceLoadError: 'Failed to load reference file',
        referenceLoadFirst: 'Please load your audio file first',
        referenceRequired: 'Please load a reference track first',
        presetApplied: 'Preset applied',
        presetApplyError: 'Failed to apply preset',
        playbackError: 'Playback error',
        exportSuccess: 'Export completed successfully',
        exportError: 'Export failed',
        invalidFile: 'Invalid file',
      },
    },
    projects: {
      title: 'Your Projects',
      subtitle: 'Metadata-only records (audio not stored)',
      empty: 'No projects yet',
      emptyHint: 'Upload and master a track to get started',
      deleteSuccess: 'Project deleted',
      deleteError: 'Failed to delete project',
    },
    help: {
      title: 'Help & FAQ',
      subtitle: 'Common questions about audio mastering and our platform',
      faqs: [
        {
          question: 'What results can I expect?',
          answer: 'Our mastering presets apply professional-grade processing including EQ, compression, saturation, stereo width enhancement, and limiting. Results depend on your source material quality. Well-recorded tracks will see the most improvement. Presets are approximations of professional mastering chains and may not match custom studio mastering.',
        },
        {
          question: 'What are the limitations?',
          answer: 'Processing happens in your browser using the Web Audio API. Very long tracks (over 10 minutes) or large files may take longer to process. For best results, use high-quality source files (WAV preferred). Mastering presets are designed for general use and may not suit all genres or mixing styles.',
        },
        {
          question: 'Is my audio data stored?',
          answer: 'No. All audio processing happens locally in your browser. We only store project metadata (track name, preset, timestamp) for your convenience. Your actual audio files and reference tracks are never uploaded to our servers.',
        },
        {
          question: 'Which preset should I choose?',
          answer: 'Clean: Transparent mastering for well-balanced mixes. Warm: Adds warmth and analog character with saturation. Loud: Maximum loudness for streaming platforms. Bass Boost: Enhanced low-end for bass-heavy genres. Bright: Adds clarity and presence. Vintage: Classic analog tape sound with rich harmonics. Modern: Contemporary sound with wide stereo and punch.',
        },
        {
          question: 'How does Reference Mode work?',
          answer: 'Reference Mode lets you load a professionally mastered track to compare with your mastered output. Use the A/B buttons to switch between your mastered audio and the reference track. This helps you understand how your master compares to commercial releases and guides your preset selection.',
        },
        {
          question: 'What is Loudness Matching?',
          answer: 'Loudness matching automatically adjusts the reference track volume to match the perceived loudness of your mastered output. This makes A/B comparison easier by removing volume differences. Note: This is an approximate adjustment based on RMS and depends on your source audio characteristics. It is not a true LUFS/EBU R128 measurement.',
        },
      ],
    },
    footer: {
      builtWith: 'Built with',
    },
    language: {
      label: 'Language',
      portuguese: 'Português',
      english: 'English',
    },
  },
};
