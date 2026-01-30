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
      },
      {
        ID: 2,
        NAME: "about.team.items.maria.name",
        ROLE: "about.team.items.maria.role",
        DESCRIPTION: "about.team.items.maria.description"
      },
      {
        ID: 3,
        NAME: "about.team.items.dmitry.name",
        ROLE: "about.team.items.dmitry.role",
        DESCRIPTION: "about.team.items.dmitry.description"
      }
    ]
  },
  TIMELINE: {
    TITLE: "about.timeline.title",
    ITEMS: [
      { 
        YEAR: "2021", 
        EVENT: "about.timeline.items.2021.event" 
      },
      { 
        YEAR: "2022", 
        EVENT: "about.timeline.items.2022.event" 
      },
      { 
        YEAR: "2023", 
        EVENT: "about.timeline.items.2023.event" 
      },
      { 
        YEAR: "2024", 
        EVENT: "about.timeline.items.2024.event" 
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