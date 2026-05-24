import React, { useRef, useEffect, useState } from 'react';

import styles from './GuidePage.module.css';

const GuidePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('');
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const guideSections = [
    {
      id: 'getting-started',
      title: 'Начало работы',
      content: 'VizorLite — это мощная платформа для видеоконференций с искусственным интеллектом. Чтобы начать использовать все возможности сервиса, вам необходимо создать аккаунт или войти в существующий. После авторизации вы получите доступ к созданию комнат, настройкам профиля и многим другим функциям. Интерфейс интуитивно понятен, но данный гайд поможет вам разобраться во всех деталях и фичах платформы.'
    },
    {
      id: 'creating-room',
      title: 'Создание и управление комнатой',
      content: 'Создание видеоконференции в VizorLite происходит в один клик. На главной странице нажмите кнопку "Создать комнату", и система автоматически сгенерирует уникальную ссылку-приглашение. Вы можете поделиться этой ссылкой с участниками. Во время конференции доступны: отключение микрофона и камеры, демонстрация экрана, текстовый чат, управление участниками и многое другое. Комнаты защищены и могут быть как публичными, так и приватными.'
    },
    {
      id: 'ai-features',
      title: 'AI-помощник',
      content: 'Наш интеллектуальный помощник всегда рядом. AI-ассистент может расшифровывать встречи в реальном времени, создавать краткие саммари после звонка, помогать с формулировкой мыслей в чате, отвечать на вопросы по ходу встречи и даже давать рекомендации по улучшению качества связи. Просто нажмите на иконку AI в правом нижнем углу экрана, чтобы начать взаимодействие.'
    },
    {
      id: 'chat-messages',
      title: 'Чат и обмен сообщениями',
      content: 'Встроенный чат позволяет обмениваться текстовыми сообщениями, ссылками и файлами (изображения, документы) со всеми участниками конференции. Все сообщения сохраняются в истории комнаты. Вы также можете отправлять личные сообщения другим участникам. Чат синхронизируется в реальном времени, а новые сообщения подсвечиваются уведомлениями.'
    },
    {
      id: 'device-settings',
      title: 'Настройки устройств',
      content: 'Перед началом конференции или во время неё вы можете настроить микрофон, камеру и динамики. В разделе настроек доступен выбор из всех доступных устройств, регулировка громкости и чувствительности микрофона, тестовый режим для проверки качества. Есть также автоматическая регулировка уровня шума и подавление эха для чистого звука.'
    },
    {
      id: 'background-effects',
      title: 'Фоны и эффекты',
      content: 'Размытие фона или его полная замена — доступно для всех пользователей. Вы можете загрузить собственное изображение для фона или выбрать из стандартной галереи. Эта функция работает на основе технологии компьютерного зрения и не требует мощного оборудования. Эффекты применяются в реальном времени без задержек.'
    },
    {
      id: 'screen-sharing',
      title: 'Демонстрация экрана',
      content: 'Показывайте презентации, документы, вкладки браузера или весь рабочий стол участникам конференции. Во время демонстрации можно продолжать использовать чат, микрофон и камеру. Качество трансляции экрана автоматически адаптируется под скорость интернет-соединения.'
    },
    {
      id: 'pro-features',
      title: 'PRO возможности',
      content: 'Премиум подписка открывает доступ к расширенным функциям: запись конференций в облаке, трансляции на YouTube, неограниченное время встреч, до 100 участников одновременно, расшифровка встреч AI, приоритетная поддержка и аналитика по проведённым встречам. Ознакомиться с ценами можно в разделе "Тарифы".'
    },
    {
      id: 'mobile-app',
      title: 'Мобильное приложение',
      content: 'VizorLite доступен на всех платформах. Мобильное приложение для iOS и Android поддерживает все основные функции: видео и аудиозвонки, чат, демонстрацию экрана, AI-помощника. Приложение оптимизировано для экономии трафика и заряда батареи. Скачать можно в официальных магазинах приложений.'
    },
    {
      id: 'security',
      title: 'Безопасность и приватность',
      content: 'Все конференции шифруются end-to-end. Ваши данные не передаются третьим лицам. Вы управляете доступом к комнатам: можно установить пароль, использовать "комнату ожидания" для новых участников, отключать чат или демонстрацию экрана для отдельных пользователей. VizorLite соответствует современным стандартам безопасности видеосвязи.'
    }
  ];

  const scrollToSection = (id: string) => {
    const section = sectionRefs.current[id];
    if (section) {
      const headerHeight = 80;
      const elementPosition = section.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerHeight,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100;
      
      for (const section of guideSections) {
        const element = sectionRefs.current[section.id];
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={styles.guidePage}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarContent}>
          <h3 className={styles.sidebarTitle}>Содержание</h3>
          <nav className={styles.sidebarNav}>
            {guideSections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`${styles.sidebarLink} ${activeSection === section.id ? styles.sidebarLinkActive : ''}`}
              >
                {section.title}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className={styles.mainContent}>
        <div className={styles.contentContainer}>
          <h1 className={styles.mainTitle}>Полный гайд по VizorLite</h1>
          <p className={styles.subtitle}>
            Все функции и возможности платформы в одном месте
          </p>

          {guideSections.map((section) => (
            <section
              key={section.id}
              ref={(el) => (sectionRefs.current[section.id] = el)}
              className={styles.guideSection}
              id={section.id}
            >
              <h2 className={styles.sectionTitle}>{section.title}</h2>
              <p className={styles.sectionContent}>
                {section.content}
              </p>
            </section>
          ))}

          <div className={styles.bottomContent}>
            <div className={styles.bottomLinks}>
              <a href="/" className={styles.bottomLink}>
                На главную
              </a>
              <a href="/pricing" className={styles.bottomLink}>
                Тарифы PRO
              </a>
              <a href="/faq" className={styles.bottomLink}>
                FAQ
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GuidePage;