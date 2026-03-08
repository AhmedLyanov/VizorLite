import { useState, useRef } from 'react'
import { useRegister, useLogin } from '../../entities/user/useAuth'
import { useIntl } from "react-intl"
import { AUTHENTICATION_TEXTS } from '../../shared/constants/authentication'
import eyeOn from "../../shared/assets/eye-on.svg";
import eyeOff from "../../shared/assets/eye-off.svg";

import { RecaptchaWidget, type RecaptchaWidgetRef } from '../../shared/ui/recaptcha/RecaptchaWidget'
import styles from './Authentication.module.css'

type FormMode = 'login' | 'register'

export default function Authentication() {
  const intl = useIntl()
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<FormMode>('login')

  const { mutateAsync: register, isPending: isRegisterPending, isError: isRegisterError, error: registerError } = useRegister()
  const { mutateAsync: login, isPending: isLoginPending, isError: isLoginError, error: loginError } = useLogin()

  const isPending = isRegisterPending || isLoginPending
  const isError = isRegisterError || isLoginError
  const error = registerError || loginError

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  })


  const [recaptchaToken, setRecaptchaToken] = useState<string>('')
  const [recaptchaError, setRecaptchaError] = useState<string>('')
  

  const recaptchaRef = useRef<RecaptchaWidgetRef>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }


  const handleRecaptchaVerify = (token: string) => {
    setRecaptchaToken(token)
    setRecaptchaError('')
  }

  const handleRecaptchaExpire = () => {
    setRecaptchaToken('')
    setRecaptchaError('reCAPTCHA expired. Please verify again.')
  }

  const handleRecaptchaError = () => {
    setRecaptchaToken('')
    setRecaptchaError('reCAPTCHA error. Please try again.')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecaptchaError('') 

    try {
      if (mode === 'register') {
        if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
          return;
        }
        

        if (!recaptchaToken) {
          setRecaptchaError('Please complete the reCAPTCHA verification')
          return;
        }


        await register({ 
          ...formData, 
          recaptchaToken 
        });
      } else {
        if (!formData.email.trim() || !formData.password.trim()) {
          return;
        }
        await login({ email: formData.email, password: formData.password });
      }
    } catch (err: any) {
      if (err?.response?.data?.error === 'RECAPTCHA_FAILED') {
        setRecaptchaError('reCAPTCHA verification failed. Please try again.')
        recaptchaRef.current?.reset() 
        setRecaptchaToken('')
      }
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setFormData({
      username: '',
      email: '',
      password: '',
    })

    setRecaptchaToken('')
    setRecaptchaError('')
    recaptchaRef.current?.reset()
  }

  return (
    <div className={styles.authenticationContainer}>
      <div className={styles.modeSelector}>
        <button
          type="button"
          className={`${styles.modeButton} ${mode === 'login' ? styles.active : ''}`}
          onClick={() => setMode('login')}
        >
          {intl.formatMessage({ id: AUTHENTICATION_TEXTS.FORM.LOGIN_BUTTON })}
        </button>
        <button
          type="button"
          className={`${styles.modeButton} ${mode === 'register' ? styles.active : ''}`}
          onClick={() => setMode('register')}
        >
          {intl.formatMessage({ id: AUTHENTICATION_TEXTS.FORM.REGISTER_BUTTON })}
        </button>
      </div>

      <form className={styles.authForm} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>
          {mode === 'login'
            ? intl.formatMessage({ id: AUTHENTICATION_TEXTS.FORM.LOGIN_TITLE })
            : intl.formatMessage({ id: AUTHENTICATION_TEXTS.FORM.REGISTER_TITLE })
          }
        </h2>

        {mode === 'register' && (
          <div className={styles.formGroup}>
            <label htmlFor="username" className={styles.formLabel}>
              {intl.formatMessage({ id: AUTHENTICATION_TEXTS.FORM.USERNAME_LABEL })}
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={styles.formInput}
              placeholder={intl.formatMessage({ id: AUTHENTICATION_TEXTS.FORM.USERNAME_PLACEHOLDER })}
              required={mode === 'register'}
              disabled={isPending}
            />
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>
            {intl.formatMessage({ id: AUTHENTICATION_TEXTS.FORM.EMAIL_LABEL })}
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.formInput}
            placeholder={intl.formatMessage({ id: AUTHENTICATION_TEXTS.FORM.EMAIL_PLACEHOLDER })}
            required
            disabled={isPending}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.formLabel}>
            {intl.formatMessage({ id: AUTHENTICATION_TEXTS.FORM.PASSWORD_LABEL })}
          </label>
          <div className={styles.passwordInputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={styles.formInput}
              placeholder={intl.formatMessage({ id: AUTHENTICATION_TEXTS.FORM.PASSWORD_PLACEHOLDER })}
              required
              disabled={isPending}
              minLength={6}
            />
            <button
              type="button"
              className={styles.showPasswordButton}
              onClick={() => setShowPassword(prev => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              disabled={isPending}
            >
              <img src={showPassword ? eyeOn : eyeOff} alt="" />
            </button>
          </div>
        </div>


        {mode === 'register' && (
          <div className={styles.recaptchaContainer}>
            <RecaptchaWidget
              ref={recaptchaRef}
              onVerify={handleRecaptchaVerify}
              onExpire={handleRecaptchaExpire}
              onError={handleRecaptchaError}
              theme="light"
              size="normal"
            />
            {recaptchaError && (
              <span className={styles.recaptchaError} role="alert">
                {recaptchaError}
              </span>
            )}
          </div>
        )}

        {isError && (
          <div className={styles.errorMessage}>
            {error instanceof Error ? error.message : `${mode === 'login' ? 'Login' : 'Registration'} failed`}
          </div>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isPending}
        >
          {isPending ? (
            mode === 'login' ? 'Logging in...' : 'Creating account...'
          ) : (
            mode === 'login'
              ? intl.formatMessage({ id: AUTHENTICATION_TEXTS.FORM.LOGIN_SUBMIT })
              : intl.formatMessage({ id: AUTHENTICATION_TEXTS.FORM.REGISTER_SUBMIT })
          )}
        </button>

        <div className={styles.switchMode}>
          <p className={styles.switchText}>
            {mode === 'login'
              ? intl.formatMessage({ id: AUTHENTICATION_TEXTS.FORM.NO_ACCOUNT })
              : intl.formatMessage({ id: AUTHENTICATION_TEXTS.FORM.HAVE_ACCOUNT })
            }
          </p>
          <button
            type="button"
            className={styles.switchButton}
            onClick={toggleMode}
            disabled={isPending}
          >
            {mode === 'login'
              ? intl.formatMessage({ id: AUTHENTICATION_TEXTS.FORM.CREATE_ACCOUNT })
              : intl.formatMessage({ id: AUTHENTICATION_TEXTS.FORM.GO_TO_LOGIN })
            }
          </button>
        </div>
      </form>
    </div>
  )
}