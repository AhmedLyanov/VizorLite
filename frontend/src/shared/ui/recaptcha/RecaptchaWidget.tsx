import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { useRecaptcha } from '../../../entities/recaptcha/useRecaptcha';
import styles from "./RecaptchaWidget.module.css"

export interface RecaptchaWidgetRef {
  reset: () => void;
  getValue: () => string | undefined;
}

interface RecaptchaWidgetProps {
  onVerify?: (token: string) => void;
  onError?: (error: string) => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact';
}

export const RecaptchaWidget = forwardRef<RecaptchaWidgetRef, RecaptchaWidgetProps>(
  ({ onVerify, onError, onExpire, theme = 'light', size = 'normal' }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const widgetId = useRef<number | null>(null);
    const { loadScript } = useRecaptcha();

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetId.current !== null) {
          window.grecaptcha?.reset(widgetId.current);
        }
      },
      getValue: () => {
        if (widgetId.current !== null) {
          return window.grecaptcha?.getResponse(widgetId.current);
        }
        return undefined;
      },
    }));

    useEffect(() => {
      let mounted = true;

      const initRecaptcha = async () => {
        await loadScript();
        
        if (!mounted || !containerRef.current) return;

        const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
        if (!siteKey) {
          console.warn('[RecaptchaWidget] VITE_RECAPTCHA_SITE_KEY is not set');
          return;
        }


        widgetId.current = window.grecaptcha!.render(containerRef.current, {
          sitekey: siteKey,
          callback: onVerify,
          'error-callback': onError,
          'expired-callback': onExpire,
          theme,
          size,
        });
      };

      initRecaptcha();

      return () => {
        mounted = false;
        if (widgetId.current !== null) {
          window.grecaptcha?.reset(widgetId.current);
        }
      };
    }, [loadScript, onVerify, onError, onExpire, theme, size]);

    return <div ref={containerRef} className={styles.recaptchaWidget} />;
  }
);

