export const AUTHENTICATION_TEXTS = {
  HERO: {
    TITLE: "authentication.main.title",
  },
  FORM: {
    USERNAME_LABEL: "authentication.form.username.label",
    USERNAME_PLACEHOLDER: "authentication.form.username.placeholder",
    EMAIL_LABEL: "authentication.form.email.label",
    EMAIL_PLACEHOLDER: "authentication.form.email.placeholder",
    PASSWORD_LABEL: "authentication.form.password.label",
    PASSWORD_PLACEHOLDER: "authentication.form.password.placeholder",
    SUBMIT_BUTTON: "authentication.form.submit.button",
    
    // Добавленные тексты для переключения режимов
    LOGIN_BUTTON: "authentication.form.login.button",
    REGISTER_BUTTON: "authentication.form.register.button",
    LOGIN_TITLE: "authentication.form.login.title",
    REGISTER_TITLE: "authentication.form.register.title",
    LOGIN_SUBMIT: "authentication.form.login.submit",
    REGISTER_SUBMIT: "authentication.form.register.submit",
    
    // Добавленные тексты для сообщений
    NO_ACCOUNT: "authentication.form.noAccount",
    HAVE_ACCOUNT: "authentication.form.haveAccount",
    CREATE_ACCOUNT: "authentication.form.createAccount",
    GO_TO_LOGIN: "authentication.form.goToLogin",
    
    // Добавленные тексты для валидации/сообщений
    LOGIN_FAILED: "authentication.form.login.failed",
    REGISTRATION_FAILED: "authentication.form.registration.failed",
    LOGGING_IN: "authentication.form.logging.in",
    CREATING_ACCOUNT: "authentication.form.creating.account",
    
    // Добавленные тексты для валидации полей
    REQUIRED_FIELD: "authentication.form.required.field",
    INVALID_EMAIL: "authentication.form.invalid.email",
    PASSWORD_MIN_LENGTH: "authentication.form.password.min.length",
    
    // Добавленные тексты для состояния загрузки
    LOADING: "authentication.form.loading",
  },
  LINKS: {
    HAVE_ACCOUNT: "authentication.links.haveAccount",
    NO_ACCOUNT: "authentication.links.noAccount",
    FORGOT_PASSWORD: "authentication.links.forgotPassword",
    RESET_PASSWORD: "authentication.links.resetPassword",
  },
  MESSAGES: {
    SUCCESS: {
      LOGIN: "authentication.messages.success.login",
      REGISTRATION: "authentication.messages.success.registration",
      LOGOUT: "authentication.messages.success.logout",
    },
    ERROR: {
      INVALID_CREDENTIALS: "authentication.messages.error.invalidCredentials",
      USER_EXISTS: "authentication.messages.error.userExists",
      NETWORK_ERROR: "authentication.messages.error.networkError",
      SERVER_ERROR: "authentication.messages.error.serverError",
    },
    INFO: {
      SESSION_EXPIRED: "authentication.messages.info.sessionExpired",
      PASSWORD_RESET_SENT: "authentication.messages.info.passwordResetSent",
    }
  },
  VALIDATION: {
    USERNAME: {
      REQUIRED: "authentication.validation.username.required",
      MIN_LENGTH: "authentication.validation.username.minLength",
      MAX_LENGTH: "authentication.validation.username.maxLength",
      INVALID_CHARACTERS: "authentication.validation.username.invalidCharacters",
    },
    EMAIL: {
      REQUIRED: "authentication.validation.email.required",
      INVALID_FORMAT: "authentication.validation.email.invalidFormat",
    },
    PASSWORD: {
      REQUIRED: "authentication.validation.password.required",
      MIN_LENGTH: "authentication.validation.password.minLength",
      WEAK_PASSWORD: "authentication.validation.password.weak",
      NO_MATCH: "authentication.validation.password.noMatch",
    },
    CONFIRM_PASSWORD: {
      REQUIRED: "authentication.validation.confirmPassword.required",
      NO_MATCH: "authentication.validation.confirmPassword.noMatch",
    }
  },
  PLACEHOLDERS: {
    CONFIRM_PASSWORD: "authentication.placeholders.confirmPassword",
    NEW_PASSWORD: "authentication.placeholders.newPassword",
    CURRENT_PASSWORD: "authentication.placeholders.currentPassword",
  },
  LABELS: {
    REMEMBER_ME: "authentication.labels.rememberMe",
    KEEP_LOGGED_IN: "authentication.labels.keepLoggedIn",
    AGREE_TO_TERMS: "authentication.labels.agreeToTerms",
    PRIVACY_POLICY: "authentication.labels.privacyPolicy",
    TERMS_OF_SERVICE: "authentication.labels.termsOfService",
  },
  BUTTONS: {
    CANCEL: "authentication.buttons.cancel",
    BACK: "authentication.buttons.back",
    NEXT: "authentication.buttons.next",
    CONTINUE: "authentication.buttons.continue",
    RESEND_CODE: "authentication.buttons.resendCode",
    VERIFY_EMAIL: "authentication.buttons.verifyEmail",
  },
  TITLES: {
    LOGIN_PAGE: "authentication.titles.loginPage",
    REGISTER_PAGE: "authentication.titles.registerPage",
    FORGOT_PASSWORD_PAGE: "authentication.titles.forgotPasswordPage",
    RESET_PASSWORD_PAGE: "authentication.titles.resetPasswordPage",
    VERIFY_EMAIL_PAGE: "authentication.titles.verifyEmailPage",
  },
  DESCRIPTIONS: {
    LOGIN: "authentication.descriptions.login",
    REGISTER: "authentication.descriptions.register",
    FORGOT_PASSWORD: "authentication.descriptions.forgotPassword",
    RESET_PASSWORD: "authentication.descriptions.resetPassword",
  },
  HEADINGS: {
    WELCOME_BACK: "authentication.headings.welcomeBack",
    CREATE_ACCOUNT: "authentication.headings.createAccount",
    RESET_YOUR_PASSWORD: "authentication.headings.resetYourPassword",
    CHECK_YOUR_EMAIL: "authentication.headings.checkYourEmail",
  },
  SUBTITLES: {
    ENTER_CREDENTIALS: "authentication.subtitles.enterCredentials",
    FILL_DETAILS: "authentication.subtitles.fillDetails",
    ENTER_EMAIL_RESET: "authentication.subtitles.enterEmailReset",
  }
} as const;