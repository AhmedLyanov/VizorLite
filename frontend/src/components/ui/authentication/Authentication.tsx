 import { useState } from 'react'
import { useRegister } from '../../../store/server/useAuth'
import { useIntl } from "react-intl"
import { AUTHENTICATION_TEXTS } from '../../../constants/authentication'
import styles from './Authentication.module.css'

export default function Authentication() {
  const intl = useIntl()
  const { 
    mutate: register, 
    isPending,  
    isError, 
    error 
  } = useRegister()
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      return
    }
    
    register(formData)
  }
  
  return (
    <form className={styles.registrationForm} onSubmit={handleSubmit}>
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
          required
          disabled={isPending}
        />
      </div>
      
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
      
      {/* Показ ошибки */}
      {isError && (
        <div className={styles.errorMessage}>
          {error instanceof Error ? error.message : 'Registration failed'}
        </div>
      )}
      
      <button 
        type="submit" 
        className={styles.submitButton}
        disabled={isPending}
      >
        {isPending ? (
          'Creating account...'
        ) : (
          intl.formatMessage({ id: AUTHENTICATION_TEXTS.FORM.SUBMIT_BUTTON })
        )}
      </button>
    </form>
  )
}