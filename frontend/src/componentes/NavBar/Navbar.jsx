import React, { useState } from 'react';
import './navbar.css';

import ReorderIcon from '@mui/icons-material/Reorder';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import Sidebar from '../SideBar/Sidebar';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Para controlar la visibilidad real

  const handleToggle = () => {
    if (!isOpen) {
      setIsVisible(true); // primero muestra el componente
      setTimeout(() => setIsOpen(true), 10); // luego activa la animación
    } else {
      setIsOpen(false); // inicia la animación de salida
      setTimeout(() => setIsVisible(false), 300); // espera que termine y desmonta
    }
  };

  return (
    <>
      <div className="nav-container">
        <nav className="navbar">
          <div className="nav-left">
            <ReorderIcon className="nav-icons" onClick={handleToggle} />
          </div>
          <div className="nav-center">VYNCE</div>
          <div className="nav-right">
            <PersonIcon className="nav-icons" />
            <ShoppingCartIcon className="nav-icons" />
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
