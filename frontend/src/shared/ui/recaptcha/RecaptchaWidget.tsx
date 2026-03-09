import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

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

    useImperativeHandle(ref, () => ({
      getValue: () => {
        const inputs = containerRef.current?.querySelectorAll('textarea');
        return inputs?.[0]?.value;
      },
      reset: () => {
        if (window.grecaptcha) {
          window.grecaptcha.reset();
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
      script.src = `https://www.google.com/recaptcha/api.js?hl=ru`;
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        scriptLoaded.current = true;
      };

      script.onerror = () => {
        onError?.('Failed to load reCAPTCHA script');
      };

      document.body.appendChild(script);

      return () => {

      };
    }, [onError]);

    return (
      <div 
        ref={containerRef}
        className="g-recaptcha"
        data-sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
        data-callback={onVerify}
        data-expired-callback={onExpire}
        data-error-callback={onError} 
        data-theme={theme}
        data-size={size}
      />
    );
  }
);

RecaptchaWidget.displayName = 'RecaptchaWidget';
