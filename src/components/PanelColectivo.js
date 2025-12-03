import React, { useState } from 'react';
import './PanelColectivo.css';
import { generarImagenMemoria } from '../services/geminiService';

const PanelColectivo = ({ memorias, onAgregarMemoria, usuario }) => {
  const [memoriaSeleccionada, setMemoriaSeleccionada] = useState(null);
  const [imagenesError, setImagenesError] = useState({});
  const [identificado, setIdentificado] = useState(false);
  const [mostrarPrompt, setMostrarPrompt] = useState(false);
  const [nuevoPrompt, setNuevoPrompt] = useState('');
  const [generando, setGenerando] = useState(false);

  const handleImageError = (memoriaId, memoria) => {
    console.log(`❌ Error cargando imagen: ${memoriaId}`);
    
    // Si falla, marcar como error pero mostrar el gradiente
    setImagenesError(prev => ({ ...prev, [memoriaId]: true }));
  };

  const handleIdentificacion = () => {
    setIdentificado(true);
    setMostrarPrompt(true);
  };

  const handleGenerarVariacion = async () => {
    if (!nuevoPrompt.trim() || !memoriaSeleccionada) return;
    
    setGenerando(true);
    
    try {
      const promptCombinado = `${memoriaSeleccionada.texto}. ${nuevoPrompt}`;
      
      const resultado = await generarImagenMemoria(promptCombinado, memoriaSeleccionada.emocion);
      
      if (resultado.success) {
        // Actualizar la memoria existente con la nueva imagen
        const memoriaActualizada = {
          ...memoriaSeleccionada,
          texto: promptCombinado,
          imagenUrl: resultado.imagenUrl,
          color: resultado.colores?.primario,
          gradiente: resultado.gradiente,
          autor: `${memoriaSeleccionada.autor} + ${usuario}`
        };
        
        // Actualizar en la lista de memorias
        if (onAgregarMemoria) {
          onAgregarMemoria(memoriaActualizada, memoriaSeleccionada.id);
          
          // Programar eliminación de la imagen actualizada después de 3 minutos
          setTimeout(() => {
            onAgregarMemoria(
              { ...memoriaActualizada, imagenUrl: null },
              memoriaSeleccionada.id
            );
            console.log(`🗑️ Imagen actualizada eliminada después de 3 minutos`);
          }, 3 * 60 * 1000);
        }
        
        // Actualizar la vista del modal
        setMemoriaSeleccionada(memoriaActualizada);
        setNuevoPrompt('');
        setIdentificado(false);
        setMostrarPrompt(false);
      }
    } catch (error) {
      console.error('Error generando variación:', error);
    } finally {
      setGenerando(false);
    }
  };

  const cerrarModal = () => {
    setMemoriaSeleccionada(null);
    setIdentificado(false);
    setMostrarPrompt(false);
    setNuevoPrompt('');
  };

  return (
    <div className="panel panel-colectivo">
      <h2 className="titulo-seccion">Memoria Colectiva</h2>
      
      <div className="galeria-memorias">
        {memorias.map((memoria) => (
          <div
            key={memoria.id}
            className="memoria-item"
            onClick={() => setMemoriaSeleccionada(memoria)}
          >
            <div className="memoria-imagen-container">
              {memoria.imagenUrl && !imagenesError[memoria.id] ? (
                <img 
                  src={memoria.imagenUrl} 
                  alt={`Memoria: ${memoria.texto.substring(0, 50)}`}
                  loading="lazy"
                  crossOrigin="anonymous"
                  onError={() => handleImageError(memoria.id, memoria)}
                  className="memoria-imagen"
                />
              ) : (
                <div 
                  className="memoria-placeholder"
                  style={{ background: memoria.gradiente || memoria.color }}
                />
              )}
              <div className="memoria-overlay">
                <span className="memoria-tag">{memoria.emocion}</span>
              </div>
            </div>
            <div className="memoria-info">
              <p className="memoria-texto-preview">{memoria.texto}</p>
              <div className="memoria-meta">
                <span className="memoria-autor">👤 {memoria.autor || 'Anónimo'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {memoriaSeleccionada && (
        <div className="modal-memoria" onClick={cerrarModal}>
          <div className="contenido-modal" onClick={(e) => e.stopPropagation()}>
            <button 
              className="boton-cerrar"
              onClick={cerrarModal}
            >
              ✕
            </button>
            
            {memoriaSeleccionada.imagenUrl && (
              <div className="modal-imagen-container">
                <img 
                  src={memoriaSeleccionada.imagenUrl} 
                  alt={memoriaSeleccionada.emocion}
                />
              </div>
            )}
            
            <div className="modal-contenido-texto">
              <span className="memoria-tag">{memoriaSeleccionada.emocion}</span>
              <p className="texto-memoria">{memoriaSeleccionada.texto}</p>
              
              <div className="info-memoria">
                <div>
                  <strong>👤 Autor:</strong> {memoriaSeleccionada.autor || 'Anónimo'}
                </div>
              </div>
              
              {!identificado ? (
                <button 
                  className="boton-identificacion"
                  onClick={handleIdentificacion}
                >
                  ♥ Me identifica
                </button>
              ) : (
                <div className="seccion-variacion">
                  <p className="texto-identificado">
                    ✓ Te identificas con esta memoria
                  </p>
                  
                  {mostrarPrompt && (
                    <div className="prompt-variacion">
                      <label className="label-prompt">
                        Agrega tu perspectiva a esta memoria:
                      </label>
                      <textarea
                        className="textarea-variacion"
                        placeholder="Describe cómo fue tu experiencia con este tema..."
                        value={nuevoPrompt}
                        onChange={(e) => setNuevoPrompt(e.target.value)}
                        disabled={generando}
                      />
                      <button
                        className="boton-generar-variacion"
                        onClick={handleGenerarVariacion}
                        disabled={!nuevoPrompt.trim() || generando}
                      >
                        {generando ? '🎨 Generando...' : '✨ Crear mi versión'}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelColectivo;

