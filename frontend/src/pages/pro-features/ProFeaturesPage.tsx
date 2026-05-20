import styles from './ProFeaturesPage.module.css';

const ProFeaturesPage: React.FC = () => {
  return (
    <div className={styles.proPage}>
      <div className={styles.contentContainer}>
        <div className={styles.heroBanner}>
          <div className={styles.heroBadge}>🔥 PRO обновление (страница пока заглушка)</div>
          <h1 className={styles.heroTitle}>
            VizorLite <span className={styles.proAccent}>Pro</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Всё, что нужно для профессиональных видеоконференций<br />
            и командной работы без ограничений
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.primaryButton}>Попробовать 14 дней бесплатно</button>
            <button className={styles.secondaryButton}>Сравнить тарифы</button>
          </div>
        </div>
        <div className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>Что даёт Pro‑подписка</h2>
          <div className={styles.featuresGrid}>
            <FeatureCard 
              emoji="🎥"
              title="Неограниченные по времени встречи"
              description="Конференции без таймера — общайтесь часами, пока идёт рабочий процесс."
            />
            <FeatureCard 
              emoji="👥"
              title="До 200 участников"
              description="Вмещайте всю команду, партнёров и клиентов в одной видеоконференции."
            />
            <FeatureCard 
              emoji="🤖"
              title="AI-помощник"
              description="Автоматические расшифровки, краткие саммари встреч и умный поиск по записям."
            />
            <FeatureCard 
              emoji="💾"
              title="Облачное хранилище 100 ГБ"
              description="Сохраняйте записи встреч, файлы и чаты — доступ с любого устройства."
            />
            <FeatureCard 
              emoji="🔒"
              title="Сквозное шифрование"
              description="Повышенный уровень безопасности для конфиденциальных переговоров."
            />
            <FeatureCard 
              emoji="📊"
              title="Аналитика встреч"
              description="Отчёты об участии, вовлечённости и времени обсуждения тем."
            />
          </div>
        </div>

        <div className={styles.compareSection}>
          <h2 className={styles.sectionTitle}>Сравните тарифы</h2>
          <div className={styles.compareTable}>
            <div className={styles.compareRowHeader}>
              <div className={styles.compareCell}>Возможность</div>
              <div className={styles.compareCell}>Free</div>
              <div className={styles.compareCell}>Pro</div>
            </div>
            <div className={styles.compareRow}>
              <div className={styles.compareCell}>Длительность встречи</div>
              <div className={styles.compareCell}>60 минут</div>
              <div className={styles.compareCell}>Без лимита</div>
            </div>
            <div className={styles.compareRow}>
              <div className={styles.compareCell}>Участников</div>
              <div className={styles.compareCell}>до 50</div>
              <div className={styles.compareCell}>до 200</div>
            </div>
            <div className={styles.compareRow}>
              <div className={styles.compareCell}>AI‑помощник</div>
              <div className={styles.compareCell}>❌</div>
              <div className={styles.compareCell}>✅ Полный функционал</div>
            </div>
            <div className={styles.compareRow}>
              <div className={styles.compareCell}>Облако (ГБ)</div>
              <div className={styles.compareCell}>5 ГБ</div>
              <div className={styles.compareCell}>100 ГБ</div>
            </div>
            <div className={styles.compareRow}>
              <div className={styles.compareCell}>Запись встреч</div>
              <div className={styles.compareCell}>Локальная</div>
              <div className={styles.compareCell}>Облачная + локальная</div>
            </div>
            <div className={styles.compareRow}>
              <div className={styles.compareCell}>Поддержка 24/7</div>
              <div className={styles.compareCell}>Только чат</div>
              <div className={styles.compareCell}>Приоритетная (чат + звонок)</div>
            </div>
          </div>
        </div>

        <div className={styles.ctaSection}>
          <h3 className={styles.ctaTitle}>Готовы вывести конференции на новый уровень?</h3>
          <p className={styles.ctaText}>
            Присоединяйтесь к сотням команд, которые уже работают в VizorLite Pro
          </p>
          <button className={styles.ctaButton}>Начать бесплатный пробный период →</button>
          <p className={styles.ctaNote}>Без автопродления. Отменить можно в любой момент.</p>
        </div>

        <div className={styles.bottomLinks}>
          <a href="/pricing" className={styles.bottomLink}>
            <span className={styles.linkIcon}>💰</span> Цены
          </a>
          <a href="/faq" className={styles.bottomLink}>
            <span className={styles.linkIcon}>❓</span> Вопросы о Pro
          </a>
          <a href="/contacts" className={styles.bottomLink}>
            <span className={styles.linkIcon}>📞</span> Связаться с отделом продаж
          </a>
        </div>
      </div>
    </div>
  );
};
const FeatureCard: React.FC<{ emoji: string; title: string; description: string }> = ({ emoji, title, description }) => (
  <div className={styles.featureCard}>
    <div className={styles.featureEmoji}>{emoji}</div>
    <h3 className={styles.featureTitle}>{title}</h3>
    <p className={styles.featureDesc}>{description}</p>
  </div>
);

export default ProFeaturesPage;