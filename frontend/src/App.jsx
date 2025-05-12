import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Home from './paginas/home/Home';
import Login from './paginas/login/Login';
import Registro from './paginas/registro/Registro';
import Loading from './componentes/Loader/Loading';

//Rutas para Cliente
import LineasPerfumes from './paginas/lineasPerfumes/lineasPerfumes';
import ProductosLinea from './paginas/productosLinea/ProductosLinea';
import PaginaProducto from './paginas/paginaProducto/PaginaProducto';

//Rutas para marcas de fragancias
import MarcaHome from './paginas/marcaHome/MarcaHome';
import ListaMarcas from './paginas/listaMarcas/ListaMarcas';

//Rutas para Administrador
import RegistroMarca from './paginas/registroMarca/RegistroMarca';
import RegistroLinea from './paginas/registroLinea/RegistroLinea';
import RegistroProducto from './paginas/registroProducto/RegistroProducto';
import EditarProducto from './paginas/editarProducto/EditarProducto';

import ListaLineas from './paginas/listaLineas/ListaLineas';
import ListaProductos from './paginas/listaProductos/ListaProductos';

//import DiorFragances from './paginas/fragancias/dior/diorHome/DiorFragances';
//import ValentinoFragances from './paginas/fragancias/valentino/ValentinoFragances';

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

        {/* Rutas para Cliente */}
        <Route path="/marca/:nombreMarca" element={<MarcaHome />} />
        <Route path="/lineasPerfumes/:nombreMarca/:tipoLinea" element={<LineasPerfumes />} />
        <Route path="/:nombreMarca/:nombreLinea/productos" element={<ProductosLinea />} />
        <Route path="/producto/:idProducto" element={<PaginaProducto />} />

        {/* Rutas para Administrador */}
        <Route path="/listaMarcas" element={<ListaMarcas />} />
        <Route path="/registroLinea" element={<RegistroLinea />} />
        <Route path="/registroProducto" element={<RegistroProducto />} />
        <Route path="/listaLineas" element={<ListaLineas />} />
        <Route path="/listaProductos" element={<ListaProductos />} />
        <Route path="/registroMarca" element={<RegistroMarca />} />
        <Route path="/registroProducto" element={<RegistroProducto />} />
        <Route path="/editarProducto" element={<EditarProducto />} />

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
