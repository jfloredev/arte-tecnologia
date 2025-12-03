import React, { useState, useEffect } from 'react';
import './App.css';
import PanelCompartir from './components/PanelCompartir';
import PanelColectivo from './components/PanelColectivo';

function App() {
  const [memorias, setMemorias] = useState([]);

  const [usuario, setUsuario] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('usuario');
    if (stored) setUsuario(stored);
  }, []);

  const handleUsuarioChange = (value) => {
    setUsuario(value);
    localStorage.setItem('usuario', value);
  };

  const agregarMemoria = (nuevaMemoria, idActualizar = null) => {
    if (idActualizar) {
      // Actualizar memoria existente
      setMemorias(memorias.map(m => 
        m.id === idActualizar ? { ...nuevaMemoria, id: idActualizar } : m
      ));
    } else {
      // Agregar nueva memoria
      const nuevaMemoriaConId = { ...nuevaMemoria, id: memorias.length + 1 };
      setMemorias([...memorias, nuevaMemoriaConId]);
      
      // Programar eliminación de imagen después de 3 minutos
      if (nuevaMemoriaConId.imagenUrl) {
        setTimeout(() => {
          setMemorias(prev => prev.map(m => 
            m.id === nuevaMemoriaConId.id 
              ? { ...m, imagenUrl: null } 
              : m
          ));
          console.log(`🗑️ Imagen eliminada de memoria ID ${nuevaMemoriaConId.id} después de 3 minutos`);
        }, 3 * 60 * 1000); // 3 minutos
      }
    }
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
        <PanelCompartir usuario={usuario} onAgregarMemoria={agregarMemoria} />
        <PanelColectivo memorias={memorias} onAgregarMemoria={agregarMemoria} usuario={usuario} />
      </div>
    </div>
  );
}

export default App;
