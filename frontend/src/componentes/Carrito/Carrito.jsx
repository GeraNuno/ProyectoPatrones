import React, { useState, useEffect } from 'react';
import './carrito.css';
import { useNavigate } from 'react-router-dom';

import CloseIcon from '@mui/icons-material/Close';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Carrito({ onClose, isOpen }) {
  const usuarioId = localStorage.getItem('userId');
  const [productos, setProductos] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState('');
  const navigate = useNavigate();

  const obtenerProductos = async () => {
    try {
      const res = await fetch(`http://localhost:5000/carrito/productos/${usuarioId}`);
      const data = await res.json();
      if (Array.isArray(data)) setProductos(data);

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

    setMensaje('Cantidad actualizada');
    setTipoMensaje('exito');
    setTimeout(() => setMensaje(''), 3000);
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

    setMensaje('Producto eliminado del carrito');
    setTipoMensaje('exito');
    setTimeout(() => setMensaje(''), 3000);

  } catch (err) {
    console.error('Error al eliminar producto:', err);
  }
};


  const total = productos.reduce(
    (acc, p) => acc + (p.precioProducto || 0) * (p.cantidad || 1),
    0
  );

  useEffect(() => {
    // No ejecutar si no hay usuarioId
    if (!usuarioId) return;

    const obtenerIdCarrito = async () => {
      try {
        const res = await fetch(`http://localhost:5000/carrito/obtenerIdCarrito/${usuarioId}`);
        
        if (!res.ok) {
          // Si la respuesta no es exitosa, simplemente salir sin lanzar error
          console.warn('La ruta no fue encontrada o el usuario no tiene carrito.');
          return;
        }

        const data = await res.json();
        if (data && data.idCarrito) {
          setIdCarrito(data.idCarrito);
        } else {
          console.warn('No se encontró el ID del carrito en la respuesta.');
        }
      } catch (err) {
        // Este catch se activa solo si falla la petición por red u otro error técnico
        console.warn('Error al obtener ID del carrito:', err.message);
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
      {mensaje && (
        <div className={`mensaje ${tipoMensaje}`}>
          {tipoMensaje === 'exito' ? (
            <p>{mensaje}</p>
          ) : (
            <p>Error: {mensaje}</p>
          )}
        </div>
      )}
    </div>
  );
}
