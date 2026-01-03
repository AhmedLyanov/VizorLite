export const ABOUT_TEXTS = {
  HERO: {
    TITLE: "О VizorLite",
    SUBTITLE: "Мы делаем видеоконференции простыми, доступными и безопасными для каждого",
  },
  MISSION: {
    TITLE: "Наша миссия",
    DESCRIPTION: "Сломать барьеры в онлайн-общении. Мы верим, что качественная видеосвязь должна быть бесплатной, безопасной и доступной без скачиваний и регистраций.",
  },
  VALUES: {
    TITLE: "Наши ценности",
    ITEMS: [
      {
        ICON: "videoconference.svg",
        TITLE: "Доступность",
        DESCRIPTION: "Сделали видеосвязь простой и бесплатной для всех"
      },
      {
        ICON: "webcamera.svg",
        TITLE: "Конфиденциальность",
        DESCRIPTION: "Ваши разговоры остаются между участниками"
      },
      {
        ICON: "check.svg",
        TITLE: "Простота",
        DESCRIPTION: "Никаких установок, регистраций и сложных настроек"
      }
    ]
  },
  STATS: {
    TITLE: "VizorLite в цифрах",
    ITEMS: [
      { VALUE: "50K+", LABEL: "пользователей" },
      { VALUE: "1M+", LABEL: "минут звонков" },
      { VALUE: "99%", LABEL: "стабильность" },
      { VALUE: "24/7", LABEL: "поддержка" }
    ]
  },
  TEAM: {
    TITLE: "Наша команда",
    ITEMS: [
      {
        ID: 1,
        NAME: "Алексей Петров",
        ROLE: "Основатель & CEO",
        DESCRIPTION: "10+ лет в веб-разработке. Создал VizorLite чтобы сделать видеоконференции доступными каждому."
      },
      {
        ID: 2,
        NAME: "Мария Сидорова",
        ROLE: "Lead Developer",
        DESCRIPTION: "Специалист по WebRTC и реальному времени. Отвечает за стабильность и качество соединений."
      },
      {
        ID: 3,
        NAME: "Дмитрий Иванов",
        ROLE: "UI/UX Дизайнер",
        DESCRIPTION: "Создает интуитивные интерфейсы. Верит, что технологии должны быть красивыми и простыми."
      }
    ]
  },
  TIMELINE: {
    TITLE: "Наш путь",
    ITEMS: [
      { YEAR: "2021", EVENT: "Идея и первый прототип" },
      { YEAR: "2022", EVENT: "Запуск закрытого бета-тестирования" },
      { YEAR: "2023", EVENT: "Публичный релиз VizorLite" },
      { YEAR: "2024", EVENT: "Достигли 50K активных пользователей" }
    ]
  },
  CTA: {
    TITLE: "Начните использовать прямо сейчас",
    DESCRIPTION: "Присоединяйтесь к тысячам пользователей, которые уже общаются через VizorLite",
    BUTTON_TEXT: "Создать комнату"
  },
  BOTTOM_LINKS: {
    ITEMS: [
      { PATH: "/", LABEL: "Главная", ICON: "home.svg" },
      { PATH: "/pricing", LABEL: "Тарифы", ICON: "dollar.svg" },
      { PATH: "/about", LABEL: "О нас", ICON: "question.svg" },
      { HREF: "mailto:support@vizorlite.com", LABEL: "Контакты", ICON: "send.svg" }
    ]
  }
} as const;