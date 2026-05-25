import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { Alert, Button, Divider, message, Popover, Select, Space, Switch, Tabs, Typography } from 'antd';
import { AudioOutlined, MoonOutlined, PictureOutlined, QuestionCircleOutlined, TranslationOutlined, VideoCameraOutlined } from '@ant-design/icons';

import { useSettingsStore } from '@/entities/user/useSettingsStore';
import { useAuth } from '@/entities/user/AuthContext';
import { useLocaleStore } from '@/shared/locale';

import { BackgroundSection } from './sections/BackgroundSection';
import styles from '../Aside.module.css';
import popoverStyles from './SettingsPopover.module.css';

const { Text } = Typography;

type DeviceTestState = 'idle' | 'testing' | 'ready' | 'error';

const getMeterHeight = (audioLevel: number, index: number) => {
  const normalized = Math.max(0, Math.min(1, audioLevel / 255));
  return `${Math.max(12, Math.min(100, 18 + normalized * 82 * (index + 1) / 5))}%`;
};

const MicrophoneSection: React.FC = () => {
  const intl = useIntl();
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [testState, setTestState] = useState<DeviceTestState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [audioLevel, setAudioLevel] = useState(0);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const stopAudioTest = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    sourceRef.current?.disconnect();
    sourceRef.current = null;

    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => undefined);
      audioContextRef.current = null;
    }

    analyserRef.current = null;

    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
    setAudioLevel(0);
  }, [stream]);

  const loadDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      const errorText = intl.formatMessage({
        id: 'settings.microphone.notSupported',
        defaultMessage: 'Браузер не поддерживает проверку микрофона.'
      });
      setErrorMessage(errorText);
      setTestState('error');
      return;
    }

    const currentDevices = await navigator.mediaDevices.enumerateDevices();
    const audioInputs = currentDevices.filter((device) => device.kind === 'audioinput');

    setDevices(audioInputs);

    if (!selectedDeviceId && audioInputs[0]) {
      setSelectedDeviceId(audioInputs[0].deviceId);
    }
  }, [intl, selectedDeviceId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDevices();
    }, 0);

    const handleDeviceChange = () => {
      void loadDevices();
    };

    navigator.mediaDevices?.addEventListener('devicechange', handleDeviceChange);

    return () => {
      window.clearTimeout(timer);
      navigator.mediaDevices?.removeEventListener('devicechange', handleDeviceChange);
      stopAudioTest();
    };
  }, [loadDevices, stopAudioTest]);

  useEffect(() => {
    if (!stream) {
      return;
    }

    const AudioContextClass = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) {
      return;
    }

    const audioContext = new AudioContextClass();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    audioContextRef.current = audioContext;
    analyserRef.current = analyser;
    sourceRef.current = source;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const detectSound = () => {
      if (!analyserRef.current) {
        return;
      }

      analyserRef.current.getByteFrequencyData(dataArray);
      const total = dataArray.reduce((sum, value) => sum + value, 0);
      setAudioLevel(total / bufferLength);
      animationFrameRef.current = requestAnimationFrame(detectSound);
    };

    detectSound();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }

      source.disconnect();
      audioContext.close().catch(() => undefined);
    };
  }, [stream]);

  const micOptions = useMemo(() => devices.map((device) => ({
    value: device.deviceId,
    label: device.label || intl.formatMessage({
      id: 'settings.microphone.deviceFallback',
      defaultMessage: 'Микрофон'
    })
  })), [devices, intl]);

  const handleStartTest = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      const errorText = intl.formatMessage({
        id: 'settings.microphone.notSupported',
        defaultMessage: 'Браузер не поддерживает проверку микрофона.'
      });
      setErrorMessage(errorText);
      setTestState('error');
      return;
    }

    if (!selectedDeviceId && devices.length === 0) {
      const errorText = intl.formatMessage({
        id: 'settings.microphone.noDevice',
        defaultMessage: 'Микрофон не найден. Подключите устройство и попробуйте снова.'
      });
      setErrorMessage(errorText);
      setTestState('error');
      message.warning(errorText);
      return;
    }

    stopAudioTest();
    setTestState('testing');
    setErrorMessage('');

    try {
      const nextStream = await navigator.mediaDevices.getUserMedia({
        audio: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true,
        video: false,
      });

      setStream(nextStream);
      setTestState('ready');
      await loadDevices();
    } catch (error) {
      const err = error as Error;
      const errorText = err.name === 'NotAllowedError'
        ? intl.formatMessage({
            id: 'settings.microphone.permissionDenied',
            defaultMessage: 'Доступ к микрофону запрещён. Разрешите доступ в браузере.'
          })
        : intl.formatMessage({
            id: 'settings.microphone.testFailed',
            defaultMessage: 'Не удалось запустить проверку микрофона. Проверьте устройство и разрешения.'
          });

      setErrorMessage(errorText);
      setTestState('error');
      message.error(errorText);
    }
  };

  const handleStopTest = () => {
    stopAudioTest();
    setTestState('idle');
    setErrorMessage('');
  };

  const statusText =
    testState === 'testing'
      ? intl.formatMessage({ id: 'settings.microphone.status.testing', defaultMessage: 'Проверка...' })
      : testState === 'ready'
        ? intl.formatMessage({ id: 'settings.microphone.status.ready', defaultMessage: 'Микрофон готов' })
        : testState === 'error'
          ? intl.formatMessage({ id: 'settings.microphone.status.error', defaultMessage: 'Нужна проверка' })
          : intl.formatMessage({ id: 'settings.microphone.status.pending', defaultMessage: 'Не проверено' });

  const statusClass =
    testState === 'ready'
      ? popoverStyles.deviceStatusSuccess
      : testState === 'error'
        ? popoverStyles.deviceStatusError
        : popoverStyles.deviceStatusIdle;

  const bars = Array.from({ length: 5 }, (_, index) => (
    <span
      key={index}
      className={`${popoverStyles.meterBar} ${audioLevel > 8 ? popoverStyles.meterBarActive : ''}`}
      style={{ height: getMeterHeight(audioLevel, index) }}
    />
  ));

  return (
    <div className={popoverStyles.deviceSection}>
      <div className={popoverStyles.deviceHeader}>
        <div>
          <div className={popoverStyles.deviceTitle}>
            {intl.formatMessage({ id: 'settings.microphone.title', defaultMessage: 'Проверка микрофона' })}
          </div>
          <div className={popoverStyles.deviceDescription}>
            {intl.formatMessage({
              id: 'settings.microphone.description',
              defaultMessage: 'Выберите входящее устройство, проверьте доступ и убедитесь, что сигнал слышен перед входом в комнату.'
            })}
          </div>
        </div>
        <span className={`${popoverStyles.deviceStatusBadge} ${statusClass}`}>{statusText}</span>
      </div>

      <div className={popoverStyles.deviceFieldBlock}>
        <Text className={popoverStyles.deviceLabel}>{intl.formatMessage({ id: 'settings.microphone.device', defaultMessage: 'Устройство ввода' })}</Text>
        <Select
          value={selectedDeviceId || undefined}
          onChange={(value) => {
            setSelectedDeviceId(value);
            if (stream) {
              stopAudioTest();
              setTestState('idle');
            }
          }}
          options={micOptions}
          placeholder={intl.formatMessage({
            id: 'settings.microphone.selectPlaceholder',
            defaultMessage: 'Выберите микрофон'
          })}
          className={popoverStyles.deviceSelect}
          disabled={testState === 'testing'}
        />
      </div>

      {errorMessage ? <Alert type="error" showIcon message={errorMessage} /> : null}

      <div className={popoverStyles.deviceActionRow}>
        <Button type="primary" onClick={handleStartTest} loading={testState === 'testing'} className={popoverStyles.deviceActionButton}>
          {intl.formatMessage({ id: 'settings.microphone.start', defaultMessage: 'Запустить проверку' })}
        </Button>
        <Button onClick={handleStopTest} disabled={!stream} className={popoverStyles.deviceActionButton}>
          {intl.formatMessage({ id: 'settings.microphone.stop', defaultMessage: 'Остановить' })}
        </Button>
      </div>

      <div className={popoverStyles.deviceSignalCard}>
        <div className={popoverStyles.deviceSignalHeader}>
          <Text className={popoverStyles.deviceLabel}>{intl.formatMessage({ id: 'settings.microphone.signal', defaultMessage: 'Уровень сигнала' })}</Text>
          <Text className={popoverStyles.deviceHelperText}>
            {stream
              ? intl.formatMessage({ id: 'settings.microphone.liveSignal', defaultMessage: 'Сигнал активен' })
              : intl.formatMessage({ id: 'settings.microphone.waitingSignal', defaultMessage: 'Говорите в микрофон и следите за полосками' })}
          </Text>
        </div>
        <div className={popoverStyles.meterRow}>{bars}</div>
      </div>
    </div>
  );
};

