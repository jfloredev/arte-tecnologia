import React, { useState } from 'react';
import './PanelCompartir.css';
import { generarImagenMemoria } from '../services/geminiService';

const PanelCompartir = ({ usuario, onAgregarMemoria }) => {
  const [texto, setTexto] = useState('');
  const [emocionSeleccionada, setEmocionSeleccionada] = useState('');
  const [generando, setGenerando] = useState(false);

  const emociones = ['Alegría', 'Miedo', 'Nostalgia', 'Esperanza'];

  const handleEnviar = async () => {
    if (texto.trim() && emocionSeleccionada && usuario) {
      setGenerando(true);
      
      console.log('🚀 Iniciando generación de memoria...');
      console.log('📝 Texto:', texto);
      console.log('💭 Emoción:', emocionSeleccionada);
      
      // Generar imagen y paleta de colores con Gemini
      const resultado = await generarImagenMemoria(texto, emocionSeleccionada);
      
      console.log('✅ Resultado de generación:', resultado);
      
      onAgregarMemoria({
        texto: texto,
        emocion: emocionSeleccionada,
        color: resultado.colores[0],
        gradiente: resultado.gradiente,
        imagenUrl: resultado.imagenUrl,
        overlay: resultado.overlay || false,
        autor: usuario,
        fecha: new Date().toISOString()
      });
      
      setTexto('');
      setEmocionSeleccionada('');
      setGenerando(false);
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
        disabled={!texto.trim() || !emocionSeleccionada || !usuario || generando}
      >
        {generando ? '✨ Generando...' : 'Enviar'}
      </button>
    </div>
  );
};

export default PanelCompartir;
