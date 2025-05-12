import React, { useState, useEffect } from 'react';
import './GaleriaModal.css';

export default function GaleriaModal({ imagenes, onClose }) {
  const [animationClass, setAnimationClass] = useState('fade-in');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [direction, setDirection] = useState(null); // 'left' or 'right'

  const handleClose = () => {
    setAnimationClass('fade-out');
  };

  useEffect(() => {
    if (animationClass === 'fade-out') {
      const timeout = setTimeout(() => {
        onClose();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [animationClass, onClose]);

  const cambiarImagen = (dir) => {
    setPrevIndex(currentIndex);
    setDirection(dir);

    setCurrentIndex((prev) => {
      const newIndex = dir === 'left'
        ? (prev - 1 + imagenes.length) % imagenes.length
        : (prev + 1) % imagenes.length;
      return newIndex;
    });
  };

  return (
    <div className={`modal-overlay ${animationClass}`} onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="cerrar-modal" onClick={handleClose}>✖</button>
        <div className="galeria-navegacion">
          <button className="btn-nav" onClick={() => cambiarImagen('left')}>◀</button>
          <div className="imagen-transicion-container">
            {prevIndex !== null && (
              <img
                src={imagenes[prevIndex]}
                key={`prev-${prevIndex}`}
                className={`modal-img exit-${direction}`}
              />
            )}
            <img
              src={imagenes[currentIndex]}
              key={`current-${currentIndex}`}
              className={`modal-img enter-${direction}`}
              onAnimationEnd={() => setPrevIndex(null)} // limpia después de la animación
            />
          </div>
          <button className="btn-nav" onClick={() => cambiarImagen('right')}>▶</button>
        </div>
      </div>
    </div>
  );
}
