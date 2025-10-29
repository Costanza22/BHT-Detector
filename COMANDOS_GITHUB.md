# Comandos para Subir no GitHub

## Passo a Passo

### 1. Verificar o status atual
```bash
git status
```

### 2. Adicionar todos os arquivos ao staging
```bash
git add .
```

### 3. Fazer o commit inicial
```bash
git commit -m "Initial commit: BHT Detector - Aplicação para detectar BHT em produtos"
```

### 4. Criar repositório no GitHub
   - Vá para: https://github.com/new
   - Crie um novo repositório (ex: `bht-detector`)
   - NÃO inicialize com README, .gitignore ou licença (já temos)

### 5. Conectar ao repositório remoto
```bash
git remote add origin https://github.com/SEU_USUARIO/bht-detector.git
```
*(Substitua SEU_USUARIO pelo seu username do GitHub)*

### 6. Renomear branch para main (se necessário)
```bash
git branch -M main
```

### 7. Fazer push para o GitHub
```bash
git push -u origin main
```

---

## Se já existe um repositório remoto

Se você já tem um repositório no GitHub:

```bash
git remote add origin https://github.com/SEU_USUARIO/bht-detector.git
git branch -M main
git push -u origin main
```

---

## Próximos commits (depois do primeiro)

```bash
git add .
git commit -m "Descrição das mudanças"
git push
```

