import { useCallback } from 'react';


declare global {
  interface Window {
    grecaptcha?: {
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      render: (container: string | HTMLElement, options: RecaptchaRenderOptions) => number;
      reset: (widgetId?: number) => void;
      getResponse: (widgetId?: number) => string | undefined;
    };
    onRecaptchaLoad?: () => void;
  }
}

interface RecaptchaRenderOptions {
  sitekey: string;
  callback?: (token: string) => void;
  'error-callback'?: (error: string) => void;
  'expired-callback'?: () => void;
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact' | 'invisible';
}

export const useRecaptcha = () => {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  const loadScript = useCallback(() => {
    if (window.grecaptcha) return Promise.resolve();
    
    return new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js?onload=onRecaptchaLoad&render=explicit';
      script.async = true;
      script.defer = true;
      
      window.onRecaptchaLoad = () => resolve();
      script.onerror = () => reject(new Error('Failed to load reCAPTCHA'));
      
      document.body.appendChild(script);
    });
  }, []);

  const execute = useCallback(async (action: string = 'submit'): Promise<string> => {
    if (!window.grecaptcha) {
      await loadScript();
    }
    return window.grecaptcha!.execute(siteKey, { action });
  }, [siteKey, loadScript]);

  const reset = useCallback((widgetId?: number) => {
    window.grecaptcha?.reset(widgetId);
  }, []);

  return { execute, reset, loadScript, isLoaded: !!window.grecaptcha };
};