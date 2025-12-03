# 🚀 Guía de Deploy en Vercel

## Pasos para desplegar:

### 1. Preparar el repositorio
```bash
git add .
git commit -m "Configurado para Vercel"
git push origin main
```

### 2. Ir a Vercel
- Ve a https://vercel.com
- Click en "Add New" → "Project"
- Importa tu repositorio: `jfloredev/arte-tecnologia`

### 3. Configurar el proyecto
En la página de configuración:

**Build & Development Settings:**
- Framework Preset: `Create React App`
- Build Command: `npm run build`
- Output Directory: `build`
- Install Command: `npm install`

### 4. Agregar variables de entorno
En "Environment Variables":
- Name: `GEMINI_API_KEY`
- Value: `AIzaSyCK8pHIpmkztVgNSxDs4cwFabvUjqreGQc`
- ✅ Production
- ✅ Preview
- ✅ Development

### 5. Deploy
- Click en "Deploy"
- Espera 2-3 minutos
- ¡Listo! Tu app estará en: `https://arte-tecnologia.vercel.app`

## URLs después del deploy:
- Frontend: `https://arte-tecnologia.vercel.app`
- Backend API: `https://arte-tecnologia.vercel.app/api/generate-image`
- Health Check: `https://arte-tecnologia.vercel.app/api/health`

## Actualizaciones futuras:
Cada push a `main` desplegará automáticamente.

## Troubleshooting:
Si algo falla:
1. Verifica que la API Key esté en Environment Variables
2. Revisa los logs en Vercel Dashboard
3. Asegúrate de que el build pasó exitosamente
