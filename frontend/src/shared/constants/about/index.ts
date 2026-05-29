export const ABOUT_TEXTS = {
  HERO: {
    TITLE: "about.hero.title",
    SUBTITLE: "about.hero.subtitle",
  },
  MISSION: {
    TITLE: "about.mission.title",
    DESCRIPTION: "about.mission.description",
  },
  VALUES: {
    TITLE: "about.values.title",
    ITEMS: [
      {
        ICON: "about.values.items.accessibility.icon",
        TITLE: "about.values.items.accessibility.title",
        DESCRIPTION: "about.values.items.accessibility.description"
      },
      {
        ICON: "about.values.items.confidentiality.icon",
        TITLE: "about.values.items.confidentiality.title",
        DESCRIPTION: "about.values.items.confidentiality.description"
      },
      {
        ICON: "about.values.items.simplicity.icon",
        TITLE: "about.values.items.simplicity.title",
        DESCRIPTION: "about.values.items.simplicity.description"
      }
    ]
  },
  STATS: {
    TITLE: "about.stats.title",
    ITEMS: [
      { 
        VALUE: "about.stats.items.users.value", 
        LABEL: "about.stats.items.users.label" 
      },
      { 
        VALUE: "about.stats.items.minutes.value", 
        LABEL: "about.stats.items.minutes.label" 
      },
      { 
        VALUE: "about.stats.items.stability.value", 
        LABEL: "about.stats.items.stability.label" 
      },
      { 
        VALUE: "about.stats.items.support.value", 
        LABEL: "about.stats.items.support.label" 
      }
    ]
  },
  TEAM: {
    TITLE: "about.team.title",
    ITEMS: [
      {
        ID: 1,
        NAME: "about.team.items.alexey.name",
        ROLE: "about.team.items.alexey.role",
        DESCRIPTION: "about.team.items.alexey.description"
      }
    ]
  },
  TIMELINE: {
    TITLE: "about.timeline.title",
    ITEMS: [
      {
        DAY: "1",
        YEAR: "2026",
        MONTH_KEY: "about.timeline.months.january",
        EVENT: "about.timeline.items.2026.january.start.event"
      },
      {
        DAY: "24",
        YEAR: "2026",
        MONTH_KEY: "about.timeline.months.may",
        EVENT: "about.timeline.items.2026.05.24.styles.event"
      },
      {
        DAY: "24",
        YEAR: "2026",
        MONTH_KEY: "about.timeline.months.may",
        EVENT: "about.timeline.items.2026.05.24.pro.event"
      },
      {
        DAY: "25",
        YEAR: "2026",
        MONTH_KEY: "about.timeline.months.may",
        EVENT: "about.timeline.items.2026.05.25.guide.event"
      },
      {
        DAY: "25",
        YEAR: "2026",
        MONTH_KEY: "about.timeline.months.may",
        EVENT: "about.timeline.items.2026.05.25.content.event"
      },
      {
        DAY: "25",
        YEAR: "2026",
        MONTH_KEY: "about.timeline.months.may",
        EVENT: "about.timeline.items.2026.05.25.settings.event"
      }
    ]
  },
  CTA: {
    TITLE: "about.cta.title",
    DESCRIPTION: "about.cta.description",
    BUTTON_TEXT: "about.cta.buttonText"
  },
  BOTTOM_LINKS: {
    ITEMS: [
      { 
        PATH: "/", 
        LABEL: "about.bottomLinks.items.home.label", 
        ICON: "about.bottomLinks.items.home.icon" 
      },
      { 
        PATH: "/pricing", 
        LABEL: "about.bottomLinks.items.pricing.label", 
        ICON: "about.bottomLinks.items.pricing.icon" 
      },
      { 
        PATH: "/about", 
        LABEL: "about.bottomLinks.items.about.label", 
        ICON: "about.bottomLinks.items.about.icon" 
      },
      { 
        HREF: "mailto:support@vizorlite.com", 
        LABEL: "about.bottomLinks.items.contacts.label", 
        ICON: "about.bottomLinks.items.contacts.icon" 
      }
    ]
  }
} as const;