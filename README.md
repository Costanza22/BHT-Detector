# BHT Detector 🤖

## 💡 Sobre o Projeto

Tenho alergia a **BHT** (Butylated Hydroxytoluene) e enfrento diariamente o desafio de verificar rótulos de produtos para evitar reações alérgicas. Frustrada com a dificuldade de encontrar esse conservante em listas de ingredientes (às vezes com nomes diferentes como E320, INS 320, etc.), decidi criar uma **Inteligência Artificial** que me ajuda e pode ajudar outras pessoas na mesma situação.

Esta aplicação utiliza **OCR (Reconhecimento Óptico de Caracteres)** e análise inteligente de texto para detectar automaticamente a presença de BHT em produtos, seja através de:
- 📝 **Texto copiado** de rótulos
- 📸 **Imagens de embalagens** (fotos que você tira no supermercado)

## 🎯 Para Quem É Este Projeto?

- Pessoas com **alergia ou sensibilidade ao BHT**
- Quem quer verificar produtos rapidamente antes de comprar
- Quem busca uma ferramenta prática e acessível para leitura de rótulos
- Qualquer pessoa interessada em conhecer os ingredientes dos produtos

## 🚀 Como Funciona

O BHT Detector utiliza inteligência artificial para:

1. **Extrair texto de imagens** usando OCR (EasyOCR)
2. **Analisar o conteúdo** procurando por todas as variações do BHT:
   - BHT / bht
   - Butylated Hydroxytoluene
   - Butilado Hidroxitolueno
   - E320 / INS 320
   - E 320 / 320 (BHT)

3. **Alertar imediatamente** se o produto contém BHT ou suas variações

## 📦 Instalação e Uso

### Pré-requisitos

- Python 3.8 ou superior
- EasyOCR (instalado automaticamente)

### Passo a Passo

1. **Clone ou baixe este projeto**

2. **Instale as dependências:**
```bash
pip install -r requirements.txt
```

3. **Execute a aplicação:**
```bash
python app.py
```

4. **Acesse no navegador:**
```
http://localhost:5000
```

5. **Como usar:**
   - **Análise por Texto**: Copie o texto do rótulo e cole na área de análise
   - **Análise por Imagem**: Tire uma foto da embalagem ou cole uma imagem (Ctrl+V) e deixe a IA analisar automaticamente

## ✨ Funcionalidades

### 📝 Análise de Texto
Cole diretamente o texto dos ingredientes do produto. A IA identifica instantaneamente qualquer menção a BHT.

### 📸 Análise de Imagens
- Faça upload de uma foto da embalagem
- **Cole imagens diretamente** (Ctrl+V) - perfeito para quem está no celular!
- Arraste e solte imagens
- O sistema usa OCR para extrair e analisar o texto automaticamente

### 🎨 Interface Moderna
- Design limpo e intuitivo
- Tema claro e acessível
- Efeitos 3D interativos
- Totalmente responsivo (funciona em celular e computador)

## 🔍 O Que é BHT?

O **BHT** (Butylated Hydroxytoluene ou Hidroxitolueno Butilado) é um conservante sintético amplamente utilizado em:
- Alimentos processados
- Produtos de panificação
- Fast food
- Cosméticos
- Produtos farmacêuticos

Ele aparece nos rótulos como:
- **BHT**
- **E320** (código europeu)
- **INS 320** (código internacional)
- **Butylated Hydroxytoluene** (nome completo em inglês)
- **Butilado Hidroxitolueno** (nome completo em português)

## ⚠️ Avisos Importantes

1. **Esta é uma ferramenta de ajuda**, não substitui o cuidado médico
2. **Sempre consulte um médico ou nutricionista** sobre alergias alimentares
3. **A detecção pode não ser 100% precisa** em todos os casos (por exemplo, se a imagem estiver muito escura ou borrada)
4. **Sempre leia os rótulos** quando possível para confirmar

## 💻 Tecnologias Utilizadas

- **Backend**: Flask (Python) - Servidor web
- **OCR**: EasyOCR - Reconhecimento de texto em imagens
- **Frontend**: HTML5, CSS3, JavaScript
- **Processamento**: PIL/Pillow - Manipulação de imagens

## 📁 Estrutura do Projeto

```
BHT/
├── app.py                  # Aplicação Flask principal
├── requirements.txt        # Dependências Python
├── README.md              # Este arquivo
├── templates/
│   └── index.html         # Interface HTML
├── static/
│   ├── css/
│   │   └── style.css      # Estilos CSS
│   ├── js/
│   │   └── main.js        # JavaScript frontend
│   └── images/
│       └── leite ninho.jpg # Imagem do produto (exemplo)
└── uploads/               # Pasta para uploads temporários (criada automaticamente)
```

## 🤝 Contribuindo

Este projeto foi criado para ajudar pessoas com alergia a BHT. Se você também tem essa alergia ou conhece alguém que tenha, sinta-se à vontade para:
- Sugerir melhorias
- Reportar bugs
- Compartilhar com outras pessoas que possam se beneficiar

## 💚 Um Pouco da Minha História

Como pessoa com alergia a BHT, sei como é frustrante ter que ler rótulo por rótulo em busca desse conservante. Muitas vezes, ele aparece com nomes diferentes (E320, INS 320) ou em lugares onde você menos espera.

Criei esta IA como uma solução prática e acessível para:
- ✅ Evitar produtos com BHT
- ✅ Ganhar tempo no supermercado
- ✅ Ter mais confiança na escolha de produtos
- ✅ Ajudar outras pessoas na mesma situação



