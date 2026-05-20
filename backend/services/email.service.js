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
const baseTemplate = (content, title = "VizorLite") => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #f5f7ff 0%, #e6e9ff 100%);
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      padding: 32px 16px;
    }
    .card {
      background: #ffffff;
      border-radius: 24px;
      box-shadow: 1px 1px 20px rgba(51, 51, 51, 0.1);
      overflow: hidden;
    }
    .header {
      padding: 32px 32px 16px;
      text-align: center;
      border-bottom: none;
    }
    .logo {
      font-size: 28px;
      font-weight: 700;
      color: #333333;
      letter-spacing: -0.5px;
      background: none;
    }
    .body {
      padding: 32px;
      color: #333333;
      line-height: 1.5;
    }
    .footer {
      background: #fafaff;
      padding: 24px 32px;
      text-align: center;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.5);
      border-top: none;
    }
    /* Белая кнопка как в дизайн-системе */
    .btn {
      display: inline-block;
      background: #ffffff;
      color: #333333;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 40px;
      font-weight: 600;
      font-size: 15px;
      margin: 20px 0 10px;
      box-shadow: 1px 1px 20px rgba(51, 51, 51, 0.2);
      transition: all 0.25s ease;
      border: none;
    }
    .btn:hover {
      background: #f8f9ff;
      box-shadow: 1px 1px 25px rgba(51, 51, 51, 0.2);
    }
    .code-block {
      background: #f5f7ff;
      font-size: 32px;
      font-weight: 700;
      letter-spacing: 6px;
      text-align: center;
      padding: 20px;
      border-radius: 16px;
      font-family: monospace;
      margin: 20px 0;
      border: none;
      color: #333;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.03);
    }
    .info-box {
      background: #f8f9fc;
      padding: 20px;
      border-radius: 16px;
      margin: 24px 0;
      border: none;
      box-shadow: none;
    }
    hr {
      border: none;
      border-top: 1px solid rgba(0, 0, 0, 0.08);
      margin: 24px 0;
    }
    @media (max-width: 480px) {
      .body {
        padding: 24px;
      }
      .btn {
        padding: 10px 20px;
        font-size: 14px;
      }
      .code-block {
        font-size: 24px;
        letter-spacing: 4px;
        padding: 16px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <span class="logo">VizorLite</span>
      </div>
      <div class="body">
        ${content}
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} VizorLite. Все права защищены.</p>
        <p style="margin-top: 8px;">
          <a href="${process.env.FRONTEND_URL}/unsubscribe" style="color: #888; text-decoration: underline;">Отписаться</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;

const templates = {
  [EmailType.VERIFICATION]: (data) => ({
    subject: "VizorLite: Подтверждение email",
    htmlContent: `
      <h2 style="margin-top: 0; font-size: 22px; font-weight: 600;">Добро пожаловать в VizorLite!</h2>
      <p style="font-size: 16px;">Для завершения регистрации используйте код подтверждения:</p>
      <div class="code-block">${data.code}</div>
      <p style="font-size: 14px; color: #666;">Код действителен <strong>10 минут</strong>.</p>
      <p style="font-size: 14px; color: #666;">Если вы не регистрировались, просто проигнорируйте это письмо.</p>
    `,
  }),

  [EmailType.WELCOME]: (data) => ({
    subject: `Добро пожаловать, ${data.username}!`,
    htmlContent: `
      <h2 style="margin-top: 0;">Привет, ${data.username}!</h2>
      <p style="font-size: 16px;">Ваш email успешно подтверждён. Аккаунт VizorLite активирован.</p>
      <p style="font-size: 16px;">Теперь вы можете создавать комнаты и проводить видеоконференции без ограничений.</p>
      <a href="${process.env.FRONTEND_URL}/profile" class="btn">Перейти в личный кабинет</a>
      <hr />
      <p style="font-size: 14px; color: #666;">Если у вас есть вопросы, мы всегда на связи: <a href="mailto:support@vizorlite.com" style="color: #333;">support@vizorlite.com</a></p>
    `,
  }),

  [EmailType.PASSWORD_RESET]: (data) => ({
    subject: "Восстановление пароля VizorLite",
    htmlContent: `
      <h2 style="margin-top: 0;">Запрос на сброс пароля</h2>
      <p style="font-size: 16px;">Вы получили это письмо, потому что запросили восстановление пароля.</p>
      <div class="code-block">${data.code}</div>
      <p style="font-size: 14px; color: #666;">Код действителен <strong>15 минут</strong>.</p>
      <p style="font-size: 14px; color: #666;">Если вы не запрашивали сброс, просто проигнорируйте это письмо.</p>
    `,
  }),

  [EmailType.PRO_SUBSCRIPTION]: (data) => ({
    subject: "VizorLite Pro успешно активирован",
    htmlContent: `
      <div style="text-align: center; font-size: 48px;">🚀</div>
      <h2 style="margin-top: 0; text-align: center;">Спасибо за покупку, ${data.username}!</h2>
      <p style="text-align: center; font-size: 16px;">Ваш Pro-план успешно активирован. Теперь вам доступны расширенные возможности платформы VizorLite.</p>
      
      <div class="info-box">
        <p><strong>План:</strong> VizorLite Pro</p>
        <p><strong>Сумма:</strong> ${data.amount}</p>
        <p><strong>Invoice ID:</strong> ${data.invoiceId}</p>
      </div>
      
      <div style="text-align: center;">
        <a href="${process.env.FRONTEND_URL}/pro" class="btn">Открыть VizorLite Pro</a>
      </div>
      
      <hr />
      <p style="font-size: 14px; text-align: center; color: #666;">Если вы не совершали эту оплату, свяжитесь с поддержкой.</p>
    `,
  }),

  [EmailType.PAYMENT_RECEIPT]: (data) => ({
    subject: "Чек об оплате VizorLite",
    htmlContent: `
      <h2 style="margin-top: 0;">Спасибо за оплату, ${data.username}!</h2>
      <p style="font-size: 16px;">Ниже детали вашего платежа:</p>
      <div class="info-box">
        <p><strong>📆 Дата:</strong> ${data.date}</p>
        <p><strong>💰 Сумма:</strong> ${data.amount}</p>
        <p><strong>🧾 Номер чека:</strong> ${data.invoiceId}</p>
      </div>
      <p style="font-size: 14px;">Чек также доступен в <a href="${process.env.FRONTEND_URL}/billing" style="color: #333;">личном кабинете</a>.</p>
    `,
  }),
};

export const sendEmailByType = async ({ to, type, data }) => {
  const templateFn = templates[type];
  if (!templateFn) {
    throw new Error(`Неизвестный тип письма: ${type}`);
  }

  const { subject, htmlContent } = templateFn(data);
  const fullHtml = baseTemplate(htmlContent, subject);

  const transporter = getTransporter();

  try {
    const info = await transporter.sendMail({
      from: `"VizorLite" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html: fullHtml,
    });

    console.log(`✅ Email [${type}] отправлен на ${to} | messageId: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`❌ Ошибка отправки [${type}] на ${to}:`, error);
    throw error;
  }
};

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = getTransporter();
  return transporter.sendMail({
    from: `"VizorLite" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html: baseTemplate(html, subject),
  });
};