import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Modal, Platform, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { detectBHT } from '@/utils/bht-detector';
import { performOCR } from '@/utils/ocr';
import * as Haptics from 'expo-haptics';

const IMAGE_QUALITY = 0.8;
const MAX_TEXT_LENGTH = 500;
const EXAMPLE_TEXT_WITH_BHT = 'INGREDIENTES: Farinha de trigo, açúcar, gordura vegetal, BHT (antioxidante), sal, fermento químico.';
const EXAMPLE_TEXT_WITHOUT_BHT = 'INGREDIENTES: Farinha de arroz, água, azeite de oliva extra virgem, sal marinho, fermento biológico.';

function resetScreenState(
  setIsProcessing: (value: boolean) => void,
  setShowTextModal: (value: boolean) => void,
  setManualText: (value: string) => void,
  setPendingImageUri: (value: string | null) => void
) {
  setIsProcessing(false);
  setShowTextModal(false);
  setManualText('');
  setPendingImageUri(null);
}

function createFileInputForWeb(onFileSelected: (base64: string) => void, onError: () => void) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.style.display = 'none';
  
  input.onchange = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    
    if (!file) {
      onError();
      input.remove();
      return;
    }
    
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        onFileSelected(base64);
        input.remove();
      };
      reader.onerror = () => {
        Alert.alert('Erro', 'Não foi possível ler a imagem selecionada.');
        onError();
        input.remove();
      };
      reader.readAsDataURL(file);
    } catch {
      Alert.alert('Erro', 'Não foi possível processar a imagem.');
      onError();
      input.remove();
    }
  };
  
  document.body.appendChild(input);
  input.click();
}

function createOCRErrorAlertOptions(
  error: string,
  imageUri: string,
  onManualInput: () => void,
  onUseExample: () => void,
  onCancel: () => void
) {
  return {
    title: 'OCR não disponível',
    message: `${error}\n\nEscolha uma opção:`,
    buttons: [
      { text: 'Inserir texto manualmente', onPress: onManualInput },
      { text: 'Usar exemplo (sem BHT)', onPress: onUseExample, style: 'default' as const },
      { text: 'Cancelar', onPress: onCancel, style: 'cancel' as const },
    ],
    cancelable: true,
  };
}

function createNoTextDetectedAlertOptions(
  imageUri: string,
  onManualInput: () => void,
  onCancel: () => void
) {
  return {
    title: 'Nenhum texto detectado',
    message: 'Não foi possível detectar texto na imagem.\n\nEscolha uma opção:',
    buttons: [
      { text: 'Inserir texto manualmente', onPress: onManualInput },
      { text: 'Cancelar', onPress: onCancel, style: 'cancel' as const },
    ],
    cancelable: true,
  };
}

