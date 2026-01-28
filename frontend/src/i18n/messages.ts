import { LOCALES } from "./locales";

export const messages = {
  [LOCALES.RUSSIAN]: {
    "nav.about": "О нас",
    "nav.home": "Главная",

    "authentication.main.title": "Регистрация",

    "authentication.form.username.label": "Имя пользователя",
    "authentication.form.username.placeholder": "Введите ваше имя",
    "authentication.form.email.label": "Email",
    "authentication.form.email.placeholder": "example@mail.com",
    "authentication.form.password.label": "Пароль",
    "authentication.form.password.placeholder": "Создайте надежный пароль",
    "authentication.form.submit.button": "Зарегистрироваться",
    "authentication.links.haveAccount": "Уже есть аккаунт?",


    "home.hero.title": "VizorLite — общайтесь, планируйте, решайте",
    "home.install.title": "VizorLite",
    "home.install.description":
      "Скачайте приложение для более удобной работы с сервисом на вашем устройстве",
    "home.install.button": "Установить",
    "home.button.create": "Создать видеовстречу",
    "home.button.join": "Подключиться",
    "home.bottom.pricing": "Тарифы",
    "home.bottom.translate": "Перевод",
    "home.bottom.faq": "Вопросы",

    "ai.title.main": "Ассистент Маркус",
    "ai.button.toggle": "AI",
    "ai.button.send": "Отправить",
    "ai.button.close": "✕",
    "ai.message.welcome":
      "Привет, я Маркус. Если вам нужна помощь по сайту — я всегда здесь.",
    "ai.message.placeholder": "Введите ваш вопрос...",

    "about.hero.title": "О VizorLite",
    "about.hero.subtitle":
      "Мы делаем видеоконференции простыми, доступными и безопасными для каждого",

    "about.mission.title": "Наша миссия",
    "about.mission.description":
      "Сломать барьеры в онлайн-общении. Мы верим, что качественная видеосвязь должна быть бесплатной, безопасной и доступной без скачиваний и регистраций.",

    "about.values.title": "Наши ценности",
    "about.values.items.accessibility.icon": "videoconference.svg",
    "about.values.items.accessibility.title": "Доступность",
    "about.values.items.accessibility.description":
      "Сделали видеосвязь простой и бесплатной для всех",
    "about.values.items.confidentiality.icon": "webcamera.svg",
    "about.values.items.confidentiality.title": "Конфиденциальность",
    "about.values.items.confidentiality.description":
      "Ваши разговоры остаются между участниками",
    "about.values.items.simplicity.icon": "check.svg",
    "about.values.items.simplicity.title": "Простота",
    "about.values.items.simplicity.description":
      "Никаких установок, регистраций и сложных настроек",

    "about.stats.title": "VizorLite в цифрах",
    "about.stats.items.users.value": "50K+",
    "about.stats.items.users.label": "пользователей",
    "about.stats.items.minutes.value": "1M+",
    "about.stats.items.minutes.label": "минут звонков",
    "about.stats.items.stability.value": "99%",
    "about.stats.items.stability.label": "стабильность",
    "about.stats.items.support.value": "24/7",
    "about.stats.items.support.label": "поддержка",

    "about.team.title": "Наша команда",
    "about.team.items.alexey.name": "Алексей Петров",
    "about.team.items.alexey.role": "Основатель & CEO",
    "about.team.items.alexey.description":
      "10+ лет в веб-разработке. Создал VizorLite чтобы сделать видеоконференции доступными каждому.",
    "about.team.items.maria.name": "Мария Сидорова",
    "about.team.items.maria.role": "Lead Developer",
    "about.team.items.maria.description":
      "Специалист по WebRTC и реальному времени. Отвечает за стабильность и качество соединений.",
    "about.team.items.dmitry.name": "Дмитрий Иванов",
    "about.team.items.dmitry.role": "UI/UX Дизайнер",
    "about.team.items.dmitry.description":
      "Создает интуитивные интерфейсы. Верит, что технологии должны быть красивыми и простыми.",

    "about.timeline.title": "Наш путь",
    "about.timeline.items.2021.event": "Идея и первый прототип",
    "about.timeline.items.2022.event": "Запуск закрытого бета-тестирования",
    "about.timeline.items.2023.event": "Публичный релиз VizorLite",
    "about.timeline.items.2024.event": "Достигли 50K активных пользователей",

    "about.cta.title": "Начните использовать прямо сейчас",
    "about.cta.description":
      "Присоединяйтесь к тысячам пользователей, которые уже общаются через VizorLite",
    "about.cta.buttonText": "Создать комнату",

    "about.bottomLinks.items.home.label": "Главная",
    "about.bottomLinks.items.home.icon": "home.svg",
    "about.bottomLinks.items.pricing.label": "Тарифы",
    "about.bottomLinks.items.pricing.icon": "dollar.svg",
    "about.bottomLinks.items.about.label": "О нас",
    "about.bottomLinks.items.about.icon": "question.svg",
    "about.bottomLinks.items.contacts.label": "Контакты",
    "about.bottomLinks.items.contacts.icon": "send.svg",

    "pricing.title": "Тарифы",
    "pricing.subtitle": "Выберите подходящий план для ваших видеовстреч",
    "pricing.recommended": "Рекомендуем",
    "pricing.selectButton": "Выбрать план",

    "pricing.plans.basic.name": "Базовый",
    "pricing.plans.basic.price": "0₽",
    "pricing.plans.basic.period": "/месяц",
    "pricing.plans.basic.features.participants": "До 3 участников в встрече",
    "pricing.plans.basic.features.time": "40 минут на встречу",
    "pricing.plans.basic.features.chat": "Общий чат",
    "pricing.plans.basic.features.support": "Базовая поддержка",

    "pricing.plans.business.name": "Бизнес",
    "pricing.plans.business.price": "990₽",
    "pricing.plans.business.period": "/месяц",
    "pricing.plans.business.features.participants":
      "До 25 участников в встрече",
    "pricing.plans.business.features.time": "Безлимитное время встреч",
    "pricing.plans.business.features.recording": "Запись встреч",
    "pricing.plans.business.features.settings": "Расширенные настройки",
    "pricing.plans.business.features.support": "Приоритетная поддержка",
    "pricing.plans.business.features.storage": "Облачное хранилище 10ГБ",

    "pricing.plans.premium.name": "Премиум",
    "pricing.plans.premium.price": "1990₽",
    "pricing.plans.premium.period": "/месяц",
    "pricing.plans.premium.features.participants":
      "До 100 участников в встрече",
    "pricing.plans.premium.features.time": "Безлимитное время встреч",
    "pricing.plans.premium.features.recording": "Запись встреч в HD",
    "pricing.plans.premium.features.branding": "Кастомный брендинг",
    "pricing.plans.premium.features.manager": "Персональный менеджер",
    "pricing.plans.premium.features.storage": "Облачное хранилище 50ГБ",
    "pricing.plans.premium.features.analytics": "Расширенная аналитика",

    "pricing.faq.title": "Частые вопросы",
    "pricing.faq.items.0.question": "Можно ли поменять тариф позже?",
    "pricing.faq.items.0.answer":
      "Да, вы можете изменить тариф в любое время в личном кабинете.",
    "pricing.faq.items.1.question": "Есть ли пробный период?",
    "pricing.faq.items.1.answer":
      "Для Business и Premium тарифов доступен 14-дневный пробный период.",
    "pricing.faq.items.2.question": "Как происходит оплата?",
    "pricing.faq.items.2.answer":
      "Оплата картой через безопасный платежный шлюз. Автоматическое списание каждый месяц.",
    "pricing.faq.items.3.question": "Можно ли отменить подписку?",
    "pricing.faq.items.3.answer":
      "Да, отмена доступна в любое время. Доступ к функциям сохранится до конца оплаченного периода.",

    "notfound.title": "Страница не найдена",
    "notfound.description": "Извините, запрашиваемая страница не существует или была перемещена",
    "notfound.return": "Вернуться на главную",
  },

  [LOCALES.ENGLISH]: {
    "nav.about": "About Us",
    "nav.home": "Home",

    "authentication.main.title": "Registration",
    "authentication.form.username.label": "Username",
    "authentication.form.username.placeholder": "Enter your name",
    "authentication.form.email.label": "Email",
    "authentication.form.email.placeholder": "example@mail.com",
    "authentication.form.password.label": "Password",
    "authentication.form.password.placeholder": "Create a strong password",
    "authentication.form.submit.button": "Register",
    "authentication.links.haveAccount": "Already have an account?",

    "home.hero.title": "VizorLite — meet, plan, decide",
    "home.install.title": "VizorLite",
    "home.install.description":
      "Download the app for a better experience on your device",
    "home.install.button": "Install",
    "home.button.create": "Create meeting",
    "home.button.join": "Join meeting",
    "home.bottom.pricing": "Pricing",
    "home.bottom.translate": "Translate",
    "home.bottom.faq": "FAQ",

    "ai.title.main": "Assistant Markus",
    "ai.button.toggle": "AI",
    "ai.button.send": "Send",
    "ai.button.close": "✕",
    "ai.message.welcome":
      "Hi, I'm Markus. If you need help with the site — I'm here.",
    "ai.message.placeholder": "Type your question...",

    "about.hero.title": "About VizorLite",
    "about.hero.subtitle":
      "We make video conferencing simple, accessible and secure for everyone",

    "about.mission.title": "Our Mission",
    "about.mission.description":
      "Break down barriers in online communication. We believe that quality video communication should be free, secure and accessible without downloads or registration.",

    "about.values.title": "Our Values",
    "about.values.items.accessibility.icon": "videoconference.svg",
    "about.values.items.accessibility.title": "Accessibility",
    "about.values.items.accessibility.description":
      "Made video communication simple and free for everyone",
    "about.values.items.confidentiality.icon": "webcamera.svg",
    "about.values.items.confidentiality.title": "Confidentiality",
    "about.values.items.confidentiality.description":
      "Your conversations stay between participants",
    "about.values.items.simplicity.icon": "check.svg",
    "about.values.items.simplicity.title": "Simplicity",
    "about.values.items.simplicity.description":
      "No installations, registrations or complex settings",

    "about.stats.title": "VizorLite in Numbers",
    "about.stats.items.users.value": "50K+",
    "about.stats.items.users.label": "users",
    "about.stats.items.minutes.value": "1M+",
    "about.stats.items.minutes.label": "minutes of calls",
    "about.stats.items.stability.value": "99%",
    "about.stats.items.stability.label": "stability",
    "about.stats.items.support.value": "24/7",
    "about.stats.items.support.label": "support",

    "about.team.title": "Our Team",
    "about.team.items.alexey.name": "Alexey Petrov",
    "about.team.items.alexey.role": "Founder & CEO",
    "about.team.items.alexey.description":
      "10+ years in web development. Created VizorLite to make video conferencing accessible to everyone.",
    "about.team.items.maria.name": "Maria Sidorova",
    "about.team.items.maria.role": "Lead Developer",
    "about.team.items.maria.description":
      "WebRTC and real-time specialist. Responsible for connection stability and quality.",
    "about.team.items.dmitry.name": "Dmitry Ivanov",
    "about.team.items.dmitry.role": "UI/UX Designer",
    "about.team.items.dmitry.description":
      "Creates intuitive interfaces. Believes that technology should be beautiful and simple.",

    "about.timeline.title": "Our Journey",
    "about.timeline.items.2021.event": "Idea and first prototype",
    "about.timeline.items.2022.event": "Closed beta testing launch",
    "about.timeline.items.2023.event": "Public release of VizorLite",
    "about.timeline.items.2024.event": "Reached 50K active users",

    "about.cta.title": "Start using right now",
    "about.cta.description":
      "Join thousands of users who already communicate through VizorLite",
    "about.cta.buttonText": "Create room",

    "about.bottomLinks.items.home.label": "Home",
    "about.bottomLinks.items.home.icon": "home.svg",
    "about.bottomLinks.items.pricing.label": "Pricing",
    "about.bottomLinks.items.pricing.icon": "dollar.svg",
    "about.bottomLinks.items.about.label": "About",
    "about.bottomLinks.items.about.icon": "question.svg",
    "about.bottomLinks.items.contacts.label": "Contacts",
    "about.bottomLinks.items.contacts.icon": "send.svg",

    "pricing.title": "Pricing",
    "pricing.subtitle": "Choose the right plan for your video meetings",
    "pricing.recommended": "Recommended",
    "pricing.selectButton": "Select Plan",

    "pricing.plans.basic.name": "Basic",
    "pricing.plans.basic.price": "$0",
    "pricing.plans.basic.period": "/month",
    "pricing.plans.basic.features.participants":
      "Up to 3 participants per meeting",
    "pricing.plans.basic.features.time": "40 minutes per meeting",
    "pricing.plans.basic.features.chat": "Shared chat",
    "pricing.plans.basic.features.support": "Basic support",

    "pricing.plans.business.name": "Business",
    "pricing.plans.business.price": "$10",
    "pricing.plans.business.period": "/month",
    "pricing.plans.business.features.participants":
      "Up to 25 participants per meeting",
    "pricing.plans.business.features.time": "Unlimited meeting time",
    "pricing.plans.business.features.recording": "Meeting recording",
    "pricing.plans.business.features.settings": "Advanced settings",
    "pricing.plans.business.features.support": "Priority support",
    "pricing.plans.business.features.storage": "10GB cloud storage",

    "pricing.plans.premium.name": "Premium",
    "pricing.plans.premium.price": "$20",
    "pricing.plans.premium.period": "/month",
    "pricing.plans.premium.features.participants":
      "Up to 100 participants per meeting",
    "pricing.plans.premium.features.time": "Unlimited meeting time",
    "pricing.plans.premium.features.recording": "HD meeting recording",
    "pricing.plans.premium.features.branding": "Custom branding",
    "pricing.plans.premium.features.manager": "Personal manager",
    "pricing.plans.premium.features.storage": "50GB cloud storage",
    "pricing.plans.premium.features.analytics": "Advanced analytics",

    "pricing.faq.title": "Frequently Asked Questions",
    "pricing.faq.items.0.question": "Can I change my plan later?",
    "pricing.faq.items.0.answer":
      "Yes, you can change your plan anytime in your personal account.",
    "pricing.faq.items.1.question": "Is there a trial period?",
    "pricing.faq.items.1.answer":
      "A 14-day trial period is available for Business and Premium plans.",
    "pricing.faq.items.2.question": "How does payment work?",
    "pricing.faq.items.2.answer":
      "Payment by card through a secure payment gateway. Automatic monthly billing.",
    "pricing.faq.items.3.question": "Can I cancel my subscription?",
    "pricing.faq.items.3.answer":
      "Yes, cancellation is available at any time. Access to features will remain until the end of the paid period.",

    "notfound.title": "Page Not Found",
    "notfound.description": "Sorry, the requested page does not exist or has been moved",
    "notfound.return": "Return to Home",
  },

  [LOCALES.JAPANESE]: {
    "nav.about": "私たちについて",
    "nav.home": "ホーム",

    "authentication.main.title": "登録",
    "authentication.form.username.label": "ユーザー名",
    "authentication.form.username.placeholder": "名前を入力してください",
    "authentication.form.email.label": "メールアドレス",
    "authentication.form.email.placeholder": "example@mail.com",
    "authentication.form.password.label": "パスワード",
    "authentication.form.password.placeholder": "強力なパスワードを作成してください",
    "authentication.form.submit.button": "登録する",
    "authentication.links.haveAccount": "すでにアカウントをお持ちですか？",

    "home.hero.title": "VizorLite — 話し合い、計画、決定",
    "home.install.title": "VizorLite",
    "home.install.description": "より便利なサービス利用のために、お使いのデバイスにアプリをダウンロードしてください",
    "home.install.button": "インストール",
    "home.button.create": "ビデオ会議を作成",
    "home.button.join": "接続する",
    "home.bottom.pricing": "料金プラン",
    "home.bottom.translate": "翻訳",
    "home.bottom.faq": "よくある質問",

    "ai.title.main": "アシスタント マーカス",
    "ai.button.toggle": "AI",
    "ai.button.send": "送信",
    "ai.button.close": "✕",
    "ai.message.welcome": "こんにちは、私はマーカスです。サイトに関するご質問があれば、いつでもお手伝いします。",
    "ai.message.placeholder": "質問を入力してください...",

    "about.hero.title": "VizorLiteについて",
    "about.hero.subtitle": "誰にとっても簡単でアクセスしやすく、安全なビデオ会議を実現します",

    "about.mission.title": "私たちのミッション",
    "about.mission.description": "オンラインコミュニケーションの障壁を取り除くこと。高品質なビデオ通話は、ダウンロードや登録なしで、無料で安全に、誰もが利用できるべきだと信じています。",

    "about.values.title": "私たちの価値観",
    "about.values.items.accessibility.icon": "videoconference.svg",
    "about.values.items.accessibility.title": "アクセシビリティ",
    "about.values.items.accessibility.description": "誰もが簡単に無料でビデオ通話を利用できるようにしました",
    "about.values.items.confidentiality.icon": "webcamera.svg",
    "about.values.items.confidentiality.title": "機密性",
    "about.values.items.confidentiality.description": "会話は参加者の間のみに留まります",
    "about.values.items.simplicity.icon": "check.svg",
    "about.values.items.simplicity.title": "シンプルさ",
    "about.values.items.simplicity.description": "インストール、登録、複雑な設定は一切不要",

    "about.stats.title": "VizorLite 数字で見る",
    "about.stats.items.users.value": "50K+",
    "about.stats.items.users.label": "ユーザー",
    "about.stats.items.minutes.value": "100万+",
    "about.stats.items.minutes.label": "通話分数",
    "about.stats.items.stability.value": "99%",
    "about.stats.items.stability.label": "安定性",
    "about.stats.items.support.value": "24/7",
    "about.stats.items.support.label": "サポート",

    "about.team.title": "私たちのチーム",
    "about.team.items.alexey.name": "アレクセイ・ペトロフ",
    "about.team.items.alexey.role": "創業者 & CEO",
    "about.team.items.alexey.description": "ウェブ開発経験10年以上。VizorLiteを創設し、誰もがビデオ会議を利用できるようにしました。",
    "about.team.items.maria.name": "マリア・シドロワ",
    "about.team.items.maria.role": "リードデベロッパー",
    "about.team.items.maria.description": "WebRTCとリアルタイム通信の専門家。接続の安定性と品質を担当しています。",
    "about.team.items.dmitry.name": "ドミトリー・イワノフ",
    "about.team.items.dmitry.role": "UI/UXデザイナー",
    "about.team.items.dmitry.description": "直感的なインターフェースを作成します。テクノロジーは美しくシンプルであるべきと信じています。",

    "about.timeline.title": "私たちの歩み",
    "about.timeline.items.2021.event": "アイデアと最初のプロトタイプ",
    "about.timeline.items.2022.event": "クローズドベータテスト開始",
    "about.timeline.items.2023.event": "VizorLiteのパブリックリリース",
    "about.timeline.items.2024.event": "5万人のアクティブユーザーを達成",

    "about.cta.title": "今すぐ使い始めましょう",
    "about.cta.description": "すでにVizorLiteを通じてコミュニケーションを取っている何千ものユーザーに参加してください",
    "about.cta.buttonText": "ルームを作成",

    "about.bottomLinks.items.home.label": "ホーム",
    "about.bottomLinks.items.home.icon": "home.svg",
    "about.bottomLinks.items.pricing.label": "料金プラン",
    "about.bottomLinks.items.pricing.icon": "dollar.svg",
    "about.bottomLinks.items.about.label": "私たちについて",
    "about.bottomLinks.items.about.icon": "question.svg",
    "about.bottomLinks.items.contacts.label": "お問い合わせ",
    "about.bottomLinks.items.contacts.icon": "send.svg",

    "pricing.title": "料金プラン",
    "pricing.subtitle": "あなたのビデオ会議に合ったプランをお選びください",
    "pricing.recommended": "おすすめ",
    "pricing.selectButton": "プランを選択",

    "pricing.plans.basic.name": "ベーシック",
    "pricing.plans.basic.price": "¥0",
    "pricing.plans.basic.period": "/月",
    "pricing.plans.basic.features.participants": "会議あたり最大3名",
    "pricing.plans.basic.features.time": "会議あたり40分",
    "pricing.plans.basic.features.chat": "共有チャット",
    "pricing.plans.basic.features.support": "基本サポート",

    "pricing.plans.business.name": "ビジネス",
    "pricing.plans.business.price": "¥1,500",
    "pricing.plans.business.period": "/月",
    "pricing.plans.business.features.participants": "会議あたり最大25名",
    "pricing.plans.business.features.time": "会議時間無制限",
    "pricing.plans.business.features.recording": "会議録画",
    "pricing.plans.business.features.settings": "高度な設定",
    "pricing.plans.business.features.support": "優先サポート",
    "pricing.plans.business.features.storage": "クラウドストレージ10GB",

    "pricing.plans.premium.name": "プレミアム",
    "pricing.plans.premium.price": "¥3,000",
    "pricing.plans.premium.period": "/月",
    "pricing.plans.premium.features.participants": "会議あたり最大100名",
    "pricing.plans.premium.features.time": "会議時間無制限",
    "pricing.plans.premium.features.recording": "HD会議録画",
    "pricing.plans.premium.features.branding": "カスタムブランディング",
    "pricing.plans.premium.features.manager": "パーソナルマネージャー",
    "pricing.plans.premium.features.storage": "クラウドストレージ50GB",
    "pricing.plans.premium.features.analytics": "高度な分析",

    "pricing.faq.title": "よくある質問",
    "pricing.faq.items.0.question": "後でプランを変更できますか？",
    "pricing.faq.items.0.answer": "はい、個人アカウントでいつでもプラン変更が可能です。",
    "pricing.faq.items.1.question": "トライアル期間はありますか？",
    "pricing.faq.items.1.answer": "ビジネスおよびプレミアムプランでは14日間のトライアル期間を利用できます。",
    "pricing.faq.items.2.question": "支払いはどのように行われますか？",
    "pricing.faq.items.2.answer": "安全な決済ゲートウェイを通じてカードでお支払いいただけます。毎月自動的に請求されます。",
    "pricing.faq.items.3.question": "サブスクリプションをキャンセルできますか？",
    "pricing.faq.items.3.answer": "はい、いつでもキャンセル可能です。有料期間終了までは機能にアクセスできます。",

    "notfound.title": "ページが見つかりません",
    "notfound.description": "申し訳ありません。お探しのページは存在しないか、移動した可能性があります",
    "notfound.return": "ホームに戻る",
  },
};
