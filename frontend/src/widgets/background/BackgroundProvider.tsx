import { useEffect } from 'react';
import { useSettingsStore } from '@/entities/user/useSettingsStore';

export const BackgroundProvider = ({ children }: { children: React.ReactNode }) => {
  const { settings } = useSettingsStore();
  const background = settings.background;

  useEffect(() => {
    if (background.image) {
      document.body.style.backgroundImage = `url(${background.image})`;
      document.body.style.backgroundSize = background.size;
      document.body.style.backgroundPosition = background.position;
      document.body.style.backgroundAttachment = background.attachment;
      document.body.style.backgroundRepeat = 'no-repeat';
    } else {
      const gradient = getComputedStyle(document.documentElement)
        .getPropertyValue('--primary-background-color').trim();
      document.body.style.backgroundImage = gradient;
      document.body.style.backgroundSize = 'auto';
      document.body.style.backgroundAttachment = 'scroll';
    }
  }, [background]);

  return <>{children}</>;
};