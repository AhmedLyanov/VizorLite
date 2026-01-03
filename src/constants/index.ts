import { NAVIGATION_TEXT } from "./common/navigation";
import { HOME_TEXTS } from "./home";
import { PRICING_TEXTS } from "./pricing";
import { ABOUT_TEXTS } from "./about"; 

export const TEXTS = {
  HOME: HOME_TEXTS,
  NAVIGATION: NAVIGATION_TEXT,
  PRICING: PRICING_TEXTS,
  ABOUT: ABOUT_TEXTS, 
} as const;

export const COMMON_TEXTS = {
  NOTFOUND: {
    TITLE: 'Страница не найдена',
    DESCRIPTION: 'Извините, запрашиваемая страница не существует или была перемещена',
    BUTTON: 'Вернуться на главную',
  },
} as const;

export { NAVIGATION_TEXT, HOME_TEXTS, PRICING_TEXTS, ABOUT_TEXTS };