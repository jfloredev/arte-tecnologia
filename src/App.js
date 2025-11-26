import React, { useState, useEffect } from 'react';
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
      emocion: "Alegría",
      autor: "Demo"
    },
    {
      id: 2,
      texto: "La primera vez que visité la playa con mi familia.",
      color: "#87CEEB",
      emocion: "Nostalgia",
      autor: "Demo"
    },
    {
      id: 3,
      texto: "El momento en que aprendí a andar en bicicleta.",
      color: "#4682B4",
      emocion: "Esperanza",
      autor: "Demo"
    },
    {
      id: 4,
      texto: "Aquel día lluvioso en el que todo cambió.",
      color: "#FFB84D",
      emocion: "Nostalgia",
      autor: "Demo"
    }
  ]);

  const [usuario, setUsuario] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('usuario');
    if (stored) setUsuario(stored);
  }, []);

  const handleUsuarioChange = (value) => {
    setUsuario(value);
    localStorage.setItem('usuario', value);
  };

  const agregarMemoria = (nuevaMemoria) => {
    setMemorias([...memorias, { ...nuevaMemoria, id: memorias.length + 1 }]);
  };

  const [inputTemp, setInputTemp] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (inputTemp.trim()) {
      handleUsuarioChange(inputTemp.trim());
    }
  };

  const handleLogout = () => {
    handleUsuarioChange('');
    setInputTemp('');
  };

  if (!usuario) {
    return (
      <div className="App login-screen">
        <div className="login-container">
          <h1 className="login-titulo">MEMORIAS CONECTADAS</h1>
          <p className="login-subtitulo">Un espacio para recordar juntos</p>
          
          <form onSubmit={handleLogin} className="login-form">
            <input
              className="login-input"
              type="text"
              placeholder="Ingresa tu nombre para comenzar"
              value={inputTemp}
              onChange={(e) => setInputTemp(e.target.value)}
              autoFocus
            />
            <button 
              type="submit" 
              className="login-button"
              disabled={!inputTemp.trim()}
            >
              Entrar
            </button>
          </form>

          <div className="login-formas">
            <div className="login-forma login-forma-1"></div>
            <div className="login-forma login-forma-2"></div>
            <div className="login-forma login-forma-3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="user-bar">
        <span className="user-welcome">Hola, <strong>{usuario}</strong></span>
        <button
          className="boton-logout"
          onClick={handleLogout}
        >
          Cerrar sesión
        </button>
      </div>
      <div className="container">
        <PanelIntroduccion usuario={usuario} />
        <PanelCompartir usuario={usuario} onAgregarMemoria={agregarMemoria} />
        <PanelColectivo memorias={memorias} />
      </div>
    </div>
  );
}

export default App;
