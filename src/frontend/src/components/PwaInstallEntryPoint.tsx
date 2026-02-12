import { Download } from 'lucide-react';
import { Button } from './ui/button';
import { usePwaInstallVisibility } from '../hooks/usePwaInstallVisibility';
import { useI18n } from '../i18n/useI18n';

export default function PwaInstallEntryPoint() {
  const { canInstall, isInstalling, promptInstall } = usePwaInstallVisibility();
  const { t } = useI18n();

  if (!canInstall) {
    return null;
  }

  return (
    <Button
      onClick={promptInstall}
      disabled={isInstalling}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Download className="h-4 w-4" />
      {isInstalling ? t.pwaInstall.installing : t.pwaInstall.install}
    </Button>
  );
}