const CameraSection: React.FC = () => {
  const intl = useIntl();
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [testState, setTestState] = useState<DeviceTestState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const stopVideoTest = useCallback(() => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  }, [stream]);

  const loadDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      const errorText = intl.formatMessage({
        id: 'settings.camera.notSupported',
        defaultMessage: 'Браузер не поддерживает проверку камеры.'
      });
      setErrorMessage(errorText);
      setTestState('error');
      return;
    }

    const currentDevices = await navigator.mediaDevices.enumerateDevices();
    const videoInputs = currentDevices.filter((device) => device.kind === 'videoinput');

    setDevices(videoInputs);

    if (!selectedDeviceId && videoInputs[0]) {
      setSelectedDeviceId(videoInputs[0].deviceId);
    }
  }, [intl, selectedDeviceId]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadDevices();
    }, 0);

    const handleDeviceChange = () => {
      void loadDevices();
    };

    navigator.mediaDevices?.addEventListener('devicechange', handleDeviceChange);

    return () => {
      window.clearTimeout(timer);
      navigator.mediaDevices?.removeEventListener('devicechange', handleDeviceChange);
      stopVideoTest();
    };
  }, [loadDevices, stopVideoTest]);

  useEffect(() => {
    if (!videoRef.current) {
      return;
    }

    if (stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => undefined);
    } else {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  const cameraOptions = useMemo(() => devices.map((device) => ({
    value: device.deviceId,
    label: device.label || intl.formatMessage({
      id: 'settings.camera.deviceFallback'
    })
  })), [devices, intl]);

  const handleStartTest = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      const errorText = intl.formatMessage({
        id: 'settings.camera.notSupported'
      });
      setErrorMessage(errorText);
      setTestState('error');
      return;
    }

    if (!selectedDeviceId && devices.length === 0) {
      const errorText = intl.formatMessage({
        id: 'settings.camera.noDevice'
      });
      setErrorMessage(errorText);
      setTestState('error');
      message.warning(errorText);
      return;
    }

    stopVideoTest();
    setTestState('testing');
    setErrorMessage('');

    try {
      const nextStream = await navigator.mediaDevices.getUserMedia({
        video: selectedDeviceId ? { deviceId: { exact: selectedDeviceId } } : true,
        audio: false,
      });

      setStream(nextStream);
      setTestState('ready');
      await loadDevices();
    } catch (error) {
      const err = error as Error;
      const errorText = err.name === 'NotAllowedError'
        ? intl.formatMessage({
            id: 'settings.camera.permissionDenied'
          })
        : intl.formatMessage({
            id: 'settings.camera.testFailed'
          });

      setErrorMessage(errorText);
      setTestState('error');
      message.error(errorText);
    }
  };

  const handleStopTest = () => {
    stopVideoTest();
    setTestState('idle');
    setErrorMessage('');
  };

  const statusText =
    testState === 'testing'
      ? intl.formatMessage({ id: 'settings.camera.status.testing' })
      : testState === 'ready'
        ? intl.formatMessage({ id: 'settings.camera.status.ready' })
        : testState === 'error'
          ? intl.formatMessage({ id: 'settings.camera.status.error' })
          : intl.formatMessage({ id: 'settings.camera.status.pending' });

  const statusClass =
    testState === 'ready'
      ? popoverStyles.deviceStatusSuccess
      : testState === 'error'
        ? popoverStyles.deviceStatusError
        : popoverStyles.deviceStatusIdle;

  return (
    <div className={popoverStyles.deviceSection}>
      <div className={popoverStyles.deviceHeader}>
        <div>
          <div className={popoverStyles.deviceTitle}>
            {intl.formatMessage({ id: 'settings.camera.title' })}
          </div>
          <div className={popoverStyles.deviceDescription}>
            {intl.formatMessage({
              id: 'settings.camera.description'
            })}
          </div>
        </div>
        <span className={`${popoverStyles.deviceStatusBadge} ${statusClass}`}>{statusText}</span>
      </div>

      <div className={popoverStyles.deviceFieldBlock}>
        <Text className={popoverStyles.deviceLabel}>{intl.formatMessage({ id: 'settings.camera.device' })}</Text>
        <Select
          value={selectedDeviceId || undefined}
          onChange={(value) => {
            setSelectedDeviceId(value);
            if (stream) {
              stopVideoTest();
              setTestState('idle');
            }
          }}
          options={cameraOptions}
          placeholder={intl.formatMessage({
            id: 'settings.camera.selectPlaceholder'
          })}
          className={popoverStyles.deviceSelect}
          disabled={testState === 'testing'}
        />
      </div>

      {errorMessage ? <Alert type="error" showIcon message={errorMessage} /> : null}

      <div className={popoverStyles.videoPreviewWrap}>
        {stream ? (
          <video ref={videoRef} muted playsInline className={popoverStyles.videoPreview} />
        ) : (
          <div className={popoverStyles.videoPlaceholder}>
            <div className={popoverStyles.videoPlaceholderTitle}>
              {intl.formatMessage({ id: 'settings.camera.previewTitle' })}
            </div>
            <div>
              {intl.formatMessage({ id: 'settings.camera.previewHint' })}
            </div>
          </div>
        )}
      </div>

      <div className={popoverStyles.deviceActionRow}>
        <Button type="primary" onClick={handleStartTest} loading={testState === 'testing'} className={popoverStyles.deviceActionButton}>
          {intl.formatMessage({ id: 'settings.camera.start' })}
        </Button>
        <Button onClick={handleStopTest} disabled={!stream} className={popoverStyles.deviceActionButton}>
          {intl.formatMessage({ id: 'settings.camera.stop' })}
        </Button>
      </div>
    </div>
  );
};

