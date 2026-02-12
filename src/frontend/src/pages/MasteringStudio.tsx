import { useState, useRef, useEffect } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useI18n } from '../i18n/useI18n';
import { presetTranslations } from '../i18n/presets';
import { useNavigate } from '@tanstack/react-router';
import { Upload, Play, Pause, Download, Loader2, AlertCircle, Music, X, Volume2 } from 'lucide-react';
import { toast } from 'sonner';
import { validateAudioFile, extractMetadata, type AudioMetadata } from '../audio/metadata';
import { MasteringEngine } from '../audio/engine';
import { MASTERING_PRESETS } from '../audio/presets';
import { exportToWav } from '../audio/wavExport';
import { useCreateProject, useGetAllProjects, useDeleteProject } from '../hooks/useProjects';
import ProjectsPanel from '../components/projects/ProjectsPanel';
import { Button } from '../components/ui/button';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';

export default function MasteringStudio() {
  const { identity } = useInternetIdentity();
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<AudioMetadata | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string>('clean');
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackMode, setPlaybackMode] = useState<'original' | 'mastered' | 'reference'>('original');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const [referenceFile, setReferenceFile] = useState<File | null>(null);
  const [referenceMetadata, setReferenceMetadata] = useState<AudioMetadata | null>(null);
  const [loudnessMatching, setLoudnessMatching] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const referenceInputRef = useRef<HTMLInputElement>(null);
  const engineRef = useRef<MasteringEngine | null>(null);

  const createProjectMutation = useCreateProject();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: '/' });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.dispose();
      }
    };
  }, []);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    
    const validation = validateAudioFile(file);
    if (!validation.valid) {
      setError(validation.error || t.studio.toasts.invalidFile);
      toast.error(validation.error || t.studio.toasts.invalidFile);
      return;
    }

    try {
      const meta = await extractMetadata(file);
      setAudioFile(file);
      setMetadata(meta);
      
      if (engineRef.current) {
        engineRef.current.dispose();
      }
      engineRef.current = new MasteringEngine();
      await engineRef.current.loadAudio(file);
      
      // Apply current preset if one is selected
      if (selectedPreset) {
        await engineRef.current.applyPreset(MASTERING_PRESETS[selectedPreset]);
      }
      
      toast.success(t.studio.toasts.audioLoaded);
    } catch (err) {
      const message = err instanceof Error ? err.message : t.studio.toasts.audioLoadError;
      setError(message);
      toast.error(message);
    }
  };

  const handleReferenceSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateAudioFile(file);
    if (!validation.valid) {
      toast.error(validation.error || t.studio.toasts.invalidFile);
      return;
    }

    try {
      if (!engineRef.current) {
        toast.error(t.studio.toasts.referenceLoadFirst);
        return;
      }

      await engineRef.current.loadReference(file);
      const meta = await extractMetadata(file);
      setReferenceFile(file);
      setReferenceMetadata(meta);
      
      toast.success(t.studio.toasts.referenceLoaded);
    } catch (err) {
      const message = err instanceof Error ? err.message : t.studio.toasts.referenceLoadError;
      toast.error(message);
    }
  };

  const handleRemoveReference = () => {
    if (engineRef.current) {
      engineRef.current.clearReference();
    }
    setReferenceFile(null);
    setReferenceMetadata(null);
    if (playbackMode === 'reference') {
      setPlaybackMode('mastered');
    }
    if (referenceInputRef.current) {
      referenceInputRef.current.value = '';
    }
  };

  const handleLoudnessMatchingToggle = (enabled: boolean) => {
    setLoudnessMatching(enabled);
    if (engineRef.current) {
      engineRef.current.setLoudnessMatching(enabled);
    }
  };

  const handlePresetChange = async (preset: string) => {
    setSelectedPreset(preset);
    if (engineRef.current && audioFile) {
      try {
        await engineRef.current.applyPreset(MASTERING_PRESETS[preset]);
        const presetName = presetTranslations[language][preset].name;
        toast.success(`${t.studio.toasts.presetApplied}: ${presetName}`);
        
        if (metadata) {
          createProjectMutation.mutate({
            trackName: metadata.filename,
            preset: preset
          });
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : t.studio.toasts.presetApplyError;
        toast.error(message);
      }
    }
  };

  const togglePlayback = async () => {
    if (!engineRef.current) return;

    try {
      if (isPlaying) {
        engineRef.current.pause();
        setIsPlaying(false);
      } else {
        await engineRef.current.play(playbackMode);
        setIsPlaying(true);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : t.studio.toasts.playbackError;
      toast.error(message);
      setIsPlaying(false);
    }
  };

  const switchPlaybackMode = async (mode: 'original' | 'mastered' | 'reference') => {
    if (!engineRef.current) return;
    
    if (mode === 'reference' && !referenceFile) {
      toast.error(t.studio.toasts.referenceRequired);
      return;
    }
    
    const wasPlaying = isPlaying;
    if (wasPlaying) {
      engineRef.current.pause();
    }
    
    setPlaybackMode(mode);
    
    if (wasPlaying) {
      try {
        await engineRef.current.play(mode);
      } catch (err) {
        const message = err instanceof Error ? err.message : t.studio.toasts.playbackError;
        toast.error(message);
        setIsPlaying(false);
      }
    }
  };

  const handleExport = async () => {
    if (!engineRef.current || !audioFile || !metadata) return;

    setIsExporting(true);
    setExportProgress(0);

    try {
      const blob = await exportToWav(
        engineRef.current,
        MASTERING_PRESETS[selectedPreset],
        (progress) => setExportProgress(progress)
      );

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${metadata.filename.replace(/\.[^/.]+$/, '')}_mastered.wav`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success(t.studio.toasts.exportSuccess);
    } catch (err) {
      const message = err instanceof Error ? err.message : t.studio.toasts.exportError;
      toast.error(message);
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const canPreview = audioFile && engineRef.current;
  const canExport = canPreview && selectedPreset;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {t.studio.title}
              </h1>
              <p className="text-muted-foreground">
                {t.studio.subtitle}
              </p>
            </div>

            {/* Upload Section */}
            <div className="bg-card rounded-lg border border-border p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                {t.studio.uploadSection.title}
              </h2>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/wav,audio/mp3,audio/mpeg"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                className="w-full mb-4"
              >
                <Upload className="h-4 w-4 mr-2" />
                {t.studio.uploadSection.button}
              </Button>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              {metadata && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Music className="h-4 w-4 text-primary" />
                    {t.studio.audioInfo.title}
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">{t.studio.audioInfo.duration}:</span>
                      <span className="ml-2 font-medium">{formatDuration(metadata.duration)}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t.studio.audioInfo.sampleRate}:</span>
                      <span className="ml-2 font-medium">{metadata.sampleRate} Hz</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t.studio.audioInfo.channels}:</span>
                      <span className="ml-2 font-medium">
                        {metadata.channels === 1 ? t.studio.audioInfo.mono : t.studio.audioInfo.stereo}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Preset Selection */}
            {audioFile && (
              <div className="bg-card rounded-lg border border-border p-6 mb-6">
                <h2 className="text-xl font-semibold mb-2">{t.studio.presetSection.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {t.studio.presetSection.description}
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Object.keys(MASTERING_PRESETS).map((key) => {
                    const presetTrans = presetTranslations[language][key];
                    return (
                      <button
                        key={key}
                        onClick={() => handlePresetChange(key)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedPreset === key
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <h3 className="font-semibold mb-1">{presetTrans.name}</h3>
                        <p className="text-xs text-muted-foreground">{presetTrans.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Reference Mode */}
            {audioFile && (
              <div className="bg-card rounded-lg border border-border p-6 mb-6">
                <h2 className="text-xl font-semibold mb-2">{t.studio.referenceSection.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {t.studio.referenceSection.description}
                </p>

                <input
                  ref={referenceInputRef}
                  type="file"
                  accept="audio/wav,audio/mp3,audio/mpeg"
                  onChange={handleReferenceSelect}
                  className="hidden"
                />

                {!referenceFile ? (
                  <Button
                    onClick={() => referenceInputRef.current?.click()}
                    variant="outline"
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {t.studio.referenceSection.loadButton}
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Music className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium">{referenceMetadata?.filename}</p>
                          {referenceMetadata && (
                            <p className="text-xs text-muted-foreground">
                              {formatDuration(referenceMetadata.duration)} • {referenceMetadata.sampleRate} Hz
                            </p>
                          )}
                        </div>
                      </div>
                      <Button
                        onClick={handleRemoveReference}
                        variant="ghost"
                        size="icon"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Volume2 className="h-5 w-5 text-primary" />
                        <div>
                          <Label htmlFor="loudness-matching" className="font-medium cursor-pointer">
                            {t.studio.referenceSection.loudnessMatching}
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            {t.studio.referenceSection.loudnessMatchingHelp}
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="loudness-matching"
                        checked={loudnessMatching}
                        onCheckedChange={handleLoudnessMatchingToggle}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Playback Controls */}
            {canPreview && (
              <div className="bg-card rounded-lg border border-border p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">{t.studio.playback.title}</h2>
                
                <div className="flex gap-3 mb-4">
                  <Button
                    onClick={() => switchPlaybackMode('original')}
                    variant={playbackMode === 'original' ? 'default' : 'outline'}
                    className="flex-1"
                  >
                    {t.studio.playback.original}
                  </Button>
                  <Button
                    onClick={() => switchPlaybackMode('mastered')}
                    variant={playbackMode === 'mastered' ? 'default' : 'outline'}
                    className="flex-1"
                  >
                    {t.studio.playback.mastered}
                  </Button>
                  {referenceFile && (
                    <Button
                      onClick={() => switchPlaybackMode('reference')}
                      variant={playbackMode === 'reference' ? 'default' : 'outline'}
                      className="flex-1"
                    >
                      {t.studio.playback.reference}
                    </Button>
                  )}
                </div>

                <Button
                  onClick={togglePlayback}
                  size="lg"
                  className="w-full"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="h-5 w-5 mr-2" />
                      {t.studio.playback.pause}
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      {t.studio.playback.play}
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Export Section */}
            {canExport && (
              <div className="bg-card rounded-lg border border-border p-6">
                <h2 className="text-xl font-semibold mb-4">{t.studio.export.title}</h2>
                
                <Button
                  onClick={handleExport}
                  disabled={isExporting}
                  size="lg"
                  className="w-full"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      {t.studio.export.exporting} {Math.round(exportProgress)}%
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5 mr-2" />
                      {t.studio.export.button}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Projects Panel */}
          <div className="w-80">
            <ProjectsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
