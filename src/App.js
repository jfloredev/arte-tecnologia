import React, { useState } from 'react';
import './App.css';
import PanelIntroduccion from './components/PanelIntroduccion';
import PanelCompartir from './components/PanelCompartir';
import PanelColectivo from './components/PanelColectivo';

function App() {
  const [memorias, setMemorias] = useState([
    {
      id: 1,
      texto: "Recuerdo el día que nos reunimos con mis primos después de tantos años.",
      color: "#FFB84D",
      emocion: "Alegría"
    },
    {
      id: 2,
      texto: "La primera vez que visité la playa con mi familia.",
      color: "#87CEEB",
      emocion: "Nostalgia"
    },
    {
      id: 3,
      texto: "El momento en que aprendí a andar en bicicleta.",
      color: "#4682B4",
      emocion: "Esperanza"
    },
    {
      id: 4,
      texto: "Aquel día lluvioso en el que todo cambió.",
      color: "#FFB84D",
      emocion: "Nostalgia"
    }
  ]);

  const agregarMemoria = (nuevaMemoria) => {
    setMemorias([...memorias, { ...nuevaMemoria, id: memorias.length + 1 }]);
  };

  return (
    <div className="App">
      <div className="container">
        <PanelIntroduccion />
        <PanelCompartir onAgregarMemoria={agregarMemoria} />
        <PanelColectivo memorias={memorias} />
      </div>
    </div>
  );
}

export default App;
