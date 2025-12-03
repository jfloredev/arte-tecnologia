// ⚠️ IMPORTANTE: Este servicio NO expone la API Key
// Todas las llamadas van a través del backend seguro en Node.js

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 
  (process.env.NODE_ENV === 'production' 
    ? '/api' 
    : 'http://localhost:5001');

// Función para generar imagen de forma SEGURA a través del backend
export const generarImagenMemoria = async (textoMemoria, emocion) => {
  try {
    console.log('🎨 Solicitando generación de imagen al backend...');
    
    const response = await fetch(`${BACKEND_URL}/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texto: textoMemoria,
        emocion: emocion
      })
    });

    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('✅ Imagen recibida del backend');

    return {
      success: data.success,
      imagenUrl: data.imagenUrl,
      promptUsado: data.promptUsado,
      colores: data.colores,
      gradiente: data.gradiente,
      overlay: false
    };

  } catch (error) {
    console.error('❌ Error conectando con el backend:', error.message);
    
    // Fallback con colores por defecto
    const coloresPorDefecto = obtenerColoresPorDefecto(emocion);
    
    return {
      success: false,
      error: error.message,
      imagenUrl: `https://image.pollinations.ai/prompt/abstract%20${emocion}%20art?width=1024&height=1024&nologo=true`,
      colores: coloresPorDefecto,
      gradiente: `linear-gradient(135deg, ${coloresPorDefecto[0]} 0%, ${coloresPorDefecto[1]} 50%, ${coloresPorDefecto[2]} 100%)`,
      overlay: false
    };
  }
};

// Colores por defecto según emoción
function obtenerColoresPorDefecto(emocion) {
  const coloresPorEmocion = {
    'Alegría': ['#FFD700', '#FFA500', '#FF6B6B'],
    'Miedo': ['#4A4A4A', '#2C2C2C', '#6B5B95'],
    'Nostalgia': ['#87CEEB', '#4682B4', '#6A5ACD'],
    'Esperanza': ['#90EE90', '#3CB371', '#20B2AA']
  };
  
  return coloresPorEmocion[emocion] || ['#667eea', '#764ba2', '#f093fb'];
}

