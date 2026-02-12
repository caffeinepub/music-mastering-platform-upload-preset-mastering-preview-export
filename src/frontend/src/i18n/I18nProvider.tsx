import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { translations, type Language, type Translations } from './translations';

interface I18nContextValue {
  language: Language;
  locale: string;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

const STORAGE_KEY = 'mastertrack-language';

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    // Try to load from localStorage
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'pt-BR' || stored === 'en') {
      return stored;
    }
    // Default to Portuguese
    return 'pt-BR';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  const locale = language === 'pt-BR' ? 'pt-BR' : 'en-US';
  const t = translations[language];

  return (
    <I18nContext.Provider value={{ language, locale, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18nContext() {
  const context = React.useContext(I18nContext);
  if (!context) {
    throw new Error('useI18nContext must be used within I18nProvider');
  }
  return context;
}
