import { useTheme } from '@/contexts/theme-context';

export function useColorScheme() {
  const { actualTheme } = useTheme();
  return actualTheme;
}
