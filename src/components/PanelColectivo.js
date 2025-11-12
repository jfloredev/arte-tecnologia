import React, { useState } from 'react';
import './PanelColectivo.css';

const PanelColectivo = ({ memorias }) => {
  const [memoriaSeleccionada, setMemoriaSeleccionada] = useState(null);

  return (
    <div className="panel panel-colectivo">
      <h2 className="titulo-seccion">Memoria colectiva</h2>
      
      <div className="grid-memorias">
        {memorias.map((memoria) => (
          <div
            key={memoria.id}
            className="tarjeta-memoria"
            style={{ backgroundColor: memoria.color }}
            onClick={() => setMemoriaSeleccionada(memoria)}
          >
            <div className="forma-abstracta"></div>
          </div>
        ))}
      </div>

      {memoriaSeleccionada && (
        <div className="modal-memoria" onClick={() => setMemoriaSeleccionada(null)}>
          <div className="contenido-modal" onClick={(e) => e.stopPropagation()}>
            <p className="texto-memoria">{memoriaSeleccionada.texto}</p>
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
