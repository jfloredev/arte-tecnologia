import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Configurar CORS para permitir solicitudes desde React
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL || '*'
    : ['http://localhost:3000', 'http://10.100.237.30:3000'],
  methods: ['GET', 'POST'],
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

// ✅ Ruta principal
app.get('/', (req, res) => {
  res.json({ 
    message: '✨ Backend de Memorias Conectadas funcionando!',
    status: 'online',
    endpoints: ['/generate-image', '/api/generate-image']
  });
});

// Health check para Vercel
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend funcionando' });
});

// 🎨 Endpoint usando Azure DALL-E como prioridad
app.post('/generate-image', async (req, res) => {
  try {
    const { texto, emocion } = req.body;

    console.log('\n🎨 ======= NUEVA SOLICITUD =======');
    console.log('📝 Texto:', texto);
    console.log('💭 Emoción:', emocion);

    if (!texto || !emocion) {
      return res.status(400).json({ error: 'Faltan campos' });
    }

    // Colores personalizados por emoción
    const colores = obtenerColoresPorDefecto(emocion);
    console.log('🎨 Colores:', colores);

    // Seed único basado en el texto
    const seed = Math.abs(
      texto.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
    ) % 999999;
    console.log('🎲 Seed:', seed);

    // Detectar temas históricos/sociales y enriquecer el prompt
    const temasHistoricos = {
      'covid': 'pandemia COVID-19, cuarentena, mascarillas, distanciamiento social, esperanza',
      'pandemia': 'pandemia COVID-19, cuarentena, solidaridad, resiliencia',
      'cuarentena': 'cuarentena COVID-19, aislamiento, ventanas, esperanza',
      'paradeportista': 'paradeportistas peruanos, superación, inclusión, determinación',
      'deportista': 'atletas paralímpicos, inclusión, fuerza',
      'paro': 'paro de transportistas, protesta, carreteras bloqueadas, impacto social',
      'transportista': 'camioneros, carreteras, protesta, economía peruana',
      'israel': 'conflicto Israel, guerra, paz, dolor',
      'guerra': 'conflicto bélico, sufrimiento, esperanza de paz',
      'fujimori': 'época Fujimori 1990s, Perú, historia política',
      'alberto': 'gobierno Fujimori, años 90, Perú',
      'castillo': 'Pedro Castillo, crisis política peruana, 2021-2022',
      'pedro': 'presidente Pedro Castillo, política peruana reciente',
      'terremoto': 'terremoto Áncash 1970, tragedia Yungay, memoria histórica',
      'ancash': 'terremoto 1970, Yungay, devastación, reconstrucción',
      'yungay': 'tragedia Yungay 1970, terremoto, memoria colectiva'
    };

    // Buscar si el texto menciona algún tema histórico
    let contextoHistorico = '';
    const textoLower = texto.toLowerCase();
    
    for (const [palabra, contexto] of Object.entries(temasHistoricos)) {
      if (textoLower.includes(palabra)) {
        contextoHistorico = contexto;
        console.log('📚 Tema histórico detectado:', palabra);
        break;
      }
    }

    // Crear prompt enriquecido con contexto histórico
    const palabrasClave = texto
      .toLowerCase()
      .replace(/[^\w\sáéíóúñ]/g, '')
      .split(' ')
      .filter(p => p.length > 2)
      .slice(0, 5)
      .join(' ');
    
    const promptBase = contextoHistorico 
      ? `${contextoHistorico}, ${palabrasClave}, ${emocion.toLowerCase()}, arte emotivo peruano`
      : `${palabrasClave} ${emocion.toLowerCase()} arte peruano colorido`;
    
    const prompt = promptBase;
    console.log('📋 Prompt:', prompt);

    // Intentar múltiples APIs hasta que una funcione
    let imagenUrl = null;
    let apiUsada = 'ninguna';
    let imagenDescargada = false;

    // API 1: Google Gemini 2.5 Flash Image (Nano Banana 🍌)
    if (process.env.GEMINI_API_KEY && !imagenUrl) {
      try {
        console.log('📡 Intentando Gemini 2.5 Flash Image (Nano Banana)...');
        
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: prompt,
        });
        
        // Buscar la imagen en la respuesta
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const base64Image = part.inlineData.data;
            const mimeType = part.inlineData.mimeType || 'image/png';
            imagenUrl = `data:${mimeType};base64,${base64Image}`;
            imagenDescargada = true;
            apiUsada = 'Gemini Nano Banana 🍌';
            console.log(`✅ Gemini generó imagen (${base64Image.length} chars)`);
            break;
          }
        }
        
        if (!imagenUrl) {
          throw new Error('No se encontró imagen en la respuesta');
        }
      } catch (e) {
        console.log('⚠️ Gemini Nano Banana falló:', e.message);
      }
    }

    // API 2: Pollinations (fallback)
    if (!imagenUrl) {
      try {
        console.log('📡 Intentando Pollinations...');
        const urlPollinations = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&seed=${seed}&nologo=true`;
        
        console.log('⏳ Descargando imagen...');
        const response = await fetch(urlPollinations, { 
          signal: AbortSignal.timeout(15000)
        });
        
        if (response.ok && response.headers.get('content-type')?.includes('image')) {
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64Image = buffer.toString('base64');
          const mimeType = response.headers.get('content-type') || 'image/jpeg';
          imagenUrl = `data:${mimeType};base64,${base64Image}`;
          imagenDescargada = true;
          apiUsada = 'Pollinations';
          console.log(`✅ Pollinations funcionó (${buffer.length} bytes)`);
        } else {
          throw new Error(`Status: ${response.status}`);
        }
      } catch (e) {
        console.log('⚠️ Pollinations falló:', e.message);
      }
    }

    // API 3: Hugging Face (modelo Stable Diffusion)
    if (!imagenUrl) {
      try {
        console.log('📡 Intentando Hugging Face API...');
        const hfUrl = 'https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-2-1';
        
        const hfResponse = await fetch(hfUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            inputs: prompt,
            parameters: {
              num_inference_steps: 30,
              guidance_scale: 7.5
            }
          }),
          signal: AbortSignal.timeout(30000)
        });
        
        if (hfResponse.ok) {
          const arrayBuffer = await hfResponse.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64Image = buffer.toString('base64');
          imagenUrl = `data:image/jpeg;base64,${base64Image}`;
          imagenDescargada = true;
          apiUsada = 'Hugging Face';
          console.log(`✅ Hugging Face funcionó (${buffer.length} bytes)`);
        } else {
          throw new Error(`HF Status: ${hfResponse.status}`);
        }
      } catch (e) {
        console.log('⚠️ Hugging Face falló:', e.message);
      }
    }

    // API 4: DeepAI
    if (!imagenUrl) {
      try {
        console.log('📡 Intentando con DeepAI...');
        const deepaiUrl = 'https://api.deepai.org/api/text2img';
        
        const formData = new URLSearchParams();
        formData.append('text', prompt);
        
        const deepaiResponse = await fetch(deepaiUrl, {
          method: 'POST',
          headers: {
            'api-key': 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData,
          signal: AbortSignal.timeout(30000)
        });
        
        if (deepaiResponse.ok) {
          const data = await deepaiResponse.json();
          if (data.output_url) {
            // Descargar la imagen
            const imgResponse = await fetch(data.output_url);
            const arrayBuffer = await imgResponse.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64Image = buffer.toString('base64');
            imagenUrl = `data:image/jpeg;base64,${base64Image}`;
            imagenDescargada = true;
            apiUsada = 'DeepAI';
            console.log(`✅ DeepAI funcionó (${buffer.length} bytes)`);
          } else {
            throw new Error('No output_url');
          }
        } else {
          throw new Error(`DeepAI Status: ${deepaiResponse.status}`);
        }
      } catch (e) {
        console.log('⚠️ DeepAI falló:', e.message);
      }
    }

    // API 5: Picsum como último recurso (NO relacionado con prompt)
    if (!imagenUrl) {
      console.log('📡 Usando Picsum (sin relación con prompt)...');
      const urlPicsum = `https://picsum.photos/seed/${seed}/1024/1024?blur=1`;
      
      try {
        const response = await fetch(urlPicsum, { 
          signal: AbortSignal.timeout(10000)
        });
        
        if (response.ok) {
          const arrayBuffer = await response.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const base64Image = buffer.toString('base64');
          imagenUrl = `data:image/jpeg;base64,${base64Image}`;
          imagenDescargada = true;
          apiUsada = 'Picsum (aleatorio)';
          console.log(`⚠️ Usando imagen aleatoria (${buffer.length} bytes)`);
        }
      } catch (e) {
        console.log('❌ Todas las APIs fallaron');
        imagenUrl = `https://via.placeholder.com/1024/${colores[0].replace('#', '')}/${colores[1].replace('#', '')}?text=${encodeURIComponent(texto.substring(0, 20))}`;
        apiUsada = 'Placeholder';
      }
    }

    console.log(`🖼️ API usada: ${apiUsada}`);
    console.log(`📦 Imagen como base64: ${imagenDescargada ? 'SÍ' : 'NO'}`);
    console.log(`🎯 Relacionada con prompt: ${['Gemini Nano Banana 🍌', 'Pollinations', 'Hugging Face', 'DeepAI'].includes(apiUsada) ? 'SÍ ✅' : 'NO ⚠️'}`);
    console.log('================================\n');

    res.json({
      success: true,
      imagenUrl: imagenUrl,
      promptUsado: prompt,
      colores: colores,
      gradiente: `linear-gradient(135deg, ${colores[0]} 0%, ${colores[1]} 50%, ${colores[2]} 100%)`,
      emocion: emocion,
      apiUsada: apiUsada
    });

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    
    const coloresPorDefecto = obtenerColoresPorDefecto(req.body.emocion || 'Alegría');
    const seed = Date.now() % 999999;
    
    res.json({
      success: true,
      imagenUrl: `https://picsum.photos/seed/${seed}/1024/1024`,
      promptUsado: 'Error - usando fallback',
      colores: coloresPorDefecto,
      gradiente: `linear-gradient(135deg, ${coloresPorDefecto[0]} 0%, ${coloresPorDefecto[1]} 50%, ${coloresPorDefecto[2]} 100%)`,
      error: true
    });
  }
});

