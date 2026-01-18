import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function TabTwoScreen() {
  const backgroundImageUrl = 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
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
          color="#0a7ea4"
        />
        <ThemedText type="title">
          Sobre o BHT
        </ThemedText>
      </ThemedView>
      
      <Collapsible title="O que é BHT?">
        <ThemedText>
          BHT (Butylated Hydroxytoluene) é um antioxidante sintético usado como conservante
          em alimentos processados. Ele ajuda a prevenir a oxidação de gorduras e óleos,
          prolongando a vida útil dos produtos.
        </ThemedText>
        <ThemedText style={{ marginTop: 8 }}>
          Também pode aparecer como:
        </ThemedText>
        <ThemedText style={{ marginTop: 4 }}>
          • Butylated Hydroxytoluene{'\n'}
          • E320 (código europeu){'\n'}
          • 3,5-di-tert-butyl-4-hydroxytoluene
        </ThemedText>
      </Collapsible>

      <Collapsible title="Onde é encontrado?">
        <ThemedText>
          O BHT é comumente encontrado em:
        </ThemedText>
        <ThemedText style={{ marginTop: 8 }}>
          • Cereais matinais{'\n'}
          • Batatas fritas e salgadinhos{'\n'}
          • Óleos e gorduras{'\n'}
          • Produtos de panificação{'\n'}
          • Bebidas e sucos{'\n'}
          • Produtos cárneos processados
        </ThemedText>
      </Collapsible>

      <Collapsible title="Por que algumas pessoas evitam?">
        <ThemedText>
          Algumas pessoas preferem evitar BHT devido a preocupações sobre possíveis
          efeitos à saúde, embora seja aprovado para uso em alimentos pela maioria
          das agências reguladoras quando usado dentro dos limites permitidos.
        </ThemedText>
        <ThemedText style={{ marginTop: 8 }}>
          Este app ajuda você a identificar rapidamente se um produto contém BHT,
          permitindo que você tome decisões informadas sobre seus alimentos.
        </ThemedText>
      </Collapsible>

      <Collapsible title="Como usar o app">
        <ThemedText>
          1. Toque na aba "Escanear"{'\n'}
          2. Tire uma foto do rótulo do alimento{'\n'}
          3. Ou selecione uma foto da galeria{'\n'}
          4. O app analisará o texto e informará se contém BHT
        </ThemedText>
        <ThemedText style={{ marginTop: 8 }}>
          <ThemedText type="defaultSemiBold">Nota:</ThemedText> Para melhores resultados,
          certifique-se de que o rótulo esteja bem iluminado e em foco.
        </ThemedText>
      </Collapsible>
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
    marginBottom: 8,
  },
});
