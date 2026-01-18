import * as FileSystem from 'expo-file-system';

export interface OCRResult {
  text: string;
  confidence?: number;
  error?: string;
}

const OCR_SPACE_API_URL = 'https://api.ocr.space/parse/image';
const OCR_SPACE_API_KEY = 'helloworld';
const OCR_LANGUAGE = 'por';
const OCR_ENGINE = '2';

const isWebPlatform = (): boolean => typeof globalThis.window !== 'undefined';

async function convertWebImageToBase64(uri: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      resolve(base64.split(',')[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function convertMobileImageToBase64(uri: string): Promise<string> {
  return await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
}

async function imageToBase64(uri: string): Promise<string> {
  try {
    if (isWebPlatform()) {
      return await convertWebImageToBase64(uri);
    }
    return await convertMobileImageToBase64(uri);
  } catch (error) {
    throw new Error(`Erro ao converter imagem: ${error}`);
  }
}

async function recognizeWithTesseract(imageUri: string): Promise<OCRResult | null> {
  try {
    const { createWorker } = await import('tesseract.js');
    
    const worker = await createWorker('por+eng', 1, {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    try {
      const { data } = await worker.recognize(imageUri);
      await worker.terminate();

      if (!data.text?.trim()) {
        return {
          text: '',
          error: 'Nenhum texto detectado na imagem',
        };
      }

      return {
        text: data.text,
        confidence: data.confidence ? data.confidence / 100 : undefined,
      };
    } catch (error) {
      await worker.terminate();
      throw error;
    }
  } catch {
    return null;
  }
}

function createOCRSpaceFormData(base64Image: string): FormData {
  const formData = new FormData();
  formData.append('apikey', OCR_SPACE_API_KEY);
  formData.append('base64Image', `data:image/jpeg;base64,${base64Image}`);
  formData.append('language', OCR_LANGUAGE);
  formData.append('isOverlayRequired', 'false');
  formData.append('OCREngine', OCR_ENGINE);
  return formData;
}

function extractTextFromOCRSpaceResponse(data: any): string | null {
  if (data.OCRExitCode === 1 && data.ParsedResults?.[0]?.ParsedText) {
    const text = data.ParsedResults[0].ParsedText.trim();
    return text.length > 0 ? text : null;
  }
  return null;
}

async function recognizeWithOCRSpace(imageUri: string): Promise<OCRResult | null> {
  try {
    const base64Image = await imageToBase64(imageUri);
    const formData = createOCRSpaceFormData(base64Image);
    
    const response = await fetch(OCR_SPACE_API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error('OCR.space erro HTTP:', response.status);
      return null;
    }

    const data = await response.json();
    const extractedText = extractTextFromOCRSpaceResponse(data);
    
    if (extractedText) {
      return {
        text: extractedText,
        confidence: 0.8,
      };
    }

    return null;
  } catch {
    return null;
  }
}

function getErrorMessageForPlatform(): string {
  if (isWebPlatform()) {
    return 'Não foi possível realizar OCR. Tente inserir o texto manualmente ou verifique sua conexão com a internet.';
  }
  return 'OCR automático não está disponível no mobile no momento. Por favor, use a opção de inserir texto manualmente ou configure uma API de OCR (Google Vision, OCR.space com API key própria).';
}

export async function performOCR(imageUri: string): Promise<OCRResult> {
  try {
    if (isWebPlatform()) {
      const tesseractResult = await recognizeWithTesseract(imageUri);
      if (tesseractResult) {
        return tesseractResult;
      }
    }

    const ocrSpaceResult = await recognizeWithOCRSpace(imageUri);
    if (ocrSpaceResult) {
      return ocrSpaceResult;
    }

    return {
      text: '',
      error: getErrorMessageForPlatform(),
    };
  } catch (error) {
    return {
      text: '',
      error: error instanceof Error ? error.message : 'Erro desconhecido no OCR',
    };
  }
}

const GOOGLE_VISION_API_BASE_URL = 'https://vision.googleapis.com/v1/images:annotate';

function createGoogleVisionRequest(base64Image: string) {
  return {
    requests: [
      {
        image: { content: base64Image },
        features: [{ type: 'TEXT_DETECTION' }],
      },
    ],
  };
}

function extractTextFromGoogleVisionResponse(data: any): string | null {
  const textAnnotations = data.responses?.[0]?.textAnnotations;
  if (!textAnnotations || textAnnotations.length === 0) {
    return null;
  }
  return textAnnotations[0].description || null;
}

export async function performOCRWithGoogleVision(
  imageUri: string,
  apiKey?: string
): Promise<OCRResult> {
  if (!apiKey) {
    return {
      text: '',
      error: 'Chave da API do Google Vision não configurada',
    };
  }

  try {
    const base64Image = await imageToBase64(imageUri);
    const requestBody = createGoogleVisionRequest(base64Image);

    const response = await fetch(`${GOOGLE_VISION_API_BASE_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (data.error) {
      return {
        text: '',
        error: data.error.message || 'Erro na API do Google Vision',
      };
    }

    const extractedText = extractTextFromGoogleVisionResponse(data);
    if (!extractedText) {
      return {
        text: '',
        error: 'Nenhum texto detectado na imagem',
      };
    }

    return {
      text: extractedText,
      confidence: 0.9,
    };
  } catch (error) {
    return {
      text: '',
      error: error instanceof Error ? error.message : 'Erro ao processar imagem',
    };
  }
}
