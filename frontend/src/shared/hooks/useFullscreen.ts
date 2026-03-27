import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';

interface UseFullscreenOptions {

  onFullscreenChange?: (isFullscreen: boolean, targetId: string | null) => void;

  autoEnterOnScreenShare?: boolean;
}

interface UseFullscreenReturn {

  fullscreenTarget: string | null;

  isFullscreen: boolean;

  enterFullscreen: (element: HTMLElement, targetId: string) => Promise<void>;

  exitFullscreen: () => Promise<void>;

  toggleFullscreen: (element: HTMLElement | null, targetId: string) => Promise<void>;
}

export function useFullscreen({
  onFullscreenChange,
  autoEnterOnScreenShare = true,
}: UseFullscreenOptions = {}): UseFullscreenReturn {
  const [fullscreenTarget, setFullscreenTarget] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const fullscreenElementRef = useRef<HTMLElement | null>(null);

  const enterFullscreen = useCallback(async (element: HTMLElement, targetId: string) => {
    try {
      if (!document.fullscreenElement) {
        await element.requestFullscreen();
        setFullscreenTarget(targetId);
        setIsFullscreen(true);
        fullscreenElementRef.current = element;
        onFullscreenChange?.(true, targetId);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
      message.error('Не удалось включить полноэкранный режим');
    }
  }, [onFullscreenChange]);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        setFullscreenTarget(null);
        setIsFullscreen(false);
        fullscreenElementRef.current = null;
        onFullscreenChange?.(false, null);
      }
    } catch (err) {
      console.error('Fullscreen error:', err);
    }
  }, [onFullscreenChange]);

  const toggleFullscreen = useCallback(async (element: HTMLElement | null, targetId: string) => {
    if (document.fullscreenElement && fullscreenTarget === targetId) {
      await exitFullscreen();
    } else if (element) {
      await enterFullscreen(element, targetId);
    }
  }, [fullscreenTarget, enterFullscreen, exitFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isCurrentlyFullscreen);
      
      if (!isCurrentlyFullscreen) {
        setFullscreenTarget(null);
        fullscreenElementRef.current = null;
        onFullscreenChange?.(false, null);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [onFullscreenChange]);

  useEffect(() => {
    if (autoEnterOnScreenShare && fullscreenElementRef.current && !document.fullscreenElement) {
      fullscreenElementRef.current.requestFullscreen().catch(() => {});
    }
  }, [autoEnterOnScreenShare]);

  return {
    fullscreenTarget,
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen,
  };
}
