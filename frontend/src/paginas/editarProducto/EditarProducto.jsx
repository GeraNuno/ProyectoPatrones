import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './editarProducto.css';

import Navbar from '../../componentes/navbar/navbar';

export default function EditarProducto() {
    const [producto, setProducto] = useState(null);
    const [presentacion, setPresentacion] = useState(null);
    const navigate = useNavigate();

    const [mensaje, setMensaje] = useState('')
    const [tipoMensaje, setTipoMensaje] = useState('')

    useEffect(() => {
        // Obtener el producto y la presentación desde el localStorage
        const productoData = JSON.parse(localStorage.getItem('producto'));
        const presentacionData = JSON.parse(localStorage.getItem('presentacion'));

        if (productoData && presentacionData) {
            setProducto(productoData);
            setPresentacion(presentacionData);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const idProducto = producto._id;
        const idPresentacion = presentacion._id;
        const data = {
                idProducto,
                idPresentacion,
                precio: parseFloat(presentacion.precio),
                stockProducto: parseInt(presentacion.stockProducto, 10)
            };
        try {
           const response = await fetch('http://localhost:5000/producto/actualizarPresentacion', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (response.ok) {
                setMensaje('Presentación actualizada con éxito');
                setTipoMensaje('exito');
                setTimeout(() => {
                    setMensaje("");
                    navigate('/listaProductos');
                }, 3000);
            } else {
                setMensaje('Error al actualizar la presentación');
                setTipoMensaje('error');
                setTimeout(() => {
                    setMensaje("");
                    navigate('/listaProductos');
                }, 3000);
            }
        }
        catch (error) {
            console.error('Error al actualizar la presentación:', error);
            alert('Error en el servidor');
        }
    };

    if (!producto || !presentacion) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="editarProducto-container">
            <Navbar />
            <form onSubmit={handleSubmit} className="editarProducto-form">
                <div className="form-header">
                    <h2>Editar Producto: {producto.nombreProducto}</h2>
                    <button type="button" onClick={() => navigate(-1)}>X</button>
                </div>

                <div className="form-group">
                    <div className="imagenProducto-container">
                        <img src={presentacion.imagenesProducto[0]} alt="Imagen de presentación" className='imagenProducto'/>
                    </div>
                    <div className="datosProducto-container">    
                        <div>
                            <label>Mililitros</label>
                            <input
                                type="text"
                                placeholder={presentacion.mililitros + " ml"}
                                
                                disabled
                            />
                        </div>
                        <div>
                            <label>Precio</label>
                            <input
                                type="number"
                                value={presentacion.precio}
                                onChange={(e) => setPresentacion({ ...presentacion, precio: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Stock</label>
                            <input
                                type="number"
                                value={presentacion.stockProducto}
                                onChange={(e) => setPresentacion({ ...presentacion, stockProducto: e.target.value })}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-bottom">
                    <button type="submit">Guardar Cambios</button>
                </div>
            </form>
            {mensaje && (
                <div className={`mensaje ${tipoMensaje}`}>
                    {mensaje}
                </div>
            )}
        </div>
    );
}
