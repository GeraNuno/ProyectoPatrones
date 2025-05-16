import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './paginaProducto.css';

import Navbar from '../../componentes/navbar/navbar';
import GaleriaModal from '../../componentes/GaleriaModal/GaleriaModal';

export default function PaginaProducto() {
    const userId = localStorage.getItem('userId');
    const [indiceSeleccionado, setIndiceSeleccionado] = useState(0);

    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('');

    const { idProducto } = useParams();
    const [producto, setProducto] = useState(null);
    const [presentacionSeleccionada, setPresentacionSeleccionada] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    const [datosProductoAgregar, setDatosProductoAgregar] = useState({
        idProducto: '',
        indexPresentacion: 0,
        cantidad: 1,
    });

    useEffect(() => {
        const obtenerProducto = async () => {
            try {
                const response = await fetch(`http://localhost:5000/producto/productos/${idProducto}`);
                const data = await response.json();
                setProducto(data);

                if (data.presentaciones && data.presentaciones.length > 0) {
                    const presentacionInicial = data.presentaciones.length > 1
                        ? data.presentaciones[1]
                        : data.presentaciones[0];

                    setPresentacionSeleccionada(presentacionInicial);

                    setDatosProductoAgregar({
                        idProducto: data._id,
                        indexPresentacion: data.presentaciones.length >= 1 ? 1 : 0,
                        cantidad: 1,
                    });
                }
            } catch (error) {
                console.error('Error al obtener el producto:', error);
            }
        };

        obtenerProducto();
    }, [idProducto]);

    const handleAgregarAlCarrito = () => {
        console.log('Datos a agregar:', datosProductoAgregar);
        fetch('http://localhost:5000/carrito/agregar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuarioId: userId,
                producto: datosProductoAgregar, // contiene solo idProducto, tipoPresentacion, cantidad
            }),
        })
            .then(res => res.json())
            .then(data => {
                console.log('Producto agregado:', data);
                setMensaje('Producto agregado al carrito');
                setTipoMensaje('exito');
                setTimeout(() => setMensaje(''), 3000);

                setDatosProductoAgregar({
                    idProducto: '',
                    indexPresentacion: 0,
                    cantidad: 1,
                });
            })
            .catch(err => {
                console.error('Error al agregar:', err);
                setMensaje('Error al agregar');
                setTipoMensaje('error');
                setTimeout(() => setMensaje(''), 3000);
            });
    };

    const handleSeleccionarPresentacion = (index) => {
        const presentacion = producto.presentaciones[index];
        setIndiceSeleccionado(index);
        setPresentacionSeleccionada(presentacion);

        setDatosProductoAgregar({
            idProducto,
            indexPresentacion: index,
            cantidad: 1,
        });
    };

    return (
        <div className="paginaProductos-container">
            <Navbar />

            {producto && presentacionSeleccionada ? (
                <div className="paginaProductos-content">
                    <div className="container-imagenes" onClick={() => setMostrarModal(true)}>
                        <div className="imagen-principal">
                            <img
                                src={presentacionSeleccionada.imagenesProducto?.[0] || ''}
                                alt={producto.nombreProducto}
                                className="imgPrincipal"
                            />
                        </div>
                        <div className="imagenes-secundarias">
                            {(presentacionSeleccionada.imagenesProducto || []).slice(1).map((imagen, index) => (
                                <div key={index} className="imagen-secundaria">
                                    <img
                                        src={imagen}
                                        alt={`${producto.nombreProducto} ${index + 1}`}
                                        className="imgSecundaria"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="container-informacion">
                        <h1 className="nombreProducto">{producto.nombreProducto}</h1>

                        <div className="presentaciones">
                            <div className="botones-presentaciones">
                                {producto.presentaciones.map((presentacion, index) => (
                                    <button
                                        key={index}
                                        className={`boton-presentacion ${index === indiceSeleccionado ? 'seleccionado' : ''}`}
                                        onClick={() => handleSeleccionarPresentacion(index)}
                                    >
                                        {presentacion.mililitros} ml
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button className="agregarAlCarrito" onClick={handleAgregarAlCarrito}>
                            <p>Agregar al carrito</p>
                            <p className="precioProducto">MEX ${presentacionSeleccionada.precio}.00</p>
                        </button>
                    </div>
                </div>
            ) : (
                <p>Cargando producto...</p>
            )}

            {mostrarModal && (
                <GaleriaModal
                    imagenes={presentacionSeleccionada?.imagenesProducto || []}
                    onClose={() => setMostrarModal(false)}
                />
            )}

            {mensaje && (
                <div className={`mensaje ${tipoMensaje}`}>
                    {mensaje}
                </div>
            )}
        </div>
    );
}
