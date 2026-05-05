export const LOCALES = {
  ENGLISH: "en-US",
  RUSSIAN: "ru-RU", 
  JAPANESE: "jp-JP",
  GERMAN: "de-DE",
  CHINESE: "zh-CN",
  FRENCH: "fr-FR",
  ARABIC: "ar-SA"
} as const

export type Locale = (typeof LOCALES)[keyof typeof LOCALES]