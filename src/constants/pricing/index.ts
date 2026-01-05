export const PRICING_TEXTS = {
  TITLE: "pricing.title",
  SUBTITLE: "pricing.subtitle",
  RECOMMENDED: "pricing.recommended",
  SELECT_BUTTON: "pricing.selectButton",
  
  PLANS: {
    BASIC: {
      NAME: "pricing.plans.basic.name",
      PRICE: "pricing.plans.basic.price",
      PERIOD: "pricing.plans.basic.period",
      FEATURES: [
        "pricing.plans.basic.features.participants",
        "pricing.plans.basic.features.time",
        "pricing.plans.basic.features.chat",
        "pricing.plans.basic.features.support"
      ]
    },
    BUSINESS: {
      NAME: "pricing.plans.business.name",
      PRICE: "pricing.plans.business.price",
      PERIOD: "pricing.plans.business.period",
      FEATURES: [
        "pricing.plans.business.features.participants",
        "pricing.plans.business.features.time",
        "pricing.plans.business.features.recording",
        "pricing.plans.business.features.settings",
        "pricing.plans.business.features.support",
        "pricing.plans.business.features.storage"
      ]
    },
    PREMIUM: {
      NAME: "pricing.plans.premium.name",
      PRICE: "pricing.plans.premium.price",
      PERIOD: "pricing.plans.premium.period",
      FEATURES: [
        "pricing.plans.premium.features.participants",
        "pricing.plans.premium.features.time",
        "pricing.plans.premium.features.recording",
        "pricing.plans.premium.features.branding",
        "pricing.plans.premium.features.manager",
        "pricing.plans.premium.features.storage",
        "pricing.plans.premium.features.analytics"
      ]
    }
  },
  
  FAQ: {
    TITLE: "pricing.faq.title",
    ITEMS: [
      {
        question: "pricing.faq.items.0.question",
        answer: "pricing.faq.items.0.answer"
      },
      {
        question: "pricing.faq.items.1.question",
        answer: "pricing.faq.items.1.answer"
      },
      {
        question: "pricing.faq.items.2.question",
        answer: "pricing.faq.items.2.answer"
      },
      {
        question: "pricing.faq.items.3.question",
        answer: "pricing.faq.items.3.answer"
      }
    ]
  }
} as const;