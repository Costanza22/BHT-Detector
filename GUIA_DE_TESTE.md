# 🧪 Guia de Teste - Detector de BHT

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter:
- ✅ Node.js 18+ instalado
- ✅ npm ou yarn instalado
- ✅ Expo Go instalado no seu celular (Android/iOS) OU emulador configurado

## 🚀 Passo 1: Instalar Dependências

Se ainda não instalou, execute:

```bash
npm install
```

## 🚀 Passo 2: Iniciar o Servidor

Execute um dos comandos abaixo:

### Opção A: Modo Interativo (Recomendado)
```bash
npm start
```
ou
```bash
npx expo start
```

Isso abrirá o Metro Bundler com um QR code.

### Opção B: Modo Específico
```bash
# Para Android
npm run android

# Para iOS (apenas Mac)
npm run ios

# Para Web
npm run web
```

## 📱 Passo 3: Conectar o Dispositivo

### No Celular (Expo Go):

1. **Android:**
   - Abra o app Expo Go
   - Toque em "Scan QR Code"
   - Escaneie o QR code que aparece no terminal
   - Aguarde o app carregar

2. **iOS:**
   - Abra o app Expo Go
   - Use a câmera do iPhone para escanear o QR code
   - Toque na notificação que aparece
   - Aguarde o app carregar

### No Emulador:

1. **Android Emulator:**
   - Abra o Android Studio
   - Inicie um emulador
   - No terminal, pressione `a` ou execute `npm run android`

2. **iOS Simulator (apenas Mac):**
   - Abra o Xcode
   - Inicie um simulador
   - No terminal, pressione `i` ou execute `npm run ios`

### No Navegador (Web):

- No terminal, pressione `w` ou execute `npm run web`
- O app abrirá automaticamente no navegador

## 🧪 Passo 4: Testar o App

### Teste 1: Navegação Básica

1. ✅ Verifique se a tela inicial carrega
2. ✅ Teste navegar entre as abas:
   - **Home**: Tela inicial
   - **Escanear**: Tela de câmera
   - **Sobre**: Informações sobre BHT

### Teste 2: Funcionalidade de Escaneamento

1. Vá para a aba **"Escanear"**
2. ✅ Verifique se a câmera abre (ou solicita permissão)
3. ✅ Teste os botões:
   - **Ícone de foto**: Selecionar da galeria
   - **Botão central**: Tirar foto
   - **Ícone de rotação**: Alternar câmera frontal/traseira

### Teste 3: Detecção de BHT (Modo Demo)

Como o OCR ainda não está configurado, o app usa um texto de exemplo:

1. Tire uma foto ou selecione uma imagem da galeria
2. ✅ O app processará e mostrará o resultado
3. ✅ Verifique se aparece:
   - **"BHT Detectado!"** (com texto de exemplo)
   - Nível de confiança
   - Termos encontrados
   - Preview da imagem

### Teste 4: Tela de Resultado

Na tela de resultado, teste:

1. ✅ Botão "Ouvir Resultado" (text-to-speech)
2. ✅ Botão "Nova Análise" (volta para câmera)
3. ✅ Botão de voltar (seta no topo)
4. ✅ Visualização da imagem escaneada

### Teste 5: Tema Claro/Escuro

1. ✅ Mude o tema do sistema (configurações do celular)
2. ✅ Verifique se o app adapta automaticamente

## 🔧 Teste com Textos Diferentes

Para testar diferentes cenários, edite o texto de exemplo:

1. Abra `app/(tabs)/scan.tsx`
2. Encontre a variável `mockText` (linha ~112)
3. Modifique o texto para testar:

### Exemplo 1: Produto COM BHT
```typescript
const mockText = `
  INGREDIENTES:
  Farinha de trigo, açúcar, gordura vegetal,
  BHT (antioxidante), sal, fermento.
`;
```

### Exemplo 2: Produto SEM BHT
```typescript
const mockText = `
  INGREDIENTES:
  Farinha de trigo, açúcar, gordura vegetal,
  sal, fermento químico, aromatizante natural.
`;
```

### Exemplo 3: Produto com E320 (código europeu)
```typescript
const mockText = `
  INGREDIENTES:
  Farinha, açúcar, óleo vegetal,
  E320 (antioxidante), sal.
`;
```

### Exemplo 4: Produto com nome completo
```typescript
const mockText = `
  INGREDIENTES:
  Farinha, açúcar, gordura,
  Butylated Hydroxytoluene, sal.
`;
```

Após modificar, salve o arquivo. O app recarregará automaticamente (Hot Reload).

## 🐛 Solução de Problemas

### Problema: App não carrega
- ✅ Verifique se todas as dependências estão instaladas: `npm install`
- ✅ Limpe o cache: `npx expo start -c`
- ✅ Reinicie o Metro Bundler

### Problema: Câmera não funciona
- ✅ Verifique as permissões no dispositivo
- ✅ No Android, verifique `AndroidManifest.xml` (gerado automaticamente)
- ✅ No iOS, verifique `Info.plist` (gerado automaticamente)

### Problema: Erro de módulo não encontrado
- ✅ Execute `npm install` novamente
- ✅ Verifique se `node_modules` existe

### Problema: Hot Reload não funciona
- ✅ No terminal, pressione `r` para recarregar
- ✅ No dispositivo, agite o celular e toque em "Reload"

### Problema: Erro de TypeScript
- ✅ Execute `npm run lint` para ver erros
- ✅ Verifique se todos os arquivos estão salvos

## 📊 Checklist de Testes

Marque conforme testa:

### Funcionalidades Básicas
- [ ] App inicia sem erros
- [ ] Navegação entre abas funciona
- [ ] Tema claro/escuro funciona
- [ ] Permissões de câmera são solicitadas corretamente

### Funcionalidade de Escaneamento
- [ ] Câmera abre corretamente
- [ ] Botão de tirar foto funciona
- [ ] Seleção de galeria funciona
- [ ] Alternância de câmera funciona
- [ ] Processamento de imagem funciona

### Detecção de BHT
- [ ] Detecta BHT quando presente
- [ ] Não detecta BHT quando ausente
- [ ] Mostra nível de confiança
- [ ] Lista termos encontrados
- [ ] Funciona com diferentes formatos (BHT, E320, nome completo)

### Tela de Resultado
- [ ] Exibe resultado corretamente
- [ ] Mostra preview da imagem
- [ ] Botão de voz funciona
- [ ] Botão de nova análise funciona
- [ ] Navegação de volta funciona

## 🎯 Próximos Passos Após Teste

1. **Configurar OCR real** (Google Vision API ou outra)
2. **Testar com rótulos reais** de alimentos
3. **Ajustar padrões de detecção** se necessário
4. **Adicionar histórico** de análises (opcional)
5. **Melhorar UI/UX** baseado nos testes

## 💡 Dicas

- Use o modo de desenvolvimento para ver erros em tempo real
- Teste em diferentes dispositivos e tamanhos de tela
- Teste com diferentes condições de iluminação (para quando integrar OCR real)
- Mantenha o terminal aberto para ver logs e erros

## 📞 Precisa de Ajuda?

Se encontrar problemas:
1. Verifique os logs no terminal
2. Verifique o console do Expo Go (agite o celular)
3. Consulte a documentação do Expo: https://docs.expo.dev

