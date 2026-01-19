import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';

import { ThemeProvider, useTheme } from '@/contexts/theme-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootLayoutContent() {
  const { actualTheme } = useTheme();

  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            if (__DEV__) {
              console.log('Service Worker registrado com sucesso:', registration.scope);
            }
          })
          .catch((error) => {
            if (__DEV__) {
              console.log('Falha ao registrar Service Worker:', error);
            }
          });
      });
    }
  }, []);

  return (
    <NavigationThemeProvider value={actualTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="result" options={{ presentation: 'card', title: 'Resultado' }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={actualTheme === 'dark' ? 'light' : 'dark'} />
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
