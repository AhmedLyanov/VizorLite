import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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

// 🔥 regex
const phoneRegex = /^0 \(\d{3}\) \d{3} \d{2}-\d{2}$/;

// 🔥 маска
const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  let result = "0";

  if (digits.length > 1) {
    result += " (" + digits.slice(1, 4);
  }
  if (digits.length >= 4) {
    result += ") " + digits.slice(4, 7);
  }
  if (digits.length >= 7) {
    result += " " + digits.slice(7, 9);
  }
  if (digits.length >= 9) {
    result += "-" + digits.slice(9, 11);
  }

  return result;
};

// 🔥 схемы
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});

const registerSchema = z.object({
  username: z.string().min(2, "Min 2 characters"),
  phone: z.string().regex(phoneRegex, "Format: 0 (000) 000 00-00"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters"),
});

const verifySchema = z.object({
  code: z.string().min(4, "Code required"),
});

export default function Authentication() {
  const intl = useIntl();

  const [mode, setMode] = useState<FormMode>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const { mutateAsync: registerUser, isPending: registerPending } = useRegister();
  const { mutateAsync: loginUser, isPending: loginPending } = useLogin();
  const { mutateAsync: verifyUser, isPending: verifyPending } = useVerifyEmail();

  const isPending = registerPending || loginPending || verifyPending;

  const schema =
    mode === "login"
      ? loginSchema
      : mode === "register"
      ? registerSchema
      : verifySchema;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<any>({
    resolver: zodResolver(schema),
    mode: "onChange", // 🔥 важно
  });

  const onSubmit = async (data: any) => {
    try {
      if (mode === "register") {
        console.log("REGISTER DATA:", data);

        const res = await registerUser(data);
        setUserId(res.userId);
        setMode("verify");
        reset();
        return;
      }

      if (mode === "verify") {
        if (!userId) return;

        await verifyUser({
          userId,
          code: data.code,
        });

        return;
      }

      if (mode === "login") {
        await loginUser(data);
      }
    } catch (err) {
      console.error("AUTH ERROR:", err);
    }
  };

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login");
    reset();
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

      <form className={styles.authForm} onSubmit={handleSubmit(onSubmit)}>
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
            <label className={styles.formLabel}>Username</label>

            <input {...register("username")} className={styles.formInput} />

            {errors.username && (
              <span className={styles.error}>
                {errors.username.message as string}
              </span>
            )}
          </div>
        )}
        {mode === "register" && (
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Phone</label>

            <input
              className={styles.formInput}
              placeholder="0 (000) 000 00-00"
              {...register("phone")}
              onChange={(e) => {
                const formatted = formatPhone(e.target.value);
                setValue("phone", formatted, { shouldValidate: true });
              }}
            />

            {errors.phone && (
              <span className={styles.error}>
                {errors.phone.message as string}
              </span>
            )}
          </div>
        )}
        {mode !== "verify" && (
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Email</label>

            <input
              type="email"
              {...register("email")}
              className={styles.formInput}
            />

            {errors.email && (
              <span className={styles.error}>
                {errors.email.message as string}
              </span>
            )}
          </div>
        )}
        {mode !== "verify" && (
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Password</label>

            <div className={styles.passwordInputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                className={styles.formInput}
              />

              <button
                type="button"
                className={styles.showPasswordButton}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <img src={showPassword ? eyeOn : eyeOff} alt="" />
              </button>
            </div>

            {errors.password && (
              <span className={styles.error}>
                {errors.password.message as string}
              </span>
            )}
          </div>
        )}
        {mode === "verify" && (
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Code</label>

            <input
              {...register("code")}
              className={styles.formInput}
              placeholder="123456"
            />

            {errors.code && (
              <span className={styles.error}>
                {errors.code.message as string}
              </span>
            )}
          </div>
        )}

        <button
          type="submit"
          className={styles.submitButton}
          disabled={!isValid || isPending}
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