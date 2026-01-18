import * as FileSystem from 'expo-file-system';

export interface OCRResult {
  text: string;
  confidence?: number;
  error?: string;
}

async function imageToBase64(uri: string): Promise<string> {
  try {
    const base64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    return base64;
  } catch (error) {
    throw new Error(`Erro ao converter imagem: ${error}`);
  }
}

export async function performOCR(imageUri: string): Promise<OCRResult> {
  try {
    return {
      text: '',
      error: 'OCR não configurado. Por favor, configure uma API de OCR ou use uma biblioteca nativa.',
    };
  } catch (error) {
    return {
      text: '',
      error: error instanceof Error ? error.message : 'Erro desconhecido no OCR',
    };
  }
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

    const response = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Image,
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                },
              ],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      return {
        text: '',
        error: data.error.message || 'Erro na API do Google Vision',
      };
    }

    const textAnnotations = data.responses[0]?.textAnnotations;
    if (!textAnnotations || textAnnotations.length === 0) {
      return {
        text: '',
        error: 'Nenhum texto detectado na imagem',
      };
    }

    const fullText = textAnnotations[0].description || '';

    return {
      text: fullText,
      confidence: 0.9,
    };
  } catch (error) {
    return {
      text: '',
      error: error instanceof Error ? error.message : 'Erro ao processar imagem',
    };
  }
}

