import { Image } from 'expo-image';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';

export default function HomeScreen() {
  const colorScheme = useColorScheme();

  const handleScan = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(tabs)/scan');
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

      <ThemedView style={styles.stepContainer}>
        <TouchableOpacity
          style={[styles.scanButton, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}
          onPress={handleScan}
        >
          <IconSymbol
            name="camera.fill"
            size={32}
            color="#fff"
          />
          <ThemedText style={styles.scanButtonText}>Escanear Rótulo</ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Sobre o BHT</ThemedText>
        <ThemedText>
          O BHT (Butylated Hydroxytoluene) é um antioxidante sintético usado como conservante
          em alimentos. Algumas pessoas preferem evitar produtos que contenham este aditivo.
        </ThemedText>
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
});
