import { NAVIGATION_TEXT } from "./common/navigation";
import { HOME_TEXTS } from "./home";

export const TEXTS = {
  HOME: HOME_TEXTS,
  NAVIGATION: NAVIGATION_TEXT,
} as const;


export const COMMON_TEXTS = {
  NOTFOUND: {
    TITLE: 'Страница не найдена',
    DESCRIPTION: 'Извините, запрашиваемая страница не существует или была перемещена',
    BUTTON: 'Вернуться на главную',
  },
} as const;

export { NAVIGATION_TEXT, HOME_TEXTS };
