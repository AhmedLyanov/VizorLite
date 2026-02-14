import { LOCALES } from "./locales";
import { enMessages } from "./messages/en-US";
import { ruMessages } from "./messages/ru-RU";
import { deMessages } from "./messages/de-DE";
import { jpMessages } from "./messages/jp-JP";
import { zhMessages } from "./messages/zh-CN";
import { frMessages } from "./messages/fr-FR";
import { arMessages } from "./messages/ar-SA";

export const messages = {
  [LOCALES.ENGLISH]: enMessages,
  [LOCALES.RUSSIAN]: ruMessages,
  [LOCALES.GERMAN]: deMessages,
  [LOCALES.JAPANESE]: jpMessages,
  [LOCALES.CHINESE]: zhMessages,
  [LOCALES.FRENCH]: frMessages,
  [LOCALES.ARABIC]: arMessages,
} as const;

export type Messages = typeof messages;
export type MessageKey = keyof typeof enMessages;