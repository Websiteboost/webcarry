import { useState, useEffect, useCallback } from 'react';

export type Locale = 'en' | 'es';

const COOKIE_NAME = 'bb_lang';

function readLangCookie(): Locale {
  try {
    const match = document.cookie.match(/bb_lang=([^;]+)/);
    if (match?.[1] === 'ES') return 'es';
  } catch { /* storage blocked */ }
  return 'en';
}

/**
 * Hook for reading and writing the language preference cookie.
 * Always initialises to 'en' (SSR-safe) and corrects in useEffect to avoid
 * hydration mismatches with server-rendered HTML.
 *
 * Changing locale writes the cookie and reloads the page so Astro re-fetches
 * all content from the DB in the selected language.
 */
export function useLanguage() {
  // Start with 'en' — matches the SSR default so there's no hydration flash
  const [locale, setLocale] = useState<Locale>('en');

  useEffect(() => {
    setLocale(readLangCookie());
  }, []);

  const changeLocale = useCallback((next: Locale) => {
    const cookieValue = next === 'es' ? 'ES' : 'EN';
    document.cookie = `${COOKIE_NAME}=${cookieValue};path=/;max-age=31536000;SameSite=Lax`;
    window.location.reload();
  }, []);

  return { locale, changeLocale };
}
