import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import * as Speech from 'expo-speech';
import { Image, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function ResultScreen() {
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  
  const containsBHT = params.containsBHT === 'true';
  const matches = params.matches ? JSON.parse(params.matches as string) : [];
  const imageUri = params.imageUri as string;
  const detectedText = params.detectedText as string;

  const speakResult = () => {
    const message = containsBHT
      ? 'Atenção! Este produto contém BHT.'
      : 'Este produto não contém BHT.';
    
    Speech.speak(message, {
      language: 'pt-BR',
    });
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleNewScan = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/(tabs)/scan');
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <IconSymbol
              name="chevron.left"
              size={24}
              color={Colors[colorScheme ?? 'light'].text}
            />
          </TouchableOpacity>
          <ThemedText type="title" style={styles.headerTitle}>
            Resultado
          </ThemedText>
          <View style={styles.placeholder} />
        </View>

        <ThemedView
          style={[
            styles.resultCard,
            containsBHT ? styles.resultCardWarning : styles.resultCardSuccess,
          ]}
        >
          <View style={styles.iconContainer}>
            <IconSymbol
              name={containsBHT ? 'exclamationmark.triangle.fill' : 'checkmark.circle.fill'}
              size={64}
              color={containsBHT ? '#F44336' : '#4CAF50'}
            />
          </View>

          <ThemedText type="title" style={styles.resultTitle}>
            {containsBHT ? 'BHT Detectado!' : 'Sem BHT'}
          </ThemedText>

          <ThemedText style={styles.resultDescription}>
            {containsBHT
              ? 'Este produto contém Butylated Hydroxytoluene (BHT) na lista de ingredientes.'
              : 'Não foi detectado BHT na lista de ingredientes deste produto.'}
          </ThemedText>

          {matches.length > 0 && (
            <View style={styles.matchesContainer}>
              <ThemedText style={styles.matchesTitle}>Termos encontrados:</ThemedText>
              {matches.map((match: string, index: number) => (
                <View key={index} style={styles.matchItem}>
                  <ThemedText style={styles.matchText}>{match}</ThemedText>
                </View>
              ))}
            </View>
          )}
        </ThemedView>

        {imageUri && (
          <ThemedView style={styles.imageContainer}>
            <ThemedText style={styles.imageLabel}>Imagem escaneada:</ThemedText>
            <Image source={{ uri: imageUri }} style={styles.image} />
          </ThemedView>
        )}

        {detectedText && __DEV__ && (
          <ThemedView style={styles.textContainer}>
            <ThemedText style={styles.textLabel}>Texto detectado:</ThemedText>
            <ThemedText style={styles.detectedText}>{detectedText}</ThemedText>
          </ThemedView>
        )}

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.speakButton]}
            onPress={speakResult}
          >
            <IconSymbol
              name="speaker.wave.2.fill"
              size={20}
              color="#fff"
            />
            <ThemedText style={styles.actionButtonText}>Ouvir Resultado</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.scanButton]}
            onPress={handleNewScan}
          >
            <IconSymbol
              name="camera.fill"
              size={20}
              color="#fff"
            />
            <ThemedText style={styles.actionButtonText}>Nova Análise</ThemedText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
  },
  placeholder: {
    width: 40,
  },
  resultCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: 'center',
  },
  resultCardWarning: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  resultCardSuccess: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  iconContainer: {
    marginBottom: 16,
  },
  resultTitle: {
    marginBottom: 8,
    textAlign: 'center',
  },
  resultDescription: {
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 22,
  },
  matchesContainer: {
    width: '100%',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  matchesTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  matchItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  matchText: {
    fontSize: 13,
    fontFamily: 'monospace',
  },
  imageContainer: {
    marginBottom: 20,
  },
  imageLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  textContainer: {
    marginBottom: 20,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
  textLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 8,
    opacity: 0.7,
  },
  detectedText: {
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
  actions: {
    gap: 12,
    marginTop: 8,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
  },
  speakButton: {
    backgroundColor: '#0a7ea4',
  },
  scanButton: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

