export const LOCALES = {
    ENGLISH: "en-US",
    RUSSIAN: "ru-RU"
} as const

export type Locale = (typeof LOCALES)[keyof typeof LOCALES]
