import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import './confirmarCompra.css'

export default function ConfirmarCompra() {
    const { idCarrito } = useParams();
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('');

    const [datosCarrito, setDatosCarrito] = useState([]);
    const [datosDireccion, setDatosDireccion] = useState({
        direccion: '',
        colonia: '',
        ciudad: '',
        estado: '',
        telefono: ''
    });

    const navigate = useNavigate();

    const handleRegresar = () => {
        navigate(-1);
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDatosDireccion({
            ...datosDireccion,
            [name]: value
        });
    }

    useEffect(() => {
        const obtenerCarrito = async () => {
            try {
                const response = await fetch(`http://localhost:5000/carrito/datosCarrito/${idCarrito}`);
                const data = await response.json();
                console.log('Datos del carrito:', data);
                if (data) {
                    setDatosCarrito(data);
                    setMensaje('Carrito obtenido con éxito');
                    setTipoMensaje('exito');
                    
                    setTimeout(() => {
                        setMensaje('');
                    }, 3000);
                }
                else {
                    setMensaje('Error al obtener el carrito');
                    setTipoMensaje('error');
                    setTimeout(() => {
                        setMensaje('');
                    }, 3000);
                }
            } catch (error) {
                console.error('Error al obtener el carrito:', error);
            }
        };
        obtenerCarrito();
    }, [idCarrito]);

    const handleConfirmarCompra = async () => {
        try {
            const response = await fetch(`http://localhost:5000/pedido/crearPedido/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    usuarioId: localStorage.getItem('userId'),
                    direccionEnvio: datosDireccion,
                    telefono: datosDireccion.telefono,
                    total: total
                })
            });

            if (response.ok) {
                setMensaje('Compra confirmada con éxito');
                setTipoMensaje('exito');
                setTimeout(() => {
                    navigate('/');
                }, 3000);
            } else {
                setMensaje('Error al confirmar la compra');
                setTipoMensaje('error');
                setTimeout(() => {
                    setMensaje('');
                    navigate(-1);
                }, 3000);
            }
        } catch (error) {
            console.error('Error al confirmar la compra:', error);
            setMensaje('Error al confirmar la compra');
            setTipoMensaje('error');
        }
    }

    const total = datosCarrito.reduce((acc, producto) => acc + (producto.precioProducto * producto.cantidad), 0);
  return (
    <div className='confirmarCompra-container'>
        <div className="formularioDireccion-container">
            <form className="formularioDireccion">
                <div className="formHeadder">
                    <div className="header-center">
                        <h1>Confirmar Compra</h1>
                        <p>Por favor, verifica que los datos de envío sean correctos antes de confirmar tu compra.</p>
                    </div>
                    <div className="headder-right">
                        <button type='button' className='btnRegresar' onClick={handleRegresar}>X</button>
                    </div>
                </div>
                
                <div className="formBody">
                    <div className="datosCarrito">
                        {datosCarrito.map((producto, index) => (
                        <div key={index} className="productoCarrito">
                            <img src={producto.imagenProducto} alt={producto.nombreProducto} className="imgProductoCompra"/>
                            <div className="productoDetalles">
                                <div className="datosIzq">
                                    <h3>{producto.nombreProducto}</h3>
                                    <p>Presentación: {producto.mililitros} mL</p>
                                    <p>Precio unitario: ${producto.precioProducto}.00</p>
                                </div>
                                <div className="datosDer">
                                    <p>Cantidad: {producto.cantidad}</p> 
                                    <p>Subtotal: ${producto.precioProducto * producto.cantidad}.00</p> 
                                </div>
                            </div>
                        </div>
                        ))}
                    </div>

                    <div className="datosDireccion">
                        <h2 className='titulo'>Datos de Envío</h2>
                        <input 
                            type="text" 
                            id="direccion" 
                            name="direccion"  
                            placeholder='Dirección'
                            value={datosDireccion.direccion}
                            onChange={handleInputChange}
                            required />
                        <input 
                            type="text" 
                            id="colonia" 
                            name="colonia" 
                            placeholder='Colonia'
                            value={datosDireccion.colonia}
                            onChange={handleInputChange}
                            required />
                        <input 
                            type="text" 
                            id="ciudad" 
                            name="ciudad" 
                            placeholder='Ciudad'
                            value={datosDireccion.ciudad}
                            onChange={handleInputChange}
                            required />
                        <input 
                            type="text" 
                            id="estado" 
                            name="estado" 
                            placeholder='Estado'
                            value={datosDireccion.estado}
                            onChange={handleInputChange}
                            required />
                        <input 
                            type="tel" 
                            id="telefono" 
                            name="telefono" 
                            placeholder='Teléfono'
                            value={datosDireccion.telefono}
                            onChange={handleInputChange}
                            pattern="[0-9]{10}"
                            required />
                    </div>
                </div>

                <div className="formBottom">
                    <div className="datosVenta">
                        <h2 className='titulo'>Datos de Venta</h2>
                        <p>Total: ${total}.00</p>
                        <p>Fecha de compra: {new Date().toLocaleDateString()}</p>
                    </div>
                    <div className="botones">
                        <button type='button' className='btnConfirmarCompra' onClick={handleConfirmarCompra}>Confirmar Compra</button>
                    </div>
                </div>
            </form>
        </div>
        {mensaje && (
            <div className={`mensaje ${tipoMensaje}`}>
                {mensaje}
            </div>
        )}
    </div>
  )
}
