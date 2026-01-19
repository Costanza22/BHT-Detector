import { Image } from 'expo-image';
import { StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser';
import * as Haptics from 'expo-haptics';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabTwoScreen() {
  const colorScheme = useColorScheme();
  const backgroundImageUrl = 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  const handleOpenLink = async (url: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      if (Platform.OS === 'web') {
        if (typeof window !== 'undefined' && window.open) {
          window.open(url, '_blank');
        } else {
          await Linking.openURL(url);
        }
      } else {
        await openBrowserAsync(url, {
          presentationStyle: WebBrowserPresentationStyle.AUTOMATIC,
        });
      }
    } catch (error) {
      console.error('Erro ao abrir link:', error);
      await Linking.openURL(url);
    }
  };

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
          Algumas pessoas têm <ThemedText type="defaultSemiBold">alergia ao BHT</ThemedText> e precisam 
          evitar produtos que contenham este conservante para prevenir reações alérgicas. Embora seja 
          aprovado para uso em alimentos pela maioria das agências reguladoras quando usado dentro dos 
          limites permitidos, pessoas alérgicas devem evitar completamente o consumo.
        </ThemedText>
        <ThemedText style={{ marginTop: 8 }}>
          Este app ajuda você a identificar rapidamente se um produto contém BHT,
          permitindo que pessoas alérgicas evitem produtos que possam causar reações.
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

      <Collapsible title="Produtos que frequentemente contêm BHT">
        <ThemedText>
          O BHT é comumente encontrado nos seguintes tipos de produtos:
        </ThemedText>
        <ThemedText style={{ marginTop: 12 }}>
          <ThemedText type="defaultSemiBold">Cereais e Grãos:</ThemedText>{'\n'}
          • Cereais matinais{'\n'}
          • Barras de cereal{'\n'}
          • Biscoitos e bolachas{'\n'}
          • Snacks de grãos
        </ThemedText>
        <ThemedText style={{ marginTop: 12 }}>
          <ThemedText type="defaultSemiBold">Salgadinhos:</ThemedText>{'\n'}
          • Batatas fritas{'\n'}
          • Salgadinhos de milho{'\n'}
          • Amendoins e castanhas processadas{'\n'}
          • Pipocas de micro-ondas
        </ThemedText>
        <ThemedText style={{ marginTop: 12 }}>
          <ThemedText type="defaultSemiBold">Óleos e Gorduras:</ThemedText>{'\n'}
          • Óleos vegetais refinados{'\n'}
          • Margarinas{'\n'}
          • Manteigas processadas{'\n'}
          • Produtos com gordura hidrogenada
        </ThemedText>
        <ThemedText style={{ marginTop: 12 }}>
          <ThemedText type="defaultSemiBold">Produtos de Panificação:</ThemedText>{'\n'}
          • Pães industrializados{'\n'}
          • Bolos prontos{'\n'}
          • Massas congeladas{'\n'}
          • Tortas e doces industrializados
        </ThemedText>
        <ThemedText style={{ marginTop: 12 }}>
          <ThemedText type="defaultSemiBold">Outros:</ThemedText>{'\n'}
          • Bebidas em pó{'\n'}
          • Sucos industrializados{'\n'}
          • Produtos cárneos processados{'\n'}
          • Molhos e condimentos
        </ThemedText>
        <ThemedText style={{ marginTop: 12, fontStyle: 'italic', opacity: 0.7 }}>
          <ThemedText type="defaultSemiBold">Dica:</ThemedText> Sempre verifique a lista de ingredientes, 
          mesmo em produtos que normalmente não contêm BHT, pois a formulação pode variar.
        </ThemedText>
      </Collapsible>

      <ThemedView style={styles.aboutMeContainer}>
        <ThemedView style={styles.aboutMeHeader}>
          <IconSymbol
            name="info.circle.fill"
            size={32}
            color={Colors[colorScheme ?? 'light'].tint}
          />
          <ThemedText type="subtitle" style={styles.aboutMeTitle}>
            Sobre a Desenvolvedora
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.profileContainer}>
          <Image
            source={require('@/assets/images/costanza-photo.jpg')}
            style={[styles.profileImage, { borderColor: Colors[colorScheme ?? 'light'].tint }]}
            contentFit="cover"
            placeholder={{ blurhash: 'LGF5]+Yk^6#M@-5c,1J5@[or[Q6.' }}
            transition={200}
          />
        </ThemedView>
        
        <ThemedText style={styles.aboutMeText}>
          Oi! Sou a <ThemedText type="defaultSemiBold">Costanza Pasquotto Assef</ThemedText>, Engenheira de Software e 
          Desenvolvedora com foco em <ThemedText type="defaultSemiBold">Python, SQL, React e Bancos de Dados</ThemedText>. 
          Atualmente, curso uma <ThemedText type="defaultSemiBold">Especialização em Inteligência Artificial Aplicada na UFPR</ThemedText>.
        </ThemedText>
        
        <ThemedText style={styles.aboutMeText}>
          Criei este app porque tenho <ThemedText type="defaultSemiBold">alergia ao BHT</ThemedText> e sei, na prática, como é 
          cansativo precisar conferir rótulos o tempo todo. Para facilitar esse processo, utilizei <ThemedText type="defaultSemiBold">OCR</ThemedText>, 
          tornando a verificação mais rápida e acessível para quem, como eu, precisa evitar esse conservante.
        </ThemedText>

        <TouchableOpacity 
          style={styles.articleButton}
          onPress={() => handleOpenLink('https://medium.com/@costanza22/como-descobri-minha-alergia-ao-bht-e-criei-uma-solu%C3%A7%C3%A3o-em-ia-para-ajudar-outras-pessoas-91fbbde32e03')}
          accessibilityLabel="Ler artigo sobre o app no Medium"
          accessibilityRole="button"
        >
          <IconSymbol
            name="book.fill"
            size={22}
            color="#fff"
          />
          <ThemedText style={styles.articleButtonText}>Ler Artigo sobre o App</ThemedText>
        </TouchableOpacity>

        <ThemedView style={styles.linksContainer}>
          <TouchableOpacity 
            style={[styles.linkButton, styles.linkButtonPrimary]}
            onPress={() => handleOpenLink('https://www.linkedin.com/in/costanzaassef/')}
            accessibilityLabel="Abrir perfil no LinkedIn"
            accessibilityRole="button"
          >
            <IconSymbol
              name="person.fill"
              size={20}
              color="#fff"
            />
            <ThemedText style={styles.linkButtonText}>LinkedIn</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.linkButton, styles.linkButtonPrimary]}
            onPress={() => handleOpenLink('https://github.com/Costanza22')}
            accessibilityLabel="Abrir perfil no GitHub"
            accessibilityRole="button"
          >
            <IconSymbol
              name="code.fill"
              size={20}
              color="#fff"
            />
            <ThemedText style={styles.linkButtonText}>GitHub</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
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
  aboutMeContainer: {
    marginTop: 24,
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(10, 126, 164, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(10, 126, 164, 0.2)',
  },
  aboutMeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  aboutMeTitle: {
    flex: 1,
  },
  aboutMeText: {
    marginBottom: 12,
    lineHeight: 24,
  },
  articleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 10,
    marginTop: 8,
    marginBottom: 20,
    backgroundColor: '#0a7ea4',
  },
  articleButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  profileContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
  },
  linksContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  linkButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  linkButtonPrimary: {
    backgroundColor: '#0a7ea4',
  },
  linkButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  linkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkButtonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
  },
});
