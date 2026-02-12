import { useGetAllProjects, useDeleteProject } from '../../hooks/useProjects';
import { useI18n } from '../../i18n/useI18n';
import { presetTranslations } from '../../i18n/presets';
import { Trash2, Clock, Disc, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ProjectsPanel() {
  const { data: projects, isLoading } = useGetAllProjects();
  const deleteProjectMutation = useDeleteProject();
  const { t, locale, language } = useI18n();

  const handleDelete = async (id: string) => {
    try {
      await deleteProjectMutation.mutateAsync(id);
      toast.success(t.projects.deleteSuccess);
    } catch (error) {
      toast.error(t.projects.deleteError);
    }
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString(locale, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPresetDisplayName = (presetKey: string): string => {
    // Try to get localized preset name
    if (presetTranslations[language][presetKey]) {
      return presetTranslations[language][presetKey].name;
    }
    // Fallback to the key itself (for legacy or unknown presets)
    return presetKey;
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6 sticky top-24">
      <h2 className="text-2xl font-bold mb-4">{t.projects.title}</h2>
      <p className="text-sm text-muted-foreground mb-4">
        {t.projects.subtitle}
      </p>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : projects && projects.length > 0 ? (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {projects.map((project) => (
            <div
              key={project.id}
              className="p-4 bg-muted/50 rounded-lg border border-border hover:border-primary/50 transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-sm truncate flex-1">{project.trackName}</h3>
                <button
                  onClick={() => handleDelete(project.id)}
                  disabled={deleteProjectMutation.isPending}
                  className="text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Disc className="h-3 w-3" />
                  <span>{getPresetDisplayName(project.preset)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(project.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">{t.projects.empty}</p>
          <p className="text-xs mt-1">{t.projects.emptyHint}</p>
        </div>
      )}
    </div>
  );
}
