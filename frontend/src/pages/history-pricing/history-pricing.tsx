import { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { stripeApi, type Transaction } from '@/shared/api/stripeApi';

import styles from './history-pricing.module.css';
import { int } from 'zod';

const getStatusText = (status: Transaction['status'], intl: ReturnType<typeof useIntl>) => {
  switch (status) {
    case 'paid': return intl.formatMessage({ id: 'status.paid' });
    case 'pending': return intl.formatMessage({ id: 'status.pending' });
    case 'expired': return intl.formatMessage({ id: 'status.expired' });
    default: return status;
  }
};

const getStatusClass = (status: Transaction['status']) => {
  switch (status) {
    case 'paid': return styles.statusPaid;
    case 'pending': return styles.statusPending;
    case 'expired': return styles.statusExpired;
    default: return '';
  }
};

export default function SubscriptionHistoryPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intl = useIntl();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const data = await stripeApi.getTransactions();
        setTransactions(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load transactions:', err);
        setError(intl.formatMessage({ id: 'history.error' }));
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [intl]);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.contentContainer}>
          <div className={styles.loader}>{intl.formatMessage({ id: 'history.loading' })}</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.contentContainer}>
          <div className={styles.error}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.contentContainer}>
        <h1 className={styles.mainTitle}>{intl.formatMessage({ id: 'history.title' })}</h1>
        <p className={styles.subtitle}>{intl.formatMessage({ id: 'history.subtitle' })}</p>

        <div className={styles.historySection}>
          {transactions.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyText}>{intl.formatMessage({ id: 'history.empty' })}</div>
            </div>
          ) : (
            <>
              <div className={styles.lengthTransactions}>
                <span>
                  {intl.formatMessage({ id: 'history.totalTransactions' })}
                  {transactions.length}
                </span>
              </div>
              <div className={styles.desktopTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.colDate}>{intl.formatMessage({ id: 'history.table.date' })}</div>
                  <div className={styles.colDescription}>{intl.formatMessage({ id: 'history.table.description' })}</div>
                  <div className={styles.colAmount}>{intl.formatMessage({ id: 'history.table.amount' })}</div>
                  <div className={styles.colStatus}>{intl.formatMessage({ id: 'history.table.status' })}</div>
                  <div className={styles.colAction}></div>
                </div>
                <div className={styles.tableBody}>
                  {transactions.map((item) => (
                    <div key={item.id} className={styles.tableRow}>
                      <div className={styles.colDate}>{item.date}</div>
                      <div className={styles.colDescription}>{item.description}</div>
                      <div className={styles.colAmount}>{item.amount}</div>
                      <div className={styles.colStatus}>
                        <span className={`${styles.statusBadge} ${getStatusClass(item.status)}`}>
                          {getStatusText(item.status, intl)}
                        </span>
                      </div>
                      <div className={styles.colAction}>
                        {item.invoiceUrl && (
                          <a href={item.invoiceUrl} target="_blank" rel="noopener noreferrer" className={styles.invoiceLink}>
                            {intl.formatMessage({ id: 'history.invoice' })}
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className={styles.mobileCards}>
                {transactions.map((item) => (
                  <div key={item.id} className={styles.historyCard}>
                    <div className={styles.cardHeader}>
                      <span className={styles.cardDate}>{item.date}</span>
                      <span className={`${styles.cardStatus} ${getStatusClass(item.status)}`}>
                        {getStatusText(item.status, intl)}
                      </span>
                    </div>
                    <div className={styles.cardDescription}>{item.description}</div>
                    <div className={styles.cardFooter}>
                      <span className={styles.cardAmount}>{item.amount}</span>
                      {item.invoiceUrl && (
                        <a href={item.invoiceUrl} target="_blank" rel="noopener noreferrer" className={styles.invoiceLink}>
                          {intl.formatMessage({ id: 'history.invoice' })}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}