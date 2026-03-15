import { useState } from "react";
import {
  useRegister,
  useLogin,
  useVerifyEmail,
} from "../../entities/user/useAuth";
import { useIntl } from "react-intl";
import { AUTHENTICATION_TEXTS } from "../../shared/constants/authentication";
import eyeOn from "../../shared/assets/eye-on.svg";
import eyeOff from "../../shared/assets/eye-off.svg";
import styles from "./Authentication.module.css";

type FormMode = "login" | "register" | "verify";

export default function Authentication() {
  const intl = useIntl();

  const [mode, setMode] = useState<FormMode>("login");
  const [showPassword, setShowPassword] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [code, setCode] = useState("");

  const { mutateAsync: register, isPending: registerPending } = useRegister();
  const { mutateAsync: login, isPending: loginPending } = useLogin();
  const { mutateAsync: verify, isPending: verifyPending } = useVerifyEmail();

  const isPending = registerPending || loginPending || verifyPending;

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (mode === "register") {
        const res = await register(formData);

        setUserId(res.userId);

        setMode("verify");

        return;
      }

      if (mode === "verify") {
        if (!code.trim() || !userId) return;

        await verify({
          userId,
          code,
        });

        return;
      }

      if (mode === "login") {
        await login({
          email: formData.email,
          password: formData.password,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");

    setFormData({
      username: "",
      email: "",
      password: "",
    });

    setCode("");
  };

  return (
    <div className={styles.authenticationContainer}>
      {mode !== "verify" && (
        <div className={styles.modeSelector}>
          <button
            type="button"
            className={`${styles.modeButton} ${mode === "login" ? styles.active : ""}`}
            onClick={() => setMode("login")}
          >
            {intl.formatMessage({ id: AUTHENTICATION_TEXTS.FORM.LOGIN_BUTTON })}
          </button>

          <button
            type="button"
            className={`${styles.modeButton} ${mode === "register" ? styles.active : ""}`}
            onClick={() => setMode("register")}
          >
            {intl.formatMessage({
              id: AUTHENTICATION_TEXTS.FORM.REGISTER_BUTTON,
            })}
          </button>
        </div>
      )}

      <form className={styles.authForm} onSubmit={handleSubmit}>
        <h2 className={styles.formTitle}>
          {mode === "login" &&
            intl.formatMessage({ id: AUTHENTICATION_TEXTS.FORM.LOGIN_TITLE })}

          {mode === "register" &&
            intl.formatMessage({
              id: AUTHENTICATION_TEXTS.FORM.REGISTER_TITLE,
            })}

          {mode === "verify" && "Verify Email"}
        </h2>

        {mode === "register" && (
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              {intl.formatMessage({
                id: AUTHENTICATION_TEXTS.FORM.USERNAME_LABEL,
              })}
            </label>

            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>
        )}

        {mode !== "verify" && (
          <>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                {intl.formatMessage({
                  id: AUTHENTICATION_TEXTS.FORM.EMAIL_LABEL,
                })}
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={styles.formInput}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                {intl.formatMessage({
                  id: AUTHENTICATION_TEXTS.FORM.PASSWORD_LABEL,
                })}
              </label>

              <div className={styles.passwordInputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={styles.formInput}
                  required
                />

                <button
                  type="button"
                  className={styles.showPasswordButton}
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  <img src={showPassword ? eyeOn : eyeOff} alt="" />
                </button>
              </div>
            </div>
          </>
        )}

        {mode === "verify" && (
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Enter verification code</label>

            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={styles.formInput}
              placeholder="123456"
              required
            />
          </div>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isPending}
        >
          {mode === "login" && "Login"}
          {mode === "register" && "Create account"}
          {mode === "verify" && "Verify"}
        </button>

        {mode !== "verify" && (
          <div className={styles.switchMode}>
            <p className={styles.switchText}>
              {mode === "login"
                ? intl.formatMessage({
                    id: AUTHENTICATION_TEXTS.FORM.NO_ACCOUNT,
                  })
                : intl.formatMessage({
                    id: AUTHENTICATION_TEXTS.FORM.HAVE_ACCOUNT,
                  })}
            </p>

            <button
              type="button"
              className={styles.switchButton}
              onClick={toggleMode}
            >
              {mode === "login"
                ? intl.formatMessage({
                    id: AUTHENTICATION_TEXTS.FORM.CREATE_ACCOUNT,
                  })
                : intl.formatMessage({
                    id: AUTHENTICATION_TEXTS.FORM.GO_TO_LOGIN,
                  })}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
