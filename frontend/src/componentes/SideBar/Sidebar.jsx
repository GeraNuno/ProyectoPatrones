import React, { useState } from 'react';
import './sidebar.css';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';

import { useNavigate } from "react-router-dom";

export default function Sidebar({ onClose, isOpen }) {
  const [openMenus, setOpenMenus] = useState({});
  const navigate = useNavigate();

  const toggleMenu = (menuKey) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const handleHome = () => {
    onClose();
  }
    const handleDior = () => {
        navigate('/dior');
    };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <CloseIcon className="close-icon" onClick={onClose} />
      </div>
      <div className="sidebar-menu">
        <ul className="sidebar-list">
          <li className="sidebar-item">
            <Link to="/" className="sidebar-link">Home</Link>
          </li>

          {/* Dior */}
          <li className="sidebar-item has-submenu">
            <div className="sidebar-link" >
                <Link to="/dior" className="sidebar-link">Dior</Link>
            </div>
            <ul className={`submenu ${openMenus['dior'] ? 'open' : ''}`}>
              {/* Fragancias */}
              <li className="sidebar-subitem has-submenu">
                <div className="sidebar-link" onClick={() => toggleMenu('fragancias')}>
                  Fragancias
                </div>
                <ul className={`submenu ${openMenus['fragancias'] ? 'open' : ''}`}>
                  {/* Hombre */}
                  <li className="sidebar-subitem has-submenu">
                    <div className="sidebar-link" onClick={() => toggleMenu('hombre')}>
                        <Link to="/dior/men" className="subMenu-link" >Hombre</Link>
                    </div>
                  </li>
                  {/* Mujer */}
                  <li className="sidebar-subitem has-submenu">
                    <div className="sidebar-link" onClick={() => toggleMenu('mujer')}>
                      <Link to="/dior/women" className="subMenu-link" >Mujer</Link>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </li>

          <li className="sidebar-item">
            <Link to="/valentino" className="sidebar-link">Valentino</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
