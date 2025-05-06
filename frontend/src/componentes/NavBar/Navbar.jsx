import React, { useState } from 'react';
import './navbar.css';

import { useNavigate, useLocation } from 'react-router-dom';

import ReorderIcon from '@mui/icons-material/Reorder';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LogoutIcon from '@mui/icons-material/Logout';

import Sidebar from '../SideBar/Sidebar';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Para controlar la visibilidad real
  const navigate = useNavigate();
  const location = useLocation(); // Obtener la ubicación actual

  const nombre = localStorage.getItem('nombreEmpleado'); // Obtener el nombre completo del localStorage

  const handleToggle = () => {
    if (!isOpen) {
      setIsVisible(true); // primero muestra el componente
      setTimeout(() => setIsOpen(true), 10); // luego activa la animación
    } else {
      setIsOpen(false); // inicia la animación de salida
      setTimeout(() => setIsVisible(false), 300); // espera que termine y desmonta
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  }

  const handleLogOut = () => {
    localStorage.removeItem('nombreEmpleado'); // Limpiar el nombre completo del localStorage
    localStorage.removeItem('token'); // Limpiar el token del localStorage
    localStorage.removeItem('rolUsuario'); // Limpiar el rol de usuario del localStorage
    setTimeout(() => {
      if(location.pathname !== '/') {
        navigate('/'); // Redirigir a la página de inicio
      }
      else {
        window.location.reload(); // Recargar la página si ya estás en la página de inicio
      }
    }
    , 1000);
  }

  return (
    <>
      <div className="nav-container">
        <nav className="navbar">
          <div className="nav-left">
            <ReorderIcon className="nav-icons" onClick={handleToggle} />
          </div>
          <div className="nav-center" onClick={handleHome}>VYNCE</div>
          <div className="nav-right">
          <ShoppingCartIcon className="nav-icons" />
            {
              nombre ? (
                <LogoutIcon className="nav-icons" onClick={handleLogOut}></LogoutIcon>
              ) : (
                <PersonIcon className="nav-icons" onClick={handleLogin}/>
              )
            }
          </div>
        </nav>
      </div>

      {isVisible && (
        <>
          <Sidebar isOpen={isOpen} onClose={handleToggle} />
          <div
            className={`sidebar-overlay ${isOpen ? 'show' : 'hide'}`}
            onClick={handleToggle}
          />
        </>
      )}
    </>
  );
}