export const SettingsPopover: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const intl = useIntl();
  const { loadSettings } = useSettingsStore();
  const { isAuthenticated } = useAuth();
  const { locale, setLocale, getAvailableLocales } = useLocaleStore();
  const languageOptions = getAvailableLocales();

  useEffect(() => {
    if (open && isAuthenticated) {
      loadSettings();
    }
  }, [open, isAuthenticated, loadSettings]);

  const content = (
    <div className={popoverStyles.popoverContent}>
      <Tabs
        items={[
          {
            key: 'general',
            label: intl.formatMessage({ id: 'settings.general' }),
            children: (
              <Space direction="vertical" className={popoverStyles.spaceFullWidth} size="middle">
                <div className={styles.settingsItem}>
                  <Space>
                    <MoonOutlined />
                    <Text>{intl.formatMessage({ id: 'settings.darkTheme' })}</Text>
                  </Space>
                  <Switch size="small" />
                </div>

                <Divider className={popoverStyles.dividerNoMargin} />

                <div className={styles.settingsItem}>
                  <Space>
                    <TranslationOutlined />
                    <Text>{intl.formatMessage({ id: 'settings.language' })}</Text>
                  </Space>
                  <select
                    className={styles.languageSelect}
                    value={locale}
                    onChange={(event) => setLocale(event.target.value as typeof locale)}
                  >
                    {languageOptions.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                </div>

                <Divider className={popoverStyles.dividerNoMargin} />

                <div className={styles.settingsItem}>
                  <Space>
                    <QuestionCircleOutlined />
                    <Text>{intl.formatMessage({ id: 'settings.about' })}</Text>
                  </Space>
                  <Button type="link" size="small" className={popoverStyles.buttonLinkNoPadding}>
                    {intl.formatMessage({ id: 'settings.learnMore' })}
                  </Button>
                </div>
              </Space>
            )
          },
          {
            key: 'microphone',
            label: (
              <span>
                <AudioOutlined /> {intl.formatMessage({ id: 'settings.microphone.tabLabel', defaultMessage: 'Микрофон' })}
              </span>
            ),
            children: <MicrophoneSection />
          },
          {
            key: 'camera',
            label: (
              <span>
                <VideoCameraOutlined /> {intl.formatMessage({ id: 'settings.camera.tabLabel', defaultMessage: 'Камера' })}
              </span>
            ),
            children: <CameraSection />
          },
          {
            key: 'background',
            label: (
              <span>
                <PictureOutlined /> {intl.formatMessage({ id: 'settings.background' })}
              </span>
            ),
            children: <BackgroundSection />
          }
        ]}
      />

      <Divider className={popoverStyles.dividerFooter} />
      <div className={styles.settingsFooter}>
        <Text type="secondary" className={popoverStyles.footerText}>
          VizorLite v1.0.0
        </Text>
      </div>
    </div>
  );

  return (
    <Popover
      content={content}
      title={intl.formatMessage({ id: 'settings.title' })}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="rightBottom"
      overlayClassName={styles.settingsPopover}
      arrow={false}
    >
      {children}
    </Popover>
  );
};