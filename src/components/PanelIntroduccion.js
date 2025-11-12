import React from 'react';
import './PanelIntroduccion.css';

const PanelIntroduccion = () => {
  return (
    <div className="panel panel-introduccion">
      <h1 className="titulo-principal">MEMORIAS CONECTADAS</h1>
      
      <div className="descripcion">
        <p>
          Este es un espacio para recordar juntos. Cada memoria compartida
          se convierte en una forma, un color e una palabra que habita nuestra
          memoria colectiva.
        </p>
      </div>

      <div className="formas-memoria">
        <div className="forma forma-1"></div>
        <div className="forma forma-2"></div>
      </div>

      <button className="boton-compartir">
        Compartir mi recuerdo
      </button>
    </div>
  );
};

export default PanelIntroduccion;
