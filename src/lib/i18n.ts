/**
 * i18n helpers — locale resolution layer for SSR + React islands.
 * Cookie: bb_lang = "EN" | "ES"  (written by LanguageSelector client-side)
 */
import type { AstroCookies } from 'astro';

export type Locale = 'en' | 'es';

/**
 * Reads the bb_lang cookie on the server (Astro request context).
 * Defaults to 'en' if the cookie is absent or has an unrecognised value.
 */
export function readLocaleCookie(cookies: AstroCookies): Locale {
  const val = cookies.get('bb_lang')?.value;
  return val === 'ES' ? 'es' : 'en';
}

/**
 * Returns the Spanish version if locale === 'es' AND the Spanish string is
 * non-null / non-empty. Otherwise falls back to the English version.
 */
export function t(
  en: string | null | undefined,
  es: string | null | undefined,
  locale: Locale,
): string {
  if (locale === 'es' && es != null && es.trim() !== '') return es.trim();
  return (en ?? '').trim();
}

/**
 * Array variant of t() — used for description[] / service_points[].
 */
export function tArray(
  en: string[] | null | undefined,
  es: string[] | null | undefined,
  locale: Locale,
): string[] {
  if (locale === 'es' && es != null && es.length > 0) return es;
  return en ?? [];
}

/**
 * Merges config_es (Spanish text overrides) onto config (English base) for
 * service_prices JSONB. Never throws — returns original config on any error.
 *
 * config_es only carries translatable text keys (suffix _es). Numeric values
 * (prices, ranges, steps) are NOT present in config_es and are kept from config.
 */
export function mergeConfigEs(
  type: string,
  config: any,
  configEs: any,
  locale: Locale,
): any {
  if (locale === 'en' || !configEs) return config;

  try {
    // Deep-clone to avoid mutating the original
    const merged = JSON.parse(JSON.stringify(config));

    switch (type) {
      case 'bar':
        if (configEs.label_es) merged.label = configEs.label_es;
        break;

      case 'box':
        if (Array.isArray(merged.options) && Array.isArray(configEs.options)) {
          merged.options = merged.options.map((opt: any, i: number) => {
            const es = configEs.options?.[i];
            return es?.label_es ? { ...opt, label: es.label_es } : opt;
          });
        }
        break;

      case 'boxtitle':
        if (Array.isArray(merged.options) && Array.isArray(configEs.options)) {
          merged.options = merged.options.map((opt: any, i: number) => {
            const es = configEs.options?.[i];
            if (!es) return opt;
            return {
              ...opt,
              ...(es.label_es && { label: es.label_es }),
              ...(es.data_es  && { data:  es.data_es  }),
            };
          });
        }
        break;

      case 'selectors':
        for (const key of Object.keys(merged)) {
          const esOptions = configEs[key];
          if (!Array.isArray(merged[key]) || !Array.isArray(esOptions)) continue;
          merged[key] = merged[key].map((opt: any, i: number) => {
            const es = esOptions[i];
            return es?.label_es ? { ...opt, label: es.label_es } : opt;
          });
        }
        break;

      case 'additional':
        if (configEs.title_es) merged.title = configEs.title_es;
        if (merged.options && configEs.options) {
          for (const key of Object.keys(merged.options)) {
            if (configEs.options[key]) merged.options[key].label = configEs.options[key];
          }
        }
        break;

      case 'custom':
        if (configEs.label_es) merged.label = configEs.label_es;
        if (Array.isArray(merged.presets) && Array.isArray(configEs.presets)) {
          merged.presets = merged.presets.map((p: any, i: number) => {
            const es = configEs.presets?.[i];
            return es?.label_es ? { ...p, label: es.label_es } : p;
          });
        }
        break;

      case 'labeltitle':
      case 'group':
        if (configEs.title_es) merged.title = configEs.title_es;
        break;
    }

    return merged;
  } catch {
    // Safety net — never break the frontend due to a bad config_es
    return config;
  }
}
