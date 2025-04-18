import React from 'react';
import './sidebar.css';
import CloseIcon from '@mui/icons-material/Close';

//Rutas para otras páginas

export default function Sidebar({ onClose, isOpen }) {
  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar__header">
        <CloseIcon className="close-icon" onClick={onClose} />
      </div>
      <div className="sidebar__menu">
        
      </div>
    </div>
  );
}
