import React, { useState, useEffect } from 'react'
import Navbar from '../../componentes/Navbar/navbar'



export default function ListaPedidos() {
    const [pedidos, setPedidos] = useState([]);

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await fetch('http://localhost:5000/pedido/pedidosAdmin');
                const data = await response.json();
                setPedidos(data);
            } catch (error) {
                console.error('Error fetching pedidos:', error);
            }
        };

        fetchPedidos();
    }, []);

    const handleActualizarEstado = async (pedidoId, nuevoEstado) => {
        console.log('Actualizar estado de pedido:', pedidoId, 'Nuevo estado:', nuevoEstado);
        try {
            const response = await fetch(`http://localhost:5000/pedido/actualizarEstado/${pedidoId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ estado: nuevoEstado }),
            });

            if (response.ok) {
                const updatedPedido = await response.json();
                setPedidos((prevPedidos) =>
                    prevPedidos.map((pedido) =>
                        pedido._id === pedidoId ? updatedPedido : pedido
                    )
                );

                window.location.reload();
            } else {
                console.error('Error al actualizar el estado del pedido');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
  return (
    <div className="listaAdmin-container">
        <Navbar />
        <h1 className="listaAdmin-title">Lista de Pedidos</h1>
        <div className="tableAdmin-wrapper">
            <table className="tableAdmin-grid">
                <thead>
                    <tr>
                        <th className="tableAdmin-header">cliente</th>
                        <th className="tableAdmin-header">Estado</th>
                        <th className="tableAdmin-header">Total</th>
                        <th className="tableAdmin-header">Fecha</th>
                        <th className="tableAdmin-header">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidos.map((pedido) => (
                        <tr key={pedido._id}>
                            <td className="tableAdmin-data estatus">{pedido.usuario.nombre}</td>
                            <td className="tableAdmin-data estatus">{pedido.estadoPedido}</td>
                            <td className="tableAdmin-data estatus">${pedido.total}.00</td>
                            <td className="tableAdmin-data estatus">{new Date(pedido.createdAt).toLocaleDateString()}</td>
                            <td className="tableAdmin-data estatus">
                                {
                                    pedido.estadoPedido === 'Pendiente' ? ( 
                                    <>
                                        <button 
                                            className='btn-editar' 
                                            onClick={() => handleActualizarEstado(pedido._id, 'Aceptado')}
                                            >
                                            Aceptar Pedido
                                        </button>
                                        <button 
                                            className='btn-desactivar' 
                                            onClick={() => handleActualizarEstado(pedido._id, 'Cancelado')}
                                            >
                                            Cancelar Pedido
                                        </button>
                                    </>
                                    ) : pedido.estadoPedido === 'Aceptado' ? (
                                        <button 
                                            className='btn-editar' 
                                            onClick={() => handleActualizarEstado(pedido._id, 'Entregado')}
                                            >
                                            Entregar Pedido
                                        </button>
                                    ) : pedido.estadoPedido === 'Entregado' ? (
                                        <button className='btn-editar' disabled>Pedido Entregado</button>
                                    ) : (
                                        <button className='btn-editar' disabled>Pedido Cancelado</button>
                                    )
                                }        
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}
