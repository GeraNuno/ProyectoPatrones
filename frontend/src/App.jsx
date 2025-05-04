import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Home from './paginas/home/Home';
import Login from './paginas/login/Login';
import Registro from './paginas/registro/Registro';
import Loading from './componentes/Loader/Loading';

//Rutas para Administrador
import RegistroMarca from './paginas/registroMarca/registroMarca';
import RegistroProducto from './paginas/registroProducto/RegistroProducto';

import DiorFragances from './paginas/fragancias/dior/diorHome/DiorFragances';
import DiorMen from './paginas/fragancias/dior/diorMen/DiorMen';
import ValentinoFragances from './paginas/fragancias/valentino/ValentinoFragances';

// Nuevo componente que usará el useLocation correctamente
function AppContent() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 400);
    return () => clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <>
      {loading && <Loading />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/dior" element={<DiorFragances />} />
        <Route path="/dior/men" element={<DiorMen />} />
        <Route path="/valentino" element={<ValentinoFragances />} />

        {/* Rutas para Administrador */}
        <Route path="/registroMarca" element={<RegistroMarca />} />
        <Route path="/registroProducto" element={<RegistroProducto />} />
        {/* Puedes agregar más rutas aquí */}
      </Routes>
    </>
  );
}

// Aquí envolvemos AppContent con Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
