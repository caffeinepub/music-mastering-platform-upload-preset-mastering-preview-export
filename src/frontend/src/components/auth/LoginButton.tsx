import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useI18n } from '../../i18n/useI18n';
import { useQueryClient } from '@tanstack/react-query';
import { LogIn, LogOut, Loader2 } from 'lucide-react';

export default function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const { t } = useI18n();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <button
      onClick={handleAuth}
      disabled={disabled}
      data-login-button
      className={`flex items-center gap-2 px-6 py-2 rounded-lg transition-all font-medium ${
        isAuthenticated
          ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
          : 'bg-primary text-primary-foreground hover:bg-primary/90'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {disabled ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {t.auth.loggingIn}
        </>
      ) : isAuthenticated ? (
        <>
          <LogOut className="h-4 w-4" />
          {t.auth.logout}
        </>
      ) : (
        <>
          <LogIn className="h-4 w-4" />
          {t.auth.login}
        </>
      )}
    </button>
  );
}
