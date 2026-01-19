import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, Share, Platform, Alert, Animated } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useTheme } from '@/contexts/theme-context';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const themeContext = useTheme();
  const { theme, setTheme, actualTheme } = themeContext || { theme: 'auto', setTheme: () => {}, actualTheme: 'light' };
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleScan = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(tabs)/scan');
  };

  const toggleTheme = () => {
    if (theme === 'auto') {
      setTheme(actualTheme === 'light' ? 'dark' : 'light');
    } else if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  const handleShareApp = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      const shareMessage = '🔍 BHT Detector - Detecte BHT em rótulos de alimentos!\n\nUse sua câmera para escanear ingredientes e descubra se o produto contém BHT (Butylated Hydroxytoluene).\n\nhttps://bhtdetector.com.br';
      
      if (Platform.OS === 'web') {
        if (navigator.share) {
          await navigator.share({
            title: 'BHT Detector',
            text: shareMessage,
            url: 'https://bhtdetector.com.br',
          });
        } else {
          await navigator.clipboard.writeText(shareMessage);
          Alert.alert('Copiado!', 'Link do app copiado para a área de transferência.');
        }
      } else {
        await Share.share({
          message: shareMessage,
          title: 'BHT Detector',
        });
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Erro ao compartilhar app:', error);
      }
    }
  };

  const backgroundImageUrl = 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={{ uri: backgroundImageUrl }}
          style={styles.headerImage}
          contentFit="cover"
          transition={200}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Detector de BHT</ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Como usar</ThemedText>
        <ThemedText>
          Use a câmera para escanear o rótulo de um alimento e descubra se ele contém BHT
          (Butylated Hydroxytoluene) na lista de ingredientes.
        </ThemedText>
      </ThemedView>

      <Animated.View
        style={[
          styles.stepContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.scanButton}
          onPress={handleScan}
          accessibilityLabel="Escanear rótulo de alimento para detectar BHT"
          accessibilityRole="button"
          accessibilityHint="Abre a câmera para escanear o rótulo do alimento"
        >
          <IconSymbol
            name="camera.fill"
            size={32}
            color="#fff"
          />
          <ThemedText style={styles.scanButtonText}>Escanear Rótulo</ThemedText>
        </TouchableOpacity>
      </Animated.View>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Sobre o BHT</ThemedText>
        <ThemedText>
          O BHT (Butylated Hydroxytoluene) é um antioxidante sintético usado como conservante
          em alimentos. Pessoas com <ThemedText type="defaultSemiBold">alergia ao BHT</ThemedText> precisam 
          evitar produtos que contenham este aditivo para prevenir reações alérgicas.
        </ThemedText>
        <ThemedText style={{ marginTop: 12 }}>
          Use nosso detector de BHT gratuito para verificar rapidamente se seus alimentos contêm
          este conservante. Basta escanear o rótulo com sua câmera e descobrir instantaneamente
          se o produto contém BHT na lista de ingredientes, ajudando você a evitar reações alérgicas.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <TouchableOpacity
          style={[styles.shareAppButton, { borderColor: Colors[colorScheme ?? 'light'].tint }]}
          onPress={handleShareApp}
          accessibilityLabel="Compartilhar aplicativo"
          accessibilityRole="button"
          accessibilityHint="Compartilha o link do app com outras pessoas"
        >
          <IconSymbol
            name="square.and.arrow.up"
            size={24}
            color={Colors[colorScheme ?? 'light'].tint}
          />
          <ThemedText style={[styles.shareAppButtonText, { color: Colors[colorScheme ?? 'light'].tint }]}>
            Compartilhar App
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <TouchableOpacity 
          style={[styles.themeToggleButton, { borderColor: Colors[colorScheme ?? 'light'].tint }]}
          onPress={toggleTheme}
          accessibilityLabel={`Alternar para tema ${actualTheme === 'light' ? 'escuro' : 'claro'}`}
          accessibilityRole="button"
        >
          <IconSymbol
            name={actualTheme === 'light' ? 'moon.fill' : 'sun.fill'}
            size={24}
            color={Colors[colorScheme ?? 'light'].tint}
          />
          <ThemedText style={[styles.themeToggleText, { color: Colors[colorScheme ?? 'light'].tint }]}>
            {actualTheme === 'light' ? 'Modo Escuro' : 'Modo Claro'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 24,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 16,
    gap: 12,
    marginTop: 8,
    backgroundColor: '#0a7ea4',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  shareAppButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 10,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  shareAppButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  themeToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 10,
    borderWidth: 2,
    backgroundColor: 'transparent',
  },
  themeToggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
