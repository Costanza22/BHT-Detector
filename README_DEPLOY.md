# Deploy no Vercel - BHT Detector

## ⚠️ Limitação do EasyOCR no Vercel

O EasyOCR é muito pesado (requer ~2GB de memória) e não funciona no Vercel devido aos limites de memória dos planos gratuitos.

## Solução Implementada

1. **EasyOCR removido do requirements.txt** - Não será instalado no Vercel
2. **Análise de texto** - Funciona perfeitamente
3. **Análise de imagens** - Retorna mensagem informando que OCR não está disponível e sugere usar a análise de texto manual

## Como funciona no Vercel

- ✅ **Análise de Texto**: Funciona 100%
- ⚠️ **Análise de Imagens**: Mostra mensagem pedindo para usar análise de texto

## Alternativas para OCR no futuro

1. **API externa de OCR** (Google Vision API, AWS Textract, etc.)
2. **Deploy em outra plataforma** (Railway, Render, Fly.io) que oferece mais memória
3. **Processar imagens no cliente** usando bibliotecas JavaScript (Tesseract.js)

## Para deploy local (com OCR)

Se quiser usar OCR localmente, instale:
```bash
pip install easyocr
```

O código já está preparado para detectar se o EasyOCR está disponível e usá-lo quando possível.

