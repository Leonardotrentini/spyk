# ⚡ Configuração Rápida na Vercel

## Na tela "New Project", configure:

### 1. Root Directory ⚠️ CRÍTICO
- **Atual**: `./`
- **Mude para**: `googlestudio`
- **Como**: Clique em "Edit" → Digite `googlestudio` → Salve

### 2. Framework Preset
- **Atual**: "Other"
- **Mude para**: "Vite"
- Se não aparecer "Vite", deixe "Other" (o vercel.json já está configurado)

### 3. Build and Output Settings (Expandir)
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

### 4. Deploy
- Clique no botão "Deploy"

---

**O mais importante é o Root Directory: DEVE SER `googlestudio`**

