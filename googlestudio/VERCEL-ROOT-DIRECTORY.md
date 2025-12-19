# ⚠️ IMPORTANTE: Configuração do Root Directory na Vercel

## 🔴 ERRO COMUM

Se você ver este erro:
```
Error: Could not read /vercel/path0/package.json: Expected property name or '}' in JSON at position 2.
```

## ✅ SOLUÇÃO

**Na tela de configuração do projeto na Vercel:**

1. **Root Directory**: Mude de `./` para `googlestudio`
   - Clique no botão "Edit" ao lado do campo "Root Directory"
   - Digite: `googlestudio`
   - Ou selecione a pasta `googlestudio` no seletor

2. **Framework Preset**: Deve ser "Vite" (não Next.js)
   - Se estiver mostrando "Next.js", mude para "Vite"

3. **Build Settings** (deve detectar automaticamente):
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

## 📋 Checklist de Configuração

- [ ] Root Directory: `googlestudio` (NÃO `./`)
- [ ] Framework Preset: `Vite`
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`

## 🎯 Por que isso acontece?

O projeto está dentro da pasta `googlestudio/`, não na raiz do repositório. A Vercel precisa saber onde está o `package.json` correto.

---

**Após configurar o Root Directory como `googlestudio`, o deploy deve funcionar!**