// 🎨 Función auxiliar para colores por defecto
function obtenerColoresPorDefecto(emocion) {
  const coloresPorEmocion = {
    // Temas históricos y sociales
    'COVID-19 y Cuarentena': ['#E74C3C', '#C0392B', '#8E44AD'],
    'Paradeportistas': ['#3498DB', '#2ECC71', '#F39C12'],
    'Paros de Transportistas': ['#E67E22', '#D35400', '#95A5A6'],
    'Guerra en Israel': ['#34495E', '#7F8C8D', '#95A5A6'],
    'Gobierno de Fujimori': ['#8E44AD', '#9B59B6', '#5D6D7E'],
    'Pedro Castillo': ['#C0392B', '#E74C3C', '#F39C12'],
    'Terremoto de Áncash 1970': ['#2C3E50', '#34495E', '#7F8C8D'],
    'Temática Libre': ['#667eea', '#764ba2', '#f093fb'],
    
    // Emociones legacy (por si acaso)
    'Alegría': ['#FFD700', '#FFA500', '#FF6B6B'],
    'Miedo': ['#4A4A4A', '#2C2C2C', '#6B5B95'],
    'Nostalgia': ['#87CEEB', '#4682B4', '#6A5ACD'],
    'Esperanza': ['#90EE90', '#3CB371', '#20B2AA']
  };
  
  return coloresPorEmocion[emocion] || ['#667eea', '#764ba2', '#f093fb'];
}

// Exportar para Vercel
export default app;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n✨ Servidor backend iniciado en http://localhost:${PORT}`);
  console.log(`🌐 Esperando solicitudes desde http://localhost:3000`);
  console.log(`🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? '✅ Configurada' : '❌ No configurada'}`);
  console.log(`🍌 Usando Gemini 2.5 Flash Image (Nano Banana)\n`);
});
