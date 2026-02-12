import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet, useNavigate } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { I18nProvider } from './i18n/I18nProvider';
import { useI18n } from './i18n/useI18n';
import Landing from './pages/Landing';
import MasteringStudio from './pages/MasteringStudio';
import LoginButton from './components/auth/LoginButton';
import ProfileSetupModal from './components/auth/ProfileSetupModal';
import LanguageSwitcher from './components/i18n/LanguageSwitcher';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { Music2, Heart } from 'lucide-react';

function Layout() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { t } = useI18n();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <button 
            onClick={() => navigate({ to: '/' })}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <img 
              src="/assets/generated/mastering-logo.dim_512x512.png" 
              alt="MasterTrack Logo" 
              className="h-10 w-10"
            />
            <div className="flex flex-col items-start">
              <h1 className="text-xl font-bold text-foreground">MasterTrack</h1>
              <p className="text-xs text-muted-foreground">{t.header.tagline}</p>
            </div>
          </button>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => navigate({ to: '/studio' })}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
              >
                <Music2 className="h-4 w-4" />
                {t.header.studio}
              </button>
            )}
            <LanguageSwitcher />
            <LoginButton />
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        <Outlet />
      </main>
      
      <footer className="border-t border-border bg-card/30 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MasterTrack. {t.footer.builtWith} <Heart className="inline h-4 w-4 text-red-500" /> usando{' '}
            <a 
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
      
      <ProfileSetupModal />
    </div>
  );
}

const rootRoute = createRootRoute({
  component: Layout
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Landing
});

const studioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/studio',
  component: MasteringStudio
});

const routeTree = rootRoute.addChildren([indexRoute, studioRoute]);

const router = createRouter({ routeTree });

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <I18nProvider>
        <RouterProvider router={router} />
        <Toaster />
      </I18nProvider>
    </ThemeProvider>
  );
}
