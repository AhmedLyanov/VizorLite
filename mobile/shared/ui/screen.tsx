import { SafeAreaView } from 'react-native-safe-area-context';
import { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface ScreenProps {
  children: ReactNode;
  className?: string;
}

export function Screen({ children, className }: ScreenProps) {
  return <SafeAreaView className={cn('flex-1', className)}>{children}</SafeAreaView>;
}

export default Screen;   