# 📱 Guia de Publicação nas Lojas de Apps

Este guia explica como publicar o BHT Detector nas lojas de apps (Google Play Store e Apple App Store).

## 📋 Pré-requisitos

### Para Android (Google Play Store):
- Conta de desenvolvedor Google Play ($25 - pagamento único)
- Conta no [Google Play Console](https://play.google.com/console)

### Para iOS (Apple App Store):
- Conta de desenvolvedor Apple ($99/ano)
- Conta no [App Store Connect](https://appstoreconnect.apple.com/)
- Mac (para algumas etapas, mas o EAS Build pode fazer builds na nuvem)

## 🛠️ Configuração Inicial

### 1. Instalar EAS CLI

```bash
npm install -g eas-cli
```

### 2. Fazer login no Expo

```bash
eas login
```

### 3. Configurar o projeto

```bash
eas build:configure
```

Isso criará o arquivo `eas.json` (já está criado neste projeto).

## 📦 Criar Builds

### Android (APK para teste ou AAB para Play Store)

```bash
# Build de produção para Android
eas build --platform android --profile production

# Build de preview (APK) para testar
eas build --platform android --profile preview
```

### iOS (para App Store)

```bash
# Build de produção para iOS
eas build --platform ios --profile production
```

**Nota:** Para iOS, você precisará:
- Configurar certificados e perfis de provisionamento
- O EAS pode fazer isso automaticamente ou você pode fazer manualmente

## 🚀 Publicar nas Lojas

### Google Play Store

1. **Criar o build:**
   ```bash
   eas build --platform android --profile production
   ```

2. **Submeter para a Play Store:**
   ```bash
   eas submit --platform android
   ```

3. **Ou fazer manualmente:**
   - Acesse [Google Play Console](https://play.google.com/console)
   - Crie um novo app
   - Faça upload do arquivo `.aab` gerado
   - Preencha as informações do app (descrição, screenshots, etc.)
   - Submeta para revisão

### Apple App Store

1. **Criar o build:**
   ```bash
   eas build --platform ios --profile production
   ```

2. **Submeter para a App Store:**
   ```bash
   eas submit --platform ios
   ```

3. **Ou fazer manualmente:**
   - Acesse [App Store Connect](https://appstoreconnect.apple.com/)
   - Crie um novo app
   - Faça upload do arquivo `.ipa` via Transporter ou Xcode
   - Preencha as informações do app
   - Submeta para revisão

## 📝 Informações Necessárias para as Lojas

### Google Play Store:
- Nome do app: "BHT Detector"
- Descrição curta: "Detecte BHT em rótulos de alimentos"
- Descrição completa: (use a descrição do README)
- Screenshots: Pelo menos 2 (phone e tablet)
- Ícone: 512x512px
- Categoria: Saúde e Fitness / Utilitários
- Classificação de conteúdo: Para todos
- Política de privacidade: (URL do seu site)

### Apple App Store:
- Nome do app: "BHT Detector"
- Subtítulo: "Detector de BHT em alimentos"
- Descrição: (use a descrição do README)
- Screenshots: Pelo menos 1 para cada tamanho de tela
- Ícone: 1024x1024px
- Categoria: Saúde e Fitness / Utilitários
- Classificação: 4+ (Para todos)
- Política de privacidade: (URL do seu site)

## ⚙️ Atualizar o App

Para atualizar o app após publicar:

1. Atualize a versão no `app.json`:
   ```json
   "version": "1.0.1",
   "android": {
     "versionCode": 2
   },
   "ios": {
     "buildNumber": "1.0.1"
   }
   ```

2. Crie um novo build:
   ```bash
   eas build --platform all --profile production
   ```

3. Submeta para as lojas:
   ```bash
   eas submit --platform all
   ```

## 🔐 Credenciais

O EAS gerencia automaticamente as credenciais (certificados, chaves, etc.), mas você pode configurar manualmente se preferir.

## 📚 Recursos Úteis

- [Documentação EAS Build](https://docs.expo.dev/build/introduction/)
- [Documentação EAS Submit](https://docs.expo.dev/submit/introduction/)
- [Google Play Console](https://play.google.com/console)
- [App Store Connect](https://appstoreconnect.apple.com/)

## ⚠️ Notas Importantes

1. **Primeira publicação pode levar alguns dias** para ser aprovada
2. **iOS tem processo de revisão mais rigoroso** que Android
3. **Mantenha as credenciais seguras** - nunca commite chaves ou certificados
4. **Teste bem antes de publicar** - use builds de preview primeiro
5. **Política de privacidade é obrigatória** - crie uma página no seu site

