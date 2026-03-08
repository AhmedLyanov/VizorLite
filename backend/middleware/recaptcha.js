import RecaptchaService from '../services/recaptcha.service.js';

const recaptchaService = new RecaptchaService(
  process.env.RECAPTCHA_SECRET_KEY,
  process.env.RECAPTCHA_VERIFY_URL
);

export const validateRecaptcha = async (req, res, next) => {
  const { recaptchaToken } = req.body;
  const remoteIp = req.ip || req.connection.remoteAddress;

  const result = await recaptchaService.verify(recaptchaToken, remoteIp);

  if (!result.success) {
    return res.status(400).json({
      error: 'RECAPTCHA_FAILED',
      message: 'Please complete the reCAPTCHA verification',
      details: result.error,
    });
  }

  next();
};