import { useState, useEffect } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useI18n } from '../../i18n/useI18n';
import { useGetCallerUserProfile, useSaveCallerUserProfile } from '../../hooks/useUserProfile';

export default function ProfileSetupModal() {
  const { identity } = useInternetIdentity();
  const { t } = useI18n();
  const isAuthenticated = !!identity;
  
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfileMutation = useSaveCallerUserProfile();
  
  const [name, setName] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;

  useEffect(() => {
    setIsOpen(showProfileSetup);
  }, [showProfileSetup]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await saveProfileMutation.mutateAsync({ name: name.trim() });
      setIsOpen(false);
      setName('');
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-lg shadow-2xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">{t.profileSetup.title}</h2>
        </div>
        
        <p className="text-muted-foreground mb-6">
          {t.profileSetup.description}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              {t.profileSetup.nameLabel}
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.profileSetup.namePlaceholder}
              className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
              required
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || saveProfileMutation.isPending}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveProfileMutation.isPending ? t.profileSetup.saving : t.profileSetup.continueButton}
          </button>
        </form>
      </div>
    </div>
  );
}
