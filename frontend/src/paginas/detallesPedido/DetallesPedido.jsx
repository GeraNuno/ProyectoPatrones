import React, { useState, useEffect } from 'react'
import './detallesPedido.css'

import Navbar from '../../componentes/navbar/navbar';

import { useParams, useNavigate } from 'react-router-dom'

export default function DetallesPedido() {
    const nombreUsuario = localStorage.getItem('nombreUsuario');
    const { pedidoId  } = useParams();
    const [datosPedido, setDatosPedido] = useState(null);

    let fechaPedido = new Date().toLocaleDateString();

    const navigate = useNavigate();

    useEffect(() => {
        const fetchPedido = async () => {
            try {
                const response = await fetch(`http://localhost:5000/pedido/detallesPedido/${pedidoId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setDatosPedido(data);
                    fechaPedido = new Date(data.createdAt).toLocaleDateString();  
                } else {
                    console.error('Error al obtener los detalles del pedido');
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchPedido();
    }, [pedidoId ]);

  return (
    <div className='detallesPedido'>
        <Navbar />
        {datosPedido ? (
            <div className="detallesPedido-container">
                <div className="detallesHeadder">
                    <h1>DETALLES DEL PEDIDO</h1>
                    <button className='btnVolver' onClick={() => navigate(-1)}>X</button>
                </div>

                <div className="detallesInfo">
                    <div className="detallesIzq">
                        <h3>INFORMACION DEL PEDIDO</h3>

                        <input type="text" value={"Pedido de: " + nombreUsuario} disabled/>
                        
                        <input type="text" value={"Fecha: " + fechaPedido} disabled/>
                        
                        <input type="text" value={"Direccion de envio: " + datosPedido.direccionEnvio.direccion} disabled/>
                        
                        <input type="text" value={"Ciudad: " + datosPedido.direccionEnvio.ciudad} disabled/>
                        
                        <input type="text" value={"Estado: " + datosPedido.direccionEnvio.estado} disabled/>
                        
                        <input type="text" value={"Telefono: " + datosPedido.telefono} disabled/>
                        
                        <input type="text" value={"Estado del pedido: " + datosPedido.estadoPedido} disabled/>
                        
                        <input type="text" value={"Total: $" + datosPedido.total + ".00"} disabled/>

                    </div>
                    <div className="detallesDer">
                        <h3>PRODUCTOS</h3>
                        <div className="detallesPedido-productos">
                            {datosPedido.productos.map((datos, index) => (
                                <div key={index} className="productoDetalles">
                                    <img src={datos.producto.imagen} alt={datos.producto.nombre} className="imgProducto" />
                                    <div className="detallesProducto">
                                        <h4>{datos.producto.nombre}</h4>
                                        <p>Precio: ${datos.producto.precio}</p>
                                        <p>Cantidad: {datos.cantidad}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <p>Cargando detalles del pedido...</p>
        )}
    </div>
  )
}
