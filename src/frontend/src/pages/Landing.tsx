import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useI18n } from '../i18n/useI18n';
import { Upload, Sliders, Play, Download, ArrowRight } from 'lucide-react';
import HelpFAQ from '../components/HelpFAQ';

export default function Landing() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const { t } = useI18n();
  const isAuthenticated = !!identity;

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate({ to: '/studio' });
    } else {
      document.querySelector<HTMLButtonElement>('[data-login-button]')?.click();
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 waveform-gradient opacity-10"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
                {t.landing.hero.title}
                <span className="block text-primary mt-2">{t.landing.hero.titleHighlight}</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t.landing.hero.subtitle}
              </p>
              <button
                onClick={handleGetStarted}
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-semibold text-lg shadow-lg hover:shadow-glow"
              >
                {t.landing.hero.getStarted}
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
            <div className="relative">
              <img 
                src="/assets/generated/mastering-hero.dim_1600x900.png" 
                alt="Audio Mastering Illustration" 
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            {t.landing.workflow.title}
          </h3>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            {t.landing.workflow.subtitle}
          </p>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">{t.landing.workflow.step1Title}</h4>
              <p className="text-muted-foreground">
                {t.landing.workflow.step1Description}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Sliders className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">{t.landing.workflow.step2Title}</h4>
              <p className="text-muted-foreground">
                {t.landing.workflow.step2Description}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Play className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">{t.landing.workflow.step3Title}</h4>
              <p className="text-muted-foreground">
                {t.landing.workflow.step3Description}
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <Download className="h-8 w-8 text-primary" />
              </div>
              <h4 className="text-xl font-semibold mb-2 text-foreground">{t.landing.workflow.step4Title}</h4>
              <p className="text-muted-foreground">
                {t.landing.workflow.step4Description}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Help/FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <HelpFAQ />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            {t.landing.cta.title}
          </h3>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t.landing.cta.subtitle}
          </p>
          <button
            onClick={handleGetStarted}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all font-semibold text-lg shadow-lg hover:shadow-glow"
          >
            {t.landing.cta.button}
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
