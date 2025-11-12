import React, { useState } from 'react';
import './PanelCompartir.css';

const PanelCompartir = ({ onAgregarMemoria }) => {
  const [texto, setTexto] = useState('');
  const [emocionSeleccionada, setEmocionSeleccionada] = useState('');

  const emociones = ['Alegría', 'Miedo', 'Nostalgia', 'Esperanza'];
  
  const coloresEmociones = {
    'Alegría': '#FFD700',
    'Miedo': '#8B7D6B',
    'Nostalgia': '#87CEEB',
    'Esperanza': '#90EE90'
  };

  const handleEnviar = () => {
    if (texto.trim() && emocionSeleccionada) {
      onAgregarMemoria({
        texto: texto,
        emocion: emocionSeleccionada,
        color: coloresEmociones[emocionSeleccionada]
      });
      setTexto('');
      setEmocionSeleccionada('');
    }
  };

  return (
    <div className="panel panel-compartir">
      <h2 className="titulo-seccion">Comparte tu memoria</h2>
      
      <textarea
        className="textarea-memoria"
        placeholder="Escribe aquí un recuerdo sobre"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />

      <div className="emociones-container">
        {emociones.map((emocion) => (
          <button
            key={emocion}
            className={`boton-emocion ${emocionSeleccionada === emocion ? 'seleccionado' : ''}`}
            onClick={() => setEmocionSeleccionada(emocion)}
          >
            {emocion}
          </button>
        ))}
      </div>

      <button 
        className="boton-enviar"
        onClick={handleEnviar}
        disabled={!texto.trim() || !emocionSeleccionada}
      >
        Enviar
      </button>
    </div>
  );
};

export default PanelCompartir;
