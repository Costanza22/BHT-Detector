import { useState, useRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Alert, ActivityIndicator, Modal, TextInput, Platform } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { detectBHT } from '@/utils/bht-detector';
import * as Haptics from 'expo-haptics';

export default function ScanScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [manualText, setManualText] = useState('');
  const [pendingImageUri, setPendingImageUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const colorScheme = useColorScheme();

  if (!permission) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  if (!permission.granted) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.message}>
          Precisamos da sua permissão para usar a câmera
        </ThemedText>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <ThemedText style={styles.buttonText}>Conceder Permissão</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current || isProcessing) return;

    try {
      setIsProcessing(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });

      if (photo?.uri) {
        await processImage(photo.uri);
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto. Tente novamente.');
      setIsProcessing(false);
    }
  };

  const pickImage = async () => {
    if (isProcessing) return;

    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permissão necessária',
          'Precisamos da permissão para acessar suas fotos.'
        );
        return;
      }

      setIsProcessing(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]?.uri) {
        await processImage(result.assets[0].uri);
      } else {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
      setIsProcessing(false);
    }
  };

  const processImage = async (imageUri: string) => {
    try {
      Alert.alert(
        'OCR não configurado',
        'O reconhecimento de texto ainda não está configurado.\n\n' +
        'Escolha uma opção:',
        [
          {
            text: 'Inserir texto manualmente',
            onPress: () => showTextInputDialog(imageUri),
          },
          {
            text: 'Usar exemplo (sem BHT)',
            onPress: () => processWithExampleText(imageUri, false),
            style: 'default',
          },
          {
            text: 'Cancelar',
            onPress: () => setIsProcessing(false),
            style: 'cancel',
          },
        ],
        { cancelable: true }
      );
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      Alert.alert('Erro', 'Não foi possível processar a imagem.');
      setIsProcessing(false);
    }
  };

  const showTextInputDialog = (imageUri: string) => {
    setPendingImageUri(imageUri);
    setManualText('');
    setShowTextModal(true);
  };

  const handleManualTextSubmit = () => {
    if (!manualText.trim()) {
      Alert.alert('Erro', 'Por favor, insira um texto válido.');
      return;
    }
    
    if (pendingImageUri) {
      setShowTextModal(false);
      processText(manualText.trim(), pendingImageUri);
    }
  };

  const processWithExampleText = (imageUri: string, hasBHT: boolean) => {
    const exampleText = hasBHT
      ? `INGREDIENTES: Farinha de trigo, açúcar, gordura vegetal, BHT (antioxidante), sal, fermento químico.`
      : `INGREDIENTES: Farinha de arroz, água, azeite de oliva extra virgem, sal marinho, fermento biológico.`;
    
    processText(exampleText, imageUri);
  };

  const processText = (text: string, imageUri: string) => {
    try {
      const detectionResult = detectBHT(text);

      router.push({
        pathname: '/result',
        params: {
          containsBHT: detectionResult.containsBHT.toString(),
          confidence: detectionResult.confidence,
          matches: JSON.stringify(detectionResult.matches),
          imageUri: imageUri,
          detectedText: text.substring(0, 500),
        },
      });
    } catch (error) {
      console.error('Erro ao processar texto:', error);
      Alert.alert('Erro', 'Não foi possível analisar o texto.');
      setIsProcessing(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  return (
    <ThemedView style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        mode="picture"
      >
        <View style={styles.overlay}>
          <View style={styles.header}>
            <ThemedText type="title" style={styles.title}>
              Escaneie o Rótulo
            </ThemedText>
            <ThemedText style={styles.subtitle}>
              Posicione o rótulo dentro da área
            </ThemedText>
          </View>

          <View style={styles.scanArea}>
            <View style={styles.scanFrame} />
          </View>

          <View style={styles.controls}>
            <TouchableOpacity
              style={[styles.controlButton, isProcessing && styles.controlButtonDisabled]}
              onPress={pickImage}
              disabled={isProcessing}
            >
              <IconSymbol
                name="photo.fill"
                size={28}
                color={Colors[colorScheme ?? 'light'].text}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]}
              onPress={takePicture}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.controlButton, isProcessing && styles.controlButtonDisabled]}
              onPress={toggleCameraFacing}
              disabled={isProcessing}
            >
              <IconSymbol
                name="camera.rotate.fill"
                size={28}
                color={Colors[colorScheme ?? 'light'].text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>

      <Modal
        visible={showTextModal}
        transparent
        animationType="slide"
        onRequestClose={() => {
          setShowTextModal(false);
          setIsProcessing(false);
        }}
      >
        <ThemedView style={styles.modalOverlay}>
          <ThemedView style={styles.modalContent}>
            <ThemedText type="title" style={styles.modalTitle}>
              Inserir Texto do Rótulo
            </ThemedText>
            <ThemedText style={styles.modalSubtitle}>
              Cole ou digite o texto dos ingredientes:
            </ThemedText>
            
            <TextInput
              style={[
                styles.textInput,
                { 
                  color: Colors[colorScheme ?? 'light'].text,
                  backgroundColor: colorScheme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                }
              ]}
              multiline
              numberOfLines={8}
              placeholder="Ex: INGREDIENTES: Farinha de arroz, água, azeite..."
              placeholderTextColor={colorScheme === 'dark' ? '#999' : '#666'}
              value={manualText}
              onChangeText={setManualText}
              autoFocus
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={() => {
                  setShowTextModal(false);
                  setIsProcessing(false);
                }}
              >
                <ThemedText style={styles.modalButtonTextCancel}>Cancelar</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSubmit]}
                onPress={handleManualTextSubmit}
              >
                <ThemedText style={styles.modalButtonTextSubmit}>Analisar</ThemedText>
              </TouchableOpacity>
            </View>
          </ThemedView>
        </ThemedView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'space-between',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginBottom: 8,
  },
  subtitle: {
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    fontSize: 14,
  },
  scanArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  scanFrame: {
    width: '100%',
    height: '60%',
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 12,
    borderStyle: 'dashed',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonDisabled: {
    opacity: 0.5,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  captureButtonDisabled: {
    opacity: 0.7,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0a7ea4',
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#0a7ea4',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'transparent',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    maxHeight: '80%',
  },
  modalTitle: {
    marginBottom: 8,
  },
  modalSubtitle: {
    marginBottom: 16,
    fontSize: 14,
    opacity: 0.7,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 150,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalButtonSubmit: {
    backgroundColor: '#0a7ea4',
  },
  modalButtonTextCancel: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextSubmit: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

