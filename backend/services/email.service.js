import nodemailer from "nodemailer";
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

export const EmailType = {
  VERIFICATION: "email_verification",
  WELCOME: "welcome",
  PASSWORD_RESET: "password_reset",
  PAYMENT_RECEIPT: "payment_receipt",
  PRO_SUBSCRIPTION: "pro_subscription",
};

let transporter = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return transporter;
};

const templates = {
  [EmailType.VERIFICATION]: (data) => ({
    subject: "VizorLite: Подтверждение email",
    html: `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h2>Добро пожаловать в VizorLite!</h2>

        <p>Ваш код подтверждения email:</p>

        <h1 style="
          font-size: 40px;
          background: #f0f0f0;
          padding: 10px;
          text-align: center;
          border-radius: 10px;
        ">
          ${data.code}
        </h1>

        <p>Код действителен 10 минут.</p>

        <p>Если вы не регистрировались, проигнорируйте это письмо.</p>

        <hr/>

        <p>— Команда VizorLite</p>
      </div>
    `,
  }),

  [EmailType.WELCOME]: (data) => ({
    subject: `Добро пожаловать, ${data.username}!`,
    html: `
      <div style="font-family: sans-serif;">
        <h2>Привет, ${data.username}!</h2>

        <p>
          Ваш email успешно подтверждён.
          Аккаунт VizorLite активирован.
        </p>

        <p>
          Теперь вы можете создавать комнаты
          и проводить видеоконференции.
        </p>

        <a
          href="${process.env.FRONTEND_URL}/profile"
          style="
            background: #4f46e5;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
          "
        >
          Перейти в личный кабинет
        </a>

        <br/><br/>

        <p>— Команда VizorLite</p>
      </div>
    `,
  }),

  [EmailType.PASSWORD_RESET]: (data) => ({
    subject: "Восстановление пароля VizorLite",
    html: `
      <div style="font-family: sans-serif;">
        <h2>Запрос на сброс пароля</h2>

        <p>
          Используйте этот код для восстановления пароля:
        </p>

        <h1 style="
          font-size: 40px;
          background: #f0f0f0;
          padding: 10px;
          text-align: center;
          border-radius: 10px;
        ">
          ${data.code}
        </h1>

        <p>Код действителен 15 минут.</p>

        <p>
          Если вы не запрашивали сброс,
          просто проигнорируйте это письмо.
        </p>
      </div>
    `,
  }),

  [EmailType.PRO_SUBSCRIPTION]: (data) => ({
    subject: "🎉 VizorLite Pro успешно активирован",
    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: 0 auto;
        background: #ffffff;
        border-radius: 16px;
        overflow: hidden;
        border: 1px solid #ececec;
      ">

        <div style="
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 40px 30px;
          text-align: center;
          color: white;
        ">
          <h1 style="
            margin: 0;
            font-size: 32px;
          ">
            VizorLite Pro
          </h1>

          <p style="
            margin-top: 10px;
            font-size: 16px;
            opacity: .95;
          ">
            Подписка успешно активирована
          </p>
        </div>

        <div style="padding: 35px; color: #333;">
          <h2>
            Спасибо за покупку, ${data.username}!
          </h2>

          <p style="line-height: 1.7;">
            Ваш Pro-план успешно активирован.
            Теперь вам доступны расширенные
            возможности платформы VizorLite.
          </p>

          <div style="
            background: #f7f7f7;
            padding: 20px;
            border-radius: 12px;
            margin: 25px 0;
          ">
            <p><strong>План:</strong> VizorLite Pro</p>
            <p><strong>Сумма:</strong> ${data.amount}</p>
            <p><strong>Invoice ID:</strong> ${data.invoiceId}</p>
          </div>

          <a
            href="${process.env.FRONTEND_URL}/pricing"
            style="
              display: inline-block;
              background: #111827;
              color: white;
              padding: 14px 24px;
              border-radius: 10px;
              text-decoration: none;
              font-weight: 600;
            "
          >
            Открыть VizorLite
          </a>

          <p style="
            margin-top: 35px;
            color: #777;
            font-size: 14px;
          ">
            Если вы не совершали эту оплату,
            свяжитесь с поддержкой.
          </p>
        </div>
      </div>
    `,
  }),
};

export const sendEmailByType = async ({ to, type, data }) => {
  const templateFn = templates[type];

  if (!templateFn) {
    throw new Error(`Неизвестный тип письма: ${type}`);
  }

  const { subject, html } = templateFn(data);

  const transporter = getTransporter();

  try {
    const info = await transporter.sendMail({
      from: `"VizorLite" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log(
      `✅ Email [${type}] отправлен на ${to} | messageId: ${info.messageId}`
    );

    return info;
  } catch (error) {
    console.error(
      `❌ Ошибка отправки [${type}] на ${to}:`,
      error
    );

    throw error;
  }
};

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = getTransporter();

  return transporter.sendMail({
    from: `"VizorLite" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });
};