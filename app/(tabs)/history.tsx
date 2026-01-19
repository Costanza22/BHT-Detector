import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import * as Haptics from 'expo-haptics';

interface HistoryEntry {
  containsBHT: boolean;
  timestamp: string;
  matches: string[];
  imageUri?: string | null;
}

type FilterType = 'all' | 'withBHT' | 'withoutBHT';

export default function HistoryScreen() {
  const colorScheme = useColorScheme();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryEntry[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    withBHT: 0,
    withoutBHT: 0,
    percentage: 0,
  });
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadHistory();
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [history, filter, searchQuery]);

  const loadHistory = () => {
    if (typeof globalThis.window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        const savedHistory = JSON.parse(localStorage.getItem('bht-scans-history') || '[]');
        setHistory(savedHistory);
        
        const total = savedHistory.length;
        const withBHT = savedHistory.filter((entry: HistoryEntry) => entry.containsBHT).length;
        const withoutBHT = total - withBHT;
        const percentage = total > 0 ? Math.round((withBHT / total) * 100) : 0;
        
        setStats({ total, withBHT, withoutBHT, percentage });
      } catch (error) {
        if (__DEV__) {
          console.error('Erro ao carregar histórico:', error);
        }
      }
    }
  };

  const clearHistory = () => {
    if (typeof globalThis.window !== 'undefined' && typeof localStorage !== 'undefined') {
      try {
        localStorage.removeItem('bht-scans-history');
        setHistory([]);
        setStats({ total: 0, withBHT: 0, withoutBHT: 0, percentage: 0 });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        if (__DEV__) {
          console.error('Erro ao limpar histórico:', error);
        }
      }
    }
  };

  const applyFilters = () => {
    let filtered = [...history];

    if (filter === 'withBHT') {
      filtered = filtered.filter((entry) => entry.containsBHT);
    } else if (filter === 'withoutBHT') {
      filtered = filtered.filter((entry) => !entry.containsBHT);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((entry) => {
        const matchesText = entry.matches.some((match) =>
          match.toLowerCase().includes(query)
        );
        return matchesText;
      });
    }

    setFilteredHistory(filtered);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const exportHistory = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      let exportText = '📊 Histórico de Scans BHT Detector\n';
      exportText += `Total: ${stats.total} scans\n`;
      exportText += `Com BHT: ${stats.withBHT}\n`;
      exportText += `Sem BHT: ${stats.withoutBHT}\n`;
      exportText += `Percentual com BHT: ${stats.percentage}%\n\n`;
      exportText += '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n';

      history.forEach((entry, index) => {
        exportText += `${index + 1}. ${entry.containsBHT ? '🚨 BHT Detectado' : '✅ Sem BHT'}\n`;
        exportText += `   Data: ${formatDate(entry.timestamp)}\n`;
        if (entry.matches.length > 0) {
          exportText += `   Termos: ${entry.matches.join(', ')}\n`;
        }
        exportText += '\n';
      });

      if (Platform.OS === 'web') {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(exportText);
          Alert.alert('Copiado!', 'Histórico copiado para a área de transferência.');
        } else {
          Alert.alert('Erro', 'Não foi possível copiar o histórico.');
        }
      } else {
        const { Share } = await import('react-native');
        await Share.share({
          message: exportText,
          title: 'Histórico BHT Detector',
        });
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Erro ao exportar histórico:', error);
      }
      Alert.alert('Erro', 'Não foi possível exportar o histórico.');
    }
  };

  const backgroundImageUrl = 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

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
        <IconSymbol
          name="info.circle.fill"
          size={48}
          color={Colors[colorScheme ?? 'light'].tint}
        />
        <ThemedText type="title">Estatísticas</ThemedText>
      </ThemedView>

      <Animated.View
        style={[
          styles.statsContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }) }],
          },
        ]}
      >
        <ThemedView style={[styles.statCard, { backgroundColor: Colors[colorScheme ?? 'light'].tint + '20' }]}>
          <ThemedText type="subtitle" style={styles.statNumber} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
            {stats.total}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Total de Scans</ThemedText>
        </ThemedView>

        <ThemedView style={[styles.statCard, { backgroundColor: '#F4433620' }]}>
          <ThemedText type="subtitle" style={[styles.statNumber, { color: '#F44336' }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
            {stats.withBHT}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Com BHT</ThemedText>
        </ThemedView>

        <ThemedView style={[styles.statCard, { backgroundColor: '#4CAF5020' }]}>
          <ThemedText type="subtitle" style={[styles.statNumber, { color: '#4CAF50' }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.7}>
            {stats.withoutBHT}
          </ThemedText>
          <ThemedText style={styles.statLabel}>Sem BHT</ThemedText>
        </ThemedView>
      </Animated.View>

      {stats.total > 0 && (
        <ThemedView style={styles.percentageContainer}>
          <ThemedText style={styles.percentageText}>
            {stats.percentage}% dos produtos escaneados contêm BHT
          </ThemedText>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${stats.percentage}%`,
                  backgroundColor: '#F44336',
                }
              ]} 
            />
          </View>
        </ThemedView>
      )}

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="subtitle">Histórico</ThemedText>
        {history.length > 0 && (
          <View style={styles.headerActions}>
            <TouchableOpacity
              onPress={exportHistory}
              style={styles.exportButton}
              accessibilityLabel="Exportar histórico"
              accessibilityRole="button"
            >
              <IconSymbol
                name="square.and.arrow.up"
                size={18}
                color="#0a7ea4"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={clearHistory}
              style={styles.clearButton}
              accessibilityLabel="Limpar histórico"
              accessibilityRole="button"
            >
              <ThemedText style={styles.clearButtonText}>
                Limpar
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
      </ThemedView>

      {history.length > 0 && (
        <>
          <ThemedView style={styles.searchContainer}>
            <IconSymbol
              name="info.circle.fill"
              size={20}
              color={Colors[colorScheme ?? 'light'].tabIconDefault}
            />
            <TextInput
              style={[
                styles.searchInput,
                {
                  color: Colors[colorScheme ?? 'light'].text,
                  backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                }
              ]}
              placeholder="Buscar por termos..."
              placeholderTextColor={Colors[colorScheme ?? 'light'].tabIconDefault}
              value={searchQuery}
              onChangeText={setSearchQuery}
              accessibilityLabel="Campo de busca no histórico"
              accessibilityHint="Digite para buscar por termos encontrados nos scans"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={styles.clearSearchButton}
                accessibilityLabel="Limpar busca"
                accessibilityRole="button"
              >
                <IconSymbol
                  name="xmark.circle.fill"
                  size={20}
                  color={Colors[colorScheme ?? 'light'].tabIconDefault}
                />
              </TouchableOpacity>
            )}
          </ThemedView>

          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'all' && styles.filterButtonActive,
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setFilter('all');
              }}
              accessibilityLabel="Filtrar todos"
              accessibilityRole="button"
            >
              <ThemedText
                style={[
                  styles.filterButtonText,
                  filter === 'all' && styles.filterButtonTextActive,
                ]}
              >
                Todos
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'withBHT' && styles.filterButtonActive,
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setFilter('withBHT');
              }}
              accessibilityLabel="Filtrar apenas com BHT"
              accessibilityRole="button"
            >
              <ThemedText
                style={[
                  styles.filterButtonText,
                  filter === 'withBHT' && styles.filterButtonTextActive,
                ]}
              >
                Com BHT
              </ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                filter === 'withoutBHT' && styles.filterButtonActive,
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setFilter('withoutBHT');
              }}
              accessibilityLabel="Filtrar apenas sem BHT"
              accessibilityRole="button"
            >
              <ThemedText
                style={[
                  styles.filterButtonText,
                  filter === 'withoutBHT' && styles.filterButtonTextActive,
                ]}
              >
                Sem BHT
              </ThemedText>
            </TouchableOpacity>
          </View>
        </>
      )}

      {history.length === 0 ? (
        <ThemedView style={styles.emptyContainer}>
          <IconSymbol
            name="info.circle.fill"
            size={48}
            color={Colors[colorScheme ?? 'light'].tabIconDefault}
          />
          <ThemedText style={styles.emptyText}>
            Nenhum scan realizado ainda
          </ThemedText>
          <ThemedText style={styles.emptySubtext}>
            Escaneie um rótulo para começar a ver seu histórico
          </ThemedText>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              router.push('/(tabs)/scan');
            }}
            accessibilityLabel="Ir para tela de escanear"
            accessibilityRole="button"
          >
            <IconSymbol
              name="camera.fill"
              size={24}
              color="#fff"
            />
            <ThemedText style={styles.scanButtonText}>Escanear Agora</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      ) : (
        <>
          {filteredHistory.length === 0 && (searchQuery || filter !== 'all') ? (
            <ThemedView style={styles.emptyContainer}>
              <IconSymbol
                name="info.circle.fill"
                size={48}
                color={Colors[colorScheme ?? 'light'].tabIconDefault}
              />
              <ThemedText style={styles.emptyText}>
                Nenhum resultado encontrado
              </ThemedText>
              <ThemedText style={styles.emptySubtext}>
                {searchQuery ? 'Tente buscar com outros termos' : 'Tente outro filtro'}
              </ThemedText>
            </ThemedView>
          ) : (
            <Animated.View style={{ opacity: fadeAnim }}>
              <ScrollView style={styles.historyList}>
                {filteredHistory.map((entry, index) => (
                  <Animated.View
                    key={index}
                    style={{
                      opacity: fadeAnim,
                      transform: [{
                        translateX: fadeAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [-20, 0],
                        }),
                      }],
                    }}
                  >
                    <ThemedView
                      style={[
                        styles.historyItem,
                        entry.containsBHT ? styles.historyItemWarning : styles.historyItemSuccess,
                      ]}
                    >
              <View style={styles.historyItemHeader}>
                <IconSymbol
                  name={entry.containsBHT ? 'exclamationmark.triangle.fill' : 'checkmark.circle.fill'}
                  size={24}
                  color={entry.containsBHT ? '#F44336' : '#4CAF50'}
                />
                <ThemedText style={styles.historyItemTitle}>
                  {entry.containsBHT ? 'BHT Detectado' : 'Sem BHT'}
                </ThemedText>
                <ThemedText style={styles.historyItemDate}>
                  {formatDate(entry.timestamp)}
                </ThemedText>
              </View>
              {entry.matches.length > 0 && (
                <ThemedText style={styles.historyItemMatches}>
                  Termos: {entry.matches.join(', ')}
                </ThemedText>
              )}
              {entry.imageUri && (
                <Image
                  source={{ uri: entry.imageUri }}
                  style={styles.historyItemImage}
                  contentFit="cover"
                />
              )}
            </ThemedView>
                  </Animated.View>
                ))}
              </ScrollView>
            </Animated.View>
          )}
        </>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: '100%',
    height: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 90,
    justifyContent: 'center',
    overflow: 'visible',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
    includeFontPadding: false,
  },
  statLabel: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  percentageContainer: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  percentageText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  exportButton: {
    padding: 8,
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0a7ea4',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  clearSearchButton: {
    padding: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: '#0a7ea4',
    borderColor: '#0a7ea4',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 32,
    marginTop: 24,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 24,
    textAlign: 'center',
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 8,
    backgroundColor: '#0a7ea4',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  historyList: {
    maxHeight: 400,
  },
  historyItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  historyItemWarning: {
    backgroundColor: 'rgba(244, 67, 54, 0.1)',
    borderColor: 'rgba(244, 67, 54, 0.3)',
  },
  historyItemSuccess: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  historyItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  historyItemTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  historyItemDate: {
    fontSize: 12,
    opacity: 0.6,
  },
  historyItemMatches: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 4,
  },
  historyItemImage: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    marginTop: 8,
  },
});

