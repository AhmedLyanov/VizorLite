import axios from 'axios';

class RecaptchaService {
  constructor(secretKey, verifyUrl) {
    this.secretKey = secretKey;
    this.verifyUrl = verifyUrl;
  }

  async verify(token, remoteIp) {
    if (!token) {
      return { success: false, error: 'recaptcha_token_missing' };
    }

    try {
      const { data } = await axios.post(this.verifyUrl, null, {
        params: {
          secret: this.secretKey,
          response: token,
          remoteip: remoteIp,
        },
        timeout: 5000,
      });

      if (!data.success) {
        return {
          success: false,
          error: data['error-codes']?.[0] || 'recaptcha_verification_failed'
        };
      }

      return { success: true };
    } catch (error) {
      console.error('[RecaptchaService] Verification error:', error.message);
      return { success: false, error: 'recaptcha_service_error' };
    }
  }
}

export default RecaptchaService;