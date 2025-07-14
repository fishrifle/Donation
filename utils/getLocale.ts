import { enUS, fr, es, de, it, ptBR, ja, ko, zhCN } from "date-fns/locale";
import { Locale } from "date-fns";

export interface LocaleInfo {
  locale: Locale;
  label: string;
  flag: string;
}

/**
 * Maps browser language code to date-fns locale, label, and flag emoji.
 * Explicitly returns fallback text if no match.
 */
export default function getLocale(langCode: string): LocaleInfo {
  if (langCode.startsWith("fr")) return { locale: fr, label: "Français", flag: "🇫🇷" };
  if (langCode.startsWith("es")) return { locale: es, label: "Español", flag: "🇪🇸" };
  if (langCode.startsWith("de")) return { locale: de, label: "Deutsch", flag: "🇩🇪" };
  if (langCode.startsWith("it")) return { locale: it, label: "Italiano", flag: "🇮🇹" };
  if (langCode.startsWith("pt")) return { locale: ptBR, label: "Português (BR)", flag: "🇧🇷" };
  if (langCode.startsWith("ja")) return { locale: ja, label: "日本語", flag: "🇯🇵" };
  if (langCode.startsWith("ko")) return { locale: ko, label: "한국어", flag: "🇰🇷" };
  if (langCode.startsWith("zh")) return { locale: zhCN, label: "中文 (简体)", flag: "🇨🇳" };
  // Explicit fallback
  return { locale: enUS, label: "English (US) — fallback", flag: "🇺🇸" };
}
