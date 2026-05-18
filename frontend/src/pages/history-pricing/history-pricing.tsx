import styles from './history-pricing.module.css';

interface HistoryItem {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'expired';
  description: string;
  invoiceUrl?: string;
}

const mockHistory: HistoryItem[] = [
  {
    id: 'inv_001',
    date: '2025-05-15',
    amount: '$19.99',
    status: 'paid',
    description: 'Подписка «Business» — месячная',
    invoiceUrl: '#',
  },
  {
    id: 'inv_002',
    date: '2025-04-15',
    amount: '$19.99',
    status: 'paid',
    description: 'Подписка «Business» — месячная',
  },
  {
    id: 'inv_003',
    date: '2025-03-15',
    amount: '$19.99',
    status: 'paid',
    description: 'Подписка «Business» — месячная',
  },
  {
    id: 'inv_004',
    date: '2025-02-15',
    amount: '$19.99',
    status: 'paid',
    description: 'Подписка «Business» — месячная',
  },
  {
    id: 'inv_005',
    date: '2025-01-15',
    amount: '$19.99',
    status: 'paid',
    description: 'Подписка «Business» — месячная',
  },
  {
    id: 'inv_006',
    date: '2024-12-15',
    amount: '$19.99',
    status: 'paid',
    description: 'Подписка «Business» — месячная',
  },
  {
    id: 'inv_007',
    date: '2024-11-15',
    amount: '$9.99',
    status: 'paid',
    description: 'Подписка «Pro» — месячная',
  },
  {
    id: 'inv_008',
    date: '2024-10-15',
    amount: '$9.99',
    status: 'expired',
    description: 'Подписка «Pro» — месячная (истекла)',
  },
  {
    id: 'inv_009',
    date: '2024-09-15',
    amount: '$9.99',
    status: 'paid',
    description: 'Подписка «Pro» — месячная',
  },
];

const getStatusText = (status: HistoryItem['status']) => {
  switch (status) {
    case 'paid':
      return 'Оплачено';
    case 'pending':
      return 'Ожидает';
    case 'expired':
      return 'Истекла';
    default:
      return status;
  }
};

const getStatusClass = (status: HistoryItem['status']) => {
  switch (status) {
    case 'paid':
      return styles.statusPaid;
    case 'pending':
      return styles.statusPending;
    case 'expired':
      return styles.statusExpired;
    default:
      return '';
  }
};

export default function SubscriptionHistoryPage(){
  return (
    <div className={styles.page}>
      <div className={styles.contentContainer}>
        <h1 className={styles.mainTitle}>История платежей</h1>
        <p className={styles.subtitle}>
          Все транзакции по вашей подписке — всегда под контролем
        </p>

        <div className={styles.historySection}>
          {/* Десктопная таблица */}
          <div className={styles.desktopTable}>
            <div className={styles.tableHeader}>
              <div className={styles.colDate}>Дата</div>
              <div className={styles.colDescription}>Описание</div>
              <div className={styles.colAmount}>Сумма</div>
              <div className={styles.colStatus}>Статус</div>
              <div className={styles.colAction}></div>
            </div>
            <div className={styles.tableBody}>
              {mockHistory.map((item) => (
                <div key={item.id} className={styles.tableRow}>
                  <div className={styles.colDate}>{item.date}</div>
                  <div className={styles.colDescription}>
                    {item.description}
                  </div>
                  <div className={styles.colAmount}>{item.amount}</div>
                  <div className={styles.colStatus}>
                    <span className={`${styles.statusBadge} ${getStatusClass(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </div>
                  <div className={styles.colAction}>
                    {item.invoiceUrl && (
                      <a href={item.invoiceUrl} className={styles.invoiceLink}>
                        Счёт
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Мобильные карточки */}
          <div className={styles.mobileCards}>
            {mockHistory.map((item) => (
              <div key={item.id} className={styles.historyCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardDate}>{item.date}</span>
                  <span className={`${styles.cardStatus} ${getStatusClass(item.status)}`}>
                    {getStatusText(item.status)}
                  </span>
                </div>
                <div className={styles.cardDescription}>{item.description}</div>
                <div className={styles.cardFooter}>
                  <span className={styles.cardAmount}>{item.amount}</span>
                  {item.invoiceUrl && (
                    <a href={item.invoiceUrl} className={styles.invoiceLink}>
                      Счёт
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};