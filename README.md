# Detector de BHT Mobile

Aplicativo mobile para detectar BHT (Butylated Hydroxytoluene) em rótulos de alimentos através de análise de imagem.

## ⚠️ Copyright

Copyright © 2025 Costanza22. Todos os direitos reservados.

Este software é propriedade privada e confidencial. É proibida a cópia, modificação, distribuição ou uso comercial sem autorização expressa por escrito.

## 🚀 Funcionalidades

- 📷 **Captura de imagem**: Use a câmera ou galeria para fotografar rótulos de alimentos
- 🔍 **Detecção de BHT**: Analisa o texto do rótulo e identifica a presença de BHT
- 📊 **Resultados detalhados**: Mostra confiança da detecção e termos encontrados
- 🔊 **Feedback de voz**: Opção de ouvir o resultado
- 🌓 **Tema claro/escuro**: Suporte automático a temas

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Expo CLI
- Dispositivo móvel ou emulador para testar

## 🛠️ Instalação

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npx expo start
```

3. Escaneie o QR code com o Expo Go (Android/iOS) ou pressione:
   - `a` para Android
   - `i` para iOS
   - `w` para Web

## ⚙️ Configuração do OCR

**IMPORTANTE**: O app atualmente usa um texto de exemplo para demonstração. Para usar em produção, você precisa configurar um serviço de OCR.

### Opção 1: Google Cloud Vision API

1. Crie um projeto no [Google Cloud Console](https://console.cloud.google.com/)
2. Ative a API Vision
3. Crie uma chave de API
4. Atualize `app/(tabs)/scan.tsx`:

```typescript
import { performOCRWithGoogleVision } from '@/utils/ocr';

const ocrResult = await performOCRWithGoogleVision(imageUri, 'SUA_CHAVE_API');
const text = ocrResult.text;
```

### Opção 2: Outras APIs de OCR

Você pode integrar outras APIs de OCR modificando `utils/ocr.ts` ou criando sua própria implementação.

### Opção 3: Bibliotecas Nativas

Para melhor performance, considere usar bibliotecas nativas como:
- ML Kit (requer custom dev client)
- Tesseract OCR
- Outras soluções de OCR offline

## 📱 Como Usar

1. Abra o app e vá para a aba "Escanear"
2. Tire uma foto do rótulo do alimento ou selecione uma da galeria
3. O app analisará o texto e mostrará se contém BHT
4. Veja os detalhes do resultado na tela de resultados

## 🧪 Teste

Para testar sem OCR configurado, o app usa um texto de exemplo que contém BHT. Você pode modificar o texto em `app/(tabs)/scan.tsx` para testar diferentes cenários.

## 📦 Estrutura do Projeto

```
app/
├── (tabs)/
│   ├── index.tsx      # Tela inicial
│   ├── scan.tsx       # Tela de escaneamento
│   └── explore.tsx    # Informações sobre BHT
├── result.tsx         # Tela de resultado
└── _layout.tsx        # Layout raiz

utils/
├── bht-detector.ts    # Lógica de detecção de BHT
└── ocr.ts             # Utilitários de OCR

components/            # Componentes reutilizáveis
```

## 🔍 Detecção de BHT

O app detecta BHT através de vários padrões:
- Sigla: `BHT`, `B.H.T.`, `B-H-T`
- Nome completo: `Butylated Hydroxytoluene`
- Código E: `E320`
- Nome químico: `3,5-di-tert-butyl-4-hydroxytoluene`

## 📝 Notas

- O app funciona melhor com rótulos bem iluminados e em foco
- A precisão depende da qualidade do OCR
- Alguns rótulos podem ter texto em áreas difíceis de ler


## 📄 Licença

Este projeto é privado e protegido por direitos autorais.

**Copyright © 2025 Costanza22. Todos os direitos reservados.**

Para informações sobre licenciamento, entre em contato com o proprietário.
