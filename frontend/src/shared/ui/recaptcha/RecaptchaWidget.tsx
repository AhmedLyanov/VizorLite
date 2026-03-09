import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import styles from "./RecaptchaWidget.module.css";

export interface RecaptchaWidgetRef {
  getValue: () => string | undefined;
  reset: () => void;
}

interface RecaptchaWidgetProps {
  onVerify?: (token: string) => void;
  onExpire?: () => void;
  onError?: (error: string) => void; 
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact';
}

export const RecaptchaWidget = forwardRef<RecaptchaWidgetRef, RecaptchaWidgetProps>(
  ({ onVerify, onExpire, onError, theme = 'light', size = 'normal' }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const scriptLoaded = useRef(false);
    const widgetId = useRef<number | null>(null); 

    useImperativeHandle(ref, () => ({
      getValue: () => {
        const inputs = containerRef.current?.querySelectorAll('textarea');
        return inputs?.[0]?.value;
      },
      reset: () => {
        if (window.grecaptcha && widgetId.current !== null) {
          window.grecaptcha.reset(widgetId.current);
        }
      },
    }));

    useEffect(() => {
      if (scriptLoaded.current) return;
      
      const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
      if (!siteKey) {
        console.warn('[RecaptchaWidget] Site key not set');
        return;
      }

      if (document.querySelector('script[src*="recaptcha/api.js"]')) {
        scriptLoaded.current = true;
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?hl=ru';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        scriptLoaded.current = true;
        if (containerRef.current && window.grecaptcha) {
          widgetId.current = window.grecaptcha.render(containerRef.current, {
            sitekey: siteKey,
            callback: onVerify,
            'expired-callback': onExpire,
            'error-callback': onError,
            theme: theme,
            size: size,
          });
        }
      };

      script.onerror = () => {
        onError?.('Failed to load reCAPTCHA script');
      };

      document.body.appendChild(script);


      return () => {

        if (widgetId.current !== null && window.grecaptcha) {

        }
      };
    }, [onVerify, onExpire, onError, theme, size]); 

    return (
      <div 
        ref={containerRef}
        className={styles.gRecaptcha}
      />
    );
  }
);

RecaptchaWidget.displayName = 'RecaptchaWidget';