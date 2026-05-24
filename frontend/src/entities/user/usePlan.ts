import { useAuth } from './AuthContext';

export const usePlan = () => {
  const { user } = useAuth();
  const isPro = user?.plan === 'pro';
  const plan = user?.plan || 'free';
  return { isPro, plan };
};