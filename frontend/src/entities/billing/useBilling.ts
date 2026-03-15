import { stripeApi } from "../../shared/api/stripeApi";

export function useBilling() {
  const startCheckout = async () => {
    try {
      const data = await stripeApi.createCheckout();
      window.location.href = data.url;
    } catch (error) {
      console.error("Checkout error", error);
    }
  };

  return {
    startCheckout,
  };
}
