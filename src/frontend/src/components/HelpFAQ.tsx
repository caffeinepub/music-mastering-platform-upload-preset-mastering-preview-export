import { HelpCircle } from 'lucide-react';
import { useI18n } from '../i18n/useI18n';

export default function HelpFAQ() {
  const { t } = useI18n();

  return (
    <div className="max-w-4xl mx-auto">
      <h3 className="text-3xl font-bold text-center mb-4 flex items-center justify-center gap-3">
        <HelpCircle className="h-8 w-8 text-primary" />
        {t.help.title}
      </h3>
      <p className="text-center text-muted-foreground mb-12">
        {t.help.subtitle}
      </p>
      
      <div className="space-y-6">
        {t.help.faqs.map((faq, index) => (
          <div key={index} className="bg-card rounded-lg border border-border p-6">
            <h4 className="text-lg font-semibold mb-3 text-foreground">{faq.question}</h4>
            <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