export default function ScanScreen() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [manualText, setManualText] = useState('');
  const [pendingImageUri, setPendingImageUri] = useState<string | null>(null);
  const cameraRef = useRef<CameraView>(null);
  const colorScheme = useColorScheme();

  useFocusEffect(
    useCallback(() => {
      resetScreenState(setIsProcessing, setShowTextModal, setManualText, setPendingImageUri);
    }, [])
  );

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

  const handleTakePicture = async () => {
    if (!cameraRef.current || isProcessing) return;

    try {
      setIsProcessing(true);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const photo = await cameraRef.current.takePictureAsync({
        quality: IMAGE_QUALITY,
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

  const handlePickImageFromWeb = () => {
    createFileInputForWeb(
      (base64) => processImage(base64),
      () => setIsProcessing(false)
    );
  };

  const handlePickImageFromMobile = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'Precisamos da permissão para acessar suas fotos.');
      setIsProcessing(false);
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: IMAGE_QUALITY,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      await processImage(result.assets[0].uri);
    } else {
      setIsProcessing(false);
    }
  };

  const handlePickImage = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);
      
      if (Platform.OS === 'web') {
        handlePickImageFromWeb();
      } else {
        await handlePickImageFromMobile();
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
      setIsProcessing(false);
    }
  };

  const showTextInputDialog = (imageUri: string) => {
    setPendingImageUri(imageUri);
    setManualText('');
    setShowTextModal(true);
  };

  const handleProcessWithExample = (imageUri: string, hasBHT: boolean) => {
    const exampleText = hasBHT ? EXAMPLE_TEXT_WITH_BHT : EXAMPLE_TEXT_WITHOUT_BHT;
    processText(exampleText, imageUri);
  };

  const navigateToResult = (detectionResult: ReturnType<typeof detectBHT>, imageUri: string, text: string) => {
    resetScreenState(setIsProcessing, setShowTextModal, setManualText, setPendingImageUri);

    router.push({
      pathname: '/result',
      params: {
        containsBHT: detectionResult.containsBHT.toString(),
        confidence: detectionResult.confidence,
        matches: JSON.stringify(detectionResult.matches),
        imageUri,
        detectedText: text.substring(0, MAX_TEXT_LENGTH),
      },
    });
  };

  const processText = (text: string, imageUri: string) => {
    try {
      const detectionResult = detectBHT(text);
      navigateToResult(detectionResult, imageUri, text);
    } catch (error) {
      console.error('Erro ao processar texto:', error);
      Alert.alert('Erro', 'Não foi possível analisar o texto.');
      setIsProcessing(false);
    }
  };

  const handleOCRSuccess = (text: string, imageUri: string) => {
    if (__DEV__) {
      console.log('Texto extraído pelo OCR:', text.substring(0, 100) + '...');
    }
    processText(text, imageUri);
  };

  const handleOCRError = (error: string, imageUri: string) => {
    const alertOptions = createOCRErrorAlertOptions(
      error,
      imageUri,
      () => showTextInputDialog(imageUri),
      () => {
        setIsProcessing(false);
        handleProcessWithExample(imageUri, false);
      },
      () => setIsProcessing(false)
    );
    Alert.alert(alertOptions.title, alertOptions.message, alertOptions.buttons, { cancelable: true });
  };

  const handleNoTextDetected = (imageUri: string) => {
    const alertOptions = createNoTextDetectedAlertOptions(
      imageUri,
      () => showTextInputDialog(imageUri),
      () => setIsProcessing(false)
    );
    Alert.alert(alertOptions.title, alertOptions.message, alertOptions.buttons, { cancelable: true });
  };

  const processImage = async (imageUri: string) => {
    try {
      const ocrResult = await performOCR(imageUri);
      
      if (ocrResult.error) {
        handleOCRError(ocrResult.error, imageUri);
      } else if (ocrResult.text?.trim()) {
        handleOCRSuccess(ocrResult.text, imageUri);
      } else {
        handleNoTextDetected(imageUri);
      }
    } catch (error) {
      console.error('Erro ao processar imagem:', error);
      Alert.alert(
        'Erro ao processar imagem',
        'Não foi possível processar a imagem. Tente novamente ou insira o texto manualmente.',
        [
          { text: 'Inserir texto manualmente', onPress: () => showTextInputDialog(imageUri) },
          { text: 'Cancelar', onPress: () => setIsProcessing(false), style: 'cancel' },
        ]
      );
    }
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

  const toggleCameraFacing = () => {
    if (isProcessing) return;
    
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setFacing((current) => {
        const newFacing = current === 'back' ? 'front' : 'back';
        if (__DEV__) {
          console.log('Alternando câmera de', current, 'para', newFacing);
        }
        return newFacing;
      });
    } catch (error) {
      if (__DEV__) {
        console.error('Erro ao alternar câmera:', error);
      }
    }
  };

  const handleModalClose = () => {
    setShowTextModal(false);
    setIsProcessing(false);
  };

  return (
    <ThemedView style={styles.container}>
      <CameraView 
        ref={cameraRef} 
        style={styles.camera} 
        facing={facing} 
        mode="picture"
        key={facing}
      >
        <View style={styles.overlay}>
          {isProcessing && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
              <ThemedText style={styles.processingText}>
                Processando imagem...
              </ThemedText>
              <ThemedText style={styles.processingSubtext}>
                Analisando texto do rótulo
              </ThemedText>
            </View>
          )}
          
          <View style={styles.header}>
            <View style={styles.headerIconContainer}>
              <IconSymbol
                name="camera.fill"
                size={48}
                color="#fff"
              />
            </View>
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
              onPress={handlePickImage}
              disabled={isProcessing}
              accessibilityLabel="Selecionar imagem da galeria"
              accessibilityRole="button"
              accessibilityHint="Abre a galeria para selecionar uma foto do rótulo"
            >
              <IconSymbol
                name="photo.fill"
                size={28}
                color={Colors[colorScheme ?? 'light'].text}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]}
              onPress={handleTakePicture}
              disabled={isProcessing}
              accessibilityLabel="Tirar foto do rótulo"
              accessibilityRole="button"
              accessibilityHint="Captura uma foto do rótulo para análise"
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
              accessibilityLabel="Alternar entre câmera frontal e traseira"
              accessibilityRole="button"
              accessibilityHint="Muda a câmera entre frente e trás"
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
        onRequestClose={handleModalClose}
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
                onPress={handleModalClose}
                accessibilityLabel="Cancelar inserção de texto"
                accessibilityRole="button"
              >
                <ThemedText style={styles.modalButtonTextCancel}>Cancelar</ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSubmit]}
                onPress={handleManualTextSubmit}
                accessibilityLabel="Analisar texto inserido"
                accessibilityRole="button"
                accessibilityHint="Analisa o texto do rótulo para detectar BHT"
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
  headerIconContainer: {
    marginBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 30,
    padding: 12,
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
    padding: 16,
  },
  scanFrame: {
    width: '100%',
    height: '85%',
    borderWidth: 4,
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
