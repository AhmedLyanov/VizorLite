import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRegister, useLogin } from '../../../store/server/useAuth'
import { useIntl } from "react-intl"
import { AUTHENTICATION_TEXTS } from '../../../constants/authentication'
import styles from './Authentication.module.css'

type FormMode = 'login' | 'register'

export default function Authentication() {
  const intl = useIntl()
  const navigate = useNavigate()
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (mode === 'register') {
        if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
          return
        }
        await register(formData)
        navigate('/profile', { replace: true })
      } else {
        if (!formData.email.trim() || !formData.password.trim()) {
          return
        }
        await login({ email: formData.email, password: formData.password })
        navigate('/profile', { replace: true })
      }
    } catch (err) {
    }
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setFormData({
      username: '',
      email: '',
      password: '',
    })
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
          <input
            type="password"
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
        </div>

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