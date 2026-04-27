export interface PhoneFormat {
  pattern: RegExp;
  placeholder: string;
  mask: (value: string) => string;
  example: string;
  errorMessage: string;
}

export interface CountryOption {
  code: string;        
  name: string;         
  nameNative: string;   
  flag: string;        
  locale: string;      
  phoneFormat: PhoneFormat;
}

type PhoneFormatsMap = Record<string, PhoneFormat>;


const enUSFormat: PhoneFormat = {
  pattern: /^\+1 \(\d{3}\) \d{3}-\d{4}$/,
  placeholder: "+1 (555) 123-4567",
  mask: (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    let result = "+1";
    if (digits.length > 1) result += " (" + digits.slice(1, 4);
    if (digits.length >= 4) result += ") " + digits.slice(4, 7);
    if (digits.length >= 7) result += "-" + digits.slice(7, 11);
    return result;
  },
  example: "+1 (555) 123-4567",
  errorMessage: "Format: +1 (555) 123-4567",
};


const ruRUFormat: PhoneFormat = {
  pattern: /^0 \(\d{3}\) \d{3} \d{2}-\d{2}$/,
  placeholder: "0 (999) 123 45-67",
  mask: (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    let result = "0";
    if (digits.length > 1) result += " (" + digits.slice(1, 4);
    if (digits.length >= 4) result += ") " + digits.slice(4, 7);
    if (digits.length >= 7) result += " " + digits.slice(7, 9);
    if (digits.length >= 9) result += "-" + digits.slice(9, 11);
    return result;
  },
  example: "0 (999) 123 45-67",
  errorMessage: "Формат: 0 (999) 123 45-67",
};

const jpJPFormat: PhoneFormat = {
  pattern: /^0\d-\d{4}-\d{4}$/,
  placeholder: "090-1234-5678",
  mask: (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    let result = "";
    if (digits.length > 0) result += digits.slice(0, 3);
    if (digits.length >= 3) result += "-" + digits.slice(3, 7);
    if (digits.length >= 7) result += "-" + digits.slice(7, 11);
    return result;
  },
  example: "090-1234-5678",
  errorMessage: "形式: 090-1234-5678",
};


const deDEFormat: PhoneFormat = {
  pattern: /^\+49 \d{3} \d{4}-\d{4}$/,
  placeholder: "+49 151 1234-5678",
  mask: (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 12);
    let result = "+49";
    if (digits.length > 2) result += " " + digits.slice(2, 5);
    if (digits.length >= 5) result += " " + digits.slice(5, 9);
    if (digits.length >= 9) result += "-" + digits.slice(9, 13);
    return result;
  },
  example: "+49 151 1234-5678",
  errorMessage: "Format: +49 151 1234-5678",
};


const zhCNFormat: PhoneFormat = {
  pattern: /^1[3-9]\d{9}$/,
  placeholder: "138 1234 5678",
  mask: (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    let result = "";
    if (digits.length > 0) result += digits.slice(0, 3);
    if (digits.length >= 3) result += " " + digits.slice(3, 7);
    if (digits.length >= 7) result += " " + digits.slice(7, 11);
    return result;
  },
  example: "138 1234 5678",
  errorMessage: "格式: 138 1234 5678",
};


const frFRFormat: PhoneFormat = {
  pattern: /^\+33 [67]\d \d{2} \d{2} \d{2}$/,
  placeholder: "+33 6 12 34 56 78",
  mask: (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    let result = "+33";
    if (digits.length > 0) result += " " + digits.slice(0, 1);
    if (digits.length >= 1) result += " " + digits.slice(1, 3);
    if (digits.length >= 3) result += " " + digits.slice(3, 5);
    if (digits.length >= 5) result += " " + digits.slice(5, 7);
    if (digits.length >= 7) result += " " + digits.slice(7, 9);
    return result;
  },
  example: "+33 6 12 34 56 78",
  errorMessage: "Format: +33 6 12 34 56 78",
};


const arSAFormat: PhoneFormat = {
  pattern: /^05\d{8}$/,
  placeholder: "05X 123 4567",
  mask: (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 10);
    let result = "";
    if (digits.length > 0) result += digits.slice(0, 2);
    if (digits.length >= 2) result += " " + digits.slice(2, 5);
    if (digits.length >= 5) result += " " + digits.slice(5, 10);
    return result;
  },
  example: "05X 123 4567",
  errorMessage: "التنسيق: 05X 123 4567",
};


export const PHONE_FORMATS: PhoneFormatsMap = {
  "en-US": enUSFormat,
  "ru-RU": ruRUFormat,
  "jp-JP": jpJPFormat,
  "de-DE": deDEFormat,
  "zh-CN": zhCNFormat,
  "fr-FR": frFRFormat,
  "ar-SA": arSAFormat,
};


export const COUNTRIES: CountryOption[] = [
  {
    code: "US",
    name: "United States",
    nameNative: "United States",
    flag: "🇺🇸",
    locale: "en-US",
    phoneFormat: enUSFormat,
  },
  {
    code: "RU",
    name: "Russia",
    nameNative: "Россия",
    flag: "🇷🇺",
    locale: "ru-RU",
    phoneFormat: ruRUFormat,
  },
  {
    code: "JP",
    name: "Japan",
    nameNative: "日本",
    flag: "🇯🇵",
    locale: "jp-JP",
    phoneFormat: jpJPFormat,
  },
  {
    code: "DE",
    name: "Germany",
    nameNative: "Deutschland",
    flag: "🇩🇪",
    locale: "de-DE",
    phoneFormat: deDEFormat,
  },
  {
    code: "CN",
    name: "China",
    nameNative: "中国",
    flag: "🇨🇳",
    locale: "zh-CN",
    phoneFormat: zhCNFormat,
  },
  {
    code: "FR",
    name: "France",
    nameNative: "France",
    flag: "🇫🇷",
    locale: "fr-FR",
    phoneFormat: frFRFormat,
  },
  {
    code: "SA",
    name: "Saudi Arabia",
    nameNative: "المملكة العربية السعودية",
    flag: "🇸🇦",
    locale: "ar-SA",
    phoneFormat: arSAFormat,
  },
];


export const getPhoneFormat = (locale: string): PhoneFormat => {
  return PHONE_FORMATS[locale] || enUSFormat;
};

export const getCountryByCode = (code: string): CountryOption | undefined => {
  return COUNTRIES.find((c) => c.code === code);
};

export const getCountryByLocale = (locale: string): CountryOption | undefined => {
  return COUNTRIES.find((c) => c.locale === locale);
};