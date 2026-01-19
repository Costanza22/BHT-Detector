# BHT Detector - Aplicativo Mobile

Aplicativo mobile para detectar BHT (Butylated Hydroxytoluene) em rótulos de alimentos através de análise de imagem usando OCR e inteligência artificial.

**Desenvolvedor:** Costanza Pasquotto Assef  
**Tecnologias:** React Native, Expo, TypeScript, OCR

## 🚀 Funcionalidades

- 📷 **Captura de imagem**: Use a câmera ou galeria para fotografar rótulos de alimentos
- 🔍 **Detecção de BHT**: Analisa o texto do rótulo e identifica a presença de BHT
- 📊 **Resultados detalhados**: Mostra termos encontrados e imagem escaneada
- 🔊 **Feedback de voz**: Opção de ouvir o resultado
- 🌓 **Tema claro/escuro**: Suporte automático a temas
- 💬 **Entrada manual**: Possibilidade de inserir texto manualmente se o OCR falhar

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

O app utiliza OCR automático com fallback para entrada manual:

- **Web**: Usa Tesseract.js automaticamente
- **Mobile**: Tenta API OCR.space (requer API key própria para produção)

### Configurar API de OCR (Opcional)

#### Google Cloud Vision API

1. Crie um projeto no [Google Cloud Console](https://console.cloud.google.com/)
2. Ative a API Vision
3. Crie uma chave de API
4. Use a função `performOCRWithGoogleVision` em `utils/ocr.ts`

#### OCR.space API

1. Obtenha uma API key gratuita em [ocr.space](https://ocr.space/ocrapi/freekey)
2. Atualize a constante `OCR_SPACE_API_KEY` em `utils/ocr.ts`

## 📱 Como Usar

1. Abra o app e vá para a aba "Escanear"
2. Tire uma foto do rótulo do alimento ou selecione uma da galeria
3. O app analisará o texto automaticamente
4. Se o OCR falhar, você pode inserir o texto manualmente
5. Veja os detalhes do resultado na tela de resultados

## 🔍 Detecção de BHT

O app detecta BHT através de vários padrões:
- Sigla: `BHT`, `B.H.T.`, `B-H-T`
- Nome completo: `Butylated Hydroxytoluene`
- Código E: `E320`
- Nome químico: `3,5-di-tert-butyl-4-hydroxytoluene`

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

## 📝 Notas

- O app funciona melhor com rótulos bem iluminados e em foco
- A precisão depende da qualidade do OCR
- Alguns rótulos podem ter texto em áreas difíceis de ler
- No mobile, o OCR automático pode não estar disponível - use a entrada manual como alternativa

## 🔗 Links

- **Website:** https://bhtdetector.com.br
- **GitHub:** [Costanza22/BHT-Detector](https://github.com/Costanza22/BHT-Detector)

## 📄 Licença

Copyright © 2025 Costanza Pasquotto Assef. Todos os direitos reservados.

Este software é propriedade privada. É proibida a cópia, modificação, distribuição ou uso comercial sem autorização expressa por escrito.
