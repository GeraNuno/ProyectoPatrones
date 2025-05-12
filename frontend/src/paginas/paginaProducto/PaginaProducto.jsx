import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './paginaProducto.css';

import Navbar from '../../componentes/navbar/navbar';
import GaleriaModal from '../../componentes/GaleriaModal/GaleriaModal';

export default function PaginaProducto() {
    const userId = localStorage.getItem('userId');
    const datosMarca = JSON.parse(localStorage.getItem('marcas')) || [];
    const marca = datosMarca.length > 0 ? datosMarca[0] : null;
    const [indiceSeleccionado, setIndiceSeleccionado] = useState(0);

    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('');

    const { idProducto } = useParams();
    const [producto, setProducto] = useState(null);
    const [presentacionSeleccionada, setPresentacionSeleccionada] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);
    const navigate = useNavigate();

    const [datosProductoAgregar, setDatosProductoAgregar] = useState({
        idProducto: '',
        nombreProducto: '',
        imagenProducto: '',
        mililitros: '',
        precioProducto: '',
        cantidad: 1,
    });

    // Obtener el producto desde la API
    useEffect(() => {
        const obtenerProducto = async () => {
            try {
                const response = await fetch(`http://localhost:5000/producto/productos/${idProducto}`);
                const data = await response.json();
                setProducto(data);
                if (data.presentaciones && data.presentaciones.length > 0) {
                    const presentacionInicial = data.presentaciones[1];
                    setPresentacionSeleccionada(presentacionInicial);
                    setDatosProductoAgregar({
                        idProducto,
                        nombreProducto: data.nombreProducto,
                        imagenProducto: presentacionInicial.imagenesProducto[0],
                        mililitros: presentacionInicial.mililitros,
                        precioProducto: presentacionInicial.precio,
                        cantidad: 1,
                    });
                }
            } catch (error) {
                console.error('Error al obtener el producto:', error);
            }
        };
        obtenerProducto();
    }, [idProducto]);

    const handleMarcaHome = () => {
        if (producto?.nombreMarca) {
            navigate(`/marca/${producto.nombreMarca}`);
        }
    };

    const handleAgregarAlCarrito = () => {
        fetch('http://localhost:5000/carrito/agregar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                usuarioId: userId,
                producto: datosProductoAgregar
            }),
        })
        .then(res => res.json())
        .then(data => {
            console.log('Producto agregado:', data);
            setMensaje('Producto agregado al carrito');
            setTipoMensaje('exito');
            setTimeout(() => setMensaje(''), 3000);
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
        const nuevosDatos = {
            idProducto,
            nombreProducto: producto.nombreProducto,
            imagenProducto: presentacion.imagenesProducto[0],
            mililitros: presentacion.mililitros,
            precioProducto: presentacion.precio,
            cantidad: 1,
        };
        setDatosProductoAgregar(nuevosDatos);
        console.log('Datos del producto a agregar:', nuevosDatos);
    };

    return (
        <div className="paginaProductos-container">
            <Navbar />

            {producto && presentacionSeleccionada ? (
                <div className="paginaProductos-content">
                    <div className="container-imagenes" onClick={() => setMostrarModal(true)}>
                        <div className="imagen-principal">
                            <img
                                src={presentacionSeleccionada.imagenesProducto[0]}
                                alt={producto.nombreProducto}
                                className="imgPrincipal"
                            />
                        </div>
                        <div className="imagenes-secundarias">
                            {presentacionSeleccionada.imagenesProducto.slice(1).map((imagen, index) => (
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
