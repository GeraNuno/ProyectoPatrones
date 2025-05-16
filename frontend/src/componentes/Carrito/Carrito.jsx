import React, { useState, useEffect } from 'react';
import './carrito.css';
import { useNavigate } from 'react-router-dom';

import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Carrito({ onClose, isOpen }) {
  const usuarioId = localStorage.getItem('userId');
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  const obtenerProductos = async () => {
    try {
      const res = await fetch(`http://localhost:5000/carrito/productos/${usuarioId}`);
      const data = await res.json();
      if (Array.isArray(data)) setProductos(data);

      console.log('Productos en el carrito:', data);
    } catch (err) {
      console.error('Error al obtener productos:', err);
    }
  };

  useEffect(() => {
    if (isOpen && usuarioId) obtenerProductos();
  }, [isOpen, usuarioId]);

const actualizarCantidad = async (idProducto, indexPresentacion, nuevaCantidad) => {
  try {
    await fetch(`http://localhost:5000/carrito/actualizar`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuarioId, idProducto, indexPresentacion, nuevaCantidad })
    });

    setProductos(prev =>
      prev.map(p =>
        p.idProducto === idProducto && p.indexPresentacion === indexPresentacion
          ? { ...p, cantidad: nuevaCantidad }
          : p
      )
    );
  } catch (err) {
    console.error('Error al actualizar cantidad:', err);
  }
};

const eliminarProducto = async (idProducto, indexPresentacion) => {
  try {
    await fetch(`http://localhost:5000/carrito/eliminar`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuarioId, idProducto, indexPresentacion })
    });

    setProductos(prev =>
      prev.filter(p => !(p.idProducto === idProducto && p.indexPresentacion === indexPresentacion))
    );
  } catch (err) {
    console.error('Error al eliminar producto:', err);
  }
};


  const total = productos.reduce(
    (acc, p) => acc + (p.precioProducto || 0) * (p.cantidad || 1),
    0
  );

  useEffect(() => {
    const obtenerIdCarrito = async () => {
      try {
        const res = await fetch(`http://localhost:5000/carrito/obtenerIdCarrito/${usuarioId}`);
        const data = await res.json();
        if (data && data.idCarrito) {
          setIdCarrito(data.idCarrito);
        }
      } catch (err) {
        console.error('Error al obtener ID del carrito:', err);
      }
    };
    obtenerIdCarrito();
  }, [usuarioId]);
  const [idCarrito, setIdCarrito] = useState(null);
    

  const handleConfirmarCompra = () => {
    if (productos.length > 0) {
      navigate(`/confirmarCompra/${idCarrito}`);
    } else {
      alert('No hay productos en el carrito');
    }
  }



  return (
    <div className={`carrito ${isOpen ? 'open' : ''}`}>
      <div className="carritoHeader">
        <ShoppingCartIcon className="carritoIcono" />
        <h2>Productos en el carrito</h2>
        <CloseIcon className="cerrarCarrito" onClick={onClose} />
      </div>

      <div className="carrito-container">
        <div className="carrito-productos">
          {productos.length === 0 && (
            <p className="carrito-vacio">Tu carrito está vacío.</p>
          )}

          {productos.map((producto, index) => (
            <div className="carrito-producto" key={index}>
              <img
                src={producto.imagenProducto}
                alt={producto.nombreProducto}
                className="imgCarrito"
              />
              <div className="carrito-info">
                <b>{producto.nombreProducto}</b>
                {producto.mililitros} ml
                <DeleteIcon
                  className="eliminarProducto"
                  onClick={() => eliminarProducto(producto.idProducto, producto.indexPresentacion)}
                />
              </div>
              <div className="carrito-cantidad">
                <p>${producto.precioProducto}</p>
                <select
                  value={producto.cantidad || 1}
                  onChange={(e) =>
                    actualizarCantidad(
                      producto.idProducto,
                      producto.indexPresentacion,
                      parseInt(e.target.value)
                    )
                  }
                  >
                  {[...Array(5).keys()].map(i => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>

        <div className="carrito-resumen">
          <div className="carrito-total">
            <h3>Total:</h3>
            <p>${total.toFixed(2)}</p>
          </div>
          <div className="carritoBotones">
            <button className="realizaPedido" onClick={handleConfirmarCompra}>CONFIRMAR COMPRA</button>
          </div>
        </div>
      </div>
    </div>
  );
}
