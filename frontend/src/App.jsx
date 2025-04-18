/*import { useEffect } from 'react';
import { socket } from './servicios/socket';*/

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Rutas
import Home from './paginas/home/Home';
import Login from './paginas/login/Login';
import Registro from './paginas/registro/Registro';

//Dior
import DiorFragances from './paginas/fragancias/dior/diorHome/DiorFragances';
import DiorMen from './paginas/fragancias/dior/diorMen/DiorMen';
//Valentino
import ValentinoFragances from './paginas/fragancias/valentino/ValentinoFragances';

function App() {
  /*useEffect(() => {
    socket.on('nuevoTicket', (data) => {
      console.log('Nuevo ticket recibido:', data);
    });

    return () => {
      socket.off('nuevoTicket');
    };
  }, []);

  const enviarTicket = () => {
    socket.emit('enviarTicket', { mensaje: 'Necesito ayuda con X', usuario: 'Juan' });
  };*/

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          {/* Rutas de fragancias */}
          <Route path="/dior" element={<DiorFragances />} />
          <Route path="/dior/men" element={<DiorMen />} />
          <Route path="/valentino" element={<ValentinoFragances />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
