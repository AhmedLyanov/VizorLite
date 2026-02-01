    export const LOCALES = {
        ENGLISH: "en-US",
        RUSSIAN: "ru-RU", 
        JAPANESE: "jp-JP",
        GERMAN: "de-DE"
    } as const

    export type Locale = (typeof LOCALES)[keyof typeof LOCALES]
