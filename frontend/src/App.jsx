/*import { useEffect } from 'react';
import { socket } from './servicios/socket';*/

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Rutas
import Home from './paginas/home/Home';


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
        </Routes>
      </Router>
    </>
  );
}

export default App;
