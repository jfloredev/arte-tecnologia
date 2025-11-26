import React, { useState } from 'react';
import './PanelColectivo.css';

const PanelColectivo = ({ memorias }) => {
  const [memoriaSeleccionada, setMemoriaSeleccionada] = useState(null);
  const [imagenesError, setImagenesError] = useState({});

  const handleImageError = (memoriaId, memoria) => {
    console.log(`❌ Error cargando imagen: ${memoriaId}`);
    
    // Si falla, marcar como error pero mostrar el gradiente
    setImagenesError(prev => ({ ...prev, [memoriaId]: true }));
  };

  return (
    <div className="panel panel-colectivo">
      <h2 className="titulo-seccion">Memoria colectiva</h2>
      
      <div className="grid-memorias">
        {memorias.map((memoria) => (
          <div
            key={memoria.id}
            className="tarjeta-memoria"
            onClick={() => setMemoriaSeleccionada(memoria)}
          >
            {memoria.imagenUrl && !imagenesError[memoria.id] ? (
              <>
                <img 
                  src={memoria.imagenUrl} 
                  alt={`Memoria sobre ${memoria.emocion}`}
                  loading="lazy"
                  crossOrigin="anonymous"
                  onError={() => handleImageError(memoria.id, memoria)}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
                />
                {memoria.overlay && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: memoria.gradiente || memoria.color,
                      opacity: 0.4,
                      mixBlendMode: 'overlay'
                    }}
                  />
                )}
                <div className="overlay-emocion">{memoria.emocion}</div>
              </>
            ) : (
              <div 
                className="tarjeta-sin-imagen"
                style={{ 
                  width: '100%', 
                  height: '100%',
                  background: memoria.gradiente || memoria.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  padding: '20px',
                  textAlign: 'center'
                }}
              >
                <span style={{ fontSize: '2rem', marginBottom: '10px' }}>
                  {memoria.emocion === 'Alegría' && '😊'}
                  {memoria.emocion === 'Miedo' && '😰'}
                  {memoria.emocion === 'Nostalgia' && '🌅'}
                  {memoria.emocion === 'Esperanza' && '✨'}
                </span>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  {memoria.emocion}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {memoriaSeleccionada && (
        <div className="modal-memoria" onClick={() => setMemoriaSeleccionada(null)}>
          <div className="contenido-modal" onClick={(e) => e.stopPropagation()}>
            {memoriaSeleccionada.imagenUrl && (
              <div className="modal-imagen-preview">
                <img 
                  src={memoriaSeleccionada.imagenUrl} 
                  alt={memoriaSeleccionada.emocion}
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '400px', 
                    borderRadius: '12px',
                    marginBottom: '20px',
                    objectFit: 'cover'
                  }}
                />
              </div>
            )}
            <p className="texto-memoria">{memoriaSeleccionada.texto}</p>
            <p className="info-memoria">
              <strong>Emoción:</strong> {memoriaSeleccionada.emocion} • 
              <strong> Por:</strong> {memoriaSeleccionada.autor || 'Anónimo'}
            </p>
            <button className="boton-identificacion">
              ♥ Me identifica
            </button>
            <button 
              className="boton-cerrar"
              onClick={() => setMemoriaSeleccionada(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PanelColectivo;

