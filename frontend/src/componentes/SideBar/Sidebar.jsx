import React, { useState, useEffect } from 'react';
import './sidebar.css';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';

export default function Sidebar({ onClose, isOpen }) {
  const rolUsuario = localStorage.getItem('rolUsuario');
  const [marcasData, setMarcas] = useState([]);

  useEffect(() => {
    if(rolUsuario !== 'admin') {
      const storedMarcas = localStorage.getItem('marcas');
      
      if (storedMarcas) {
        // Si ya están guardadas, solo las carga
        setMarcas(JSON.parse(storedMarcas));
      } else {
        // Si no hay datos guardados, los solicita y guarda
        const fetchMarcas = async () => {
          try {
            const response = await fetch('http://localhost:5000/marca/listaMarcas');
            const data = await response.json();
            setMarcas(data);
            localStorage.setItem('marcas', JSON.stringify(data));
          } catch (error) {
            console.error('Error fetching marcas:', error);
          }
        };
        fetchMarcas();
      }
    }
  }, []);

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <CloseIcon className="close-icon" onClick={onClose} />
      </div>
      <div className="sidebar-menu">
        <ul className="sidebar-list">
          <li className="sidebar-item">
            <Link to="/" onClick={onClose} className="sidebar-link">Home</Link>
          </li>
          { rolUsuario === 'admin' ? (
            <>
              <li className="sidebar-item">
                <Link onClick={onClose} to="/registroMarca" className="sidebar-link">NUEVA MARCA</Link>
              </li>
              <li className="sidebar-item">
                <Link onClick={onClose} to="/listaMarcas" className="sidebar-link">Lista Marcas</Link>
              </li>
              <li className="sidebar-item">
                <Link onClick={onClose} to="/registroLinea" className="sidebar-link">NUEVA LINEA</Link>
              </li>
              <li className="sidebar-item">
                <Link onClick={onClose} to="/registroProducto" className="sidebar-link">NUEVA FRAGANCIA</Link>
              </li>
            </>  
          ) : 
          <>
            {marcasData.map((marca) => (
              <li className="sidebar-item" key={marca._id}>
                <Link onClick={onClose} to={`/marca/${marca.nombreMarca}`} className="sidebar-link">{marca.nombreMarca}</Link>
              </li>
            ))}
          </>}
        </ul>
      </div>
    </div>
  );
}
