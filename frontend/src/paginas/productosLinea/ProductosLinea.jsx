import React, { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './productosLinea.css'
import Navbar from '../../componentes/navbar/navbar'

export default function ProductosLinea() {
    const token = localStorage.getItem('token');
    const datosMarca = JSON.parse(localStorage.getItem('marcas')) || [];
    const marca = datosMarca.find((marca) => marca.nombreMarca === datosMarca[0]?.nombreMarca);
    
    const carruselRef = useRef(null);
    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState('');
    const [imagenBanner, setImagenBanner] = useState('');
    const [datosProductos, setDatosProductos] = useState([]);
    const { nombreMarca, nombreLinea } = useParams();
    const navigate = useNavigate();

    const scroll = (direccion) => {
        if (carruselRef.current) {
            carruselRef.current.scrollBy({
                left: direccion === 'izquierda' ? -300 : 300,
                behavior: 'smooth'
            });
        }
    };

    const handleMarcaHome = () => {
        navigate(`/marca/${nombreMarca}`);
    }

    useEffect(() => {
        const obtenerImagen = async () => {
            try {
                const response = await fetch(`http://localhost:5000/linea/lineas/${nombreLinea}`);
                const data = await response.json();
                if (data) {
                    setImagenBanner(data.imgBanner);
                }
            } catch (error) {
                console.error('Error al obtener la imagen:', error);
            }
        };
        obtenerImagen();
    }, [nombreLinea]);

    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                const response = await fetch(`http://localhost:5000/producto/productosCliente/${nombreLinea}`);
                const data = await response.json();
                setDatosProductos(data);
                console.log(data);
            } catch (error) {
                console.error('Error al obtener los productos:', error);
            }
        };
        obtenerProductos();
    }, [nombreLinea]);

    const handleVerProducto = (productoId) => {
        if (token)
            navigate(`/producto/${productoId}`);
        else {
            setMensaje('Debes iniciar sesión para ver el producto');
            setTipoMensaje('error');
            setTimeout(() => {
                setMensaje('');
                navigate('/login');
            }, 3000);
        }
    };

    return (
        <div className='productosLinea-container'>
            <Navbar />
            <div className="productosLinea-header">
                <img src={marca?.imgMarca} className='img-Marca handle' onClick={handleMarcaHome} />
                {imagenBanner && (
                    <img src={imagenBanner} className="img-MarcaBanner" />
                )}
            </div>

            <div className="productosLinea-opciones">
                <button className="btn-flecha izquierda" onClick={() => scroll('izquierda')}>◀</button>

                <div className="carrusel-contenedor" ref={carruselRef}>
                    {datosProductos.map((producto) => {
                        const presentaciones = producto.presentaciones || [];
                        const presentacion = presentaciones.length > 1 ? presentaciones[1] : presentaciones[0];
                        const imagen = presentacion?.imagenesProducto?.[0];

                        return (
                            <div className="productosLinea-items" key={producto._id}>
                                <div className="datosProductos">
                                    {imagen ? (
                                        <img className="img-Producto" src={imagen} alt={producto.nombreProducto} />
                                    ) : (
                                        <div className="img-Producto img-placeholder">Sin imagen</div>
                                    )}
                                    <div className='datosInformativos'>
                                        <p>{producto.nombreProducto}</p>
                                        {presentacion ? (
                                            <div>
                                                <p className='tamanoProducto'>{presentacion.mililitros} mL</p>
                                                <p className='precioProducto'>${presentacion.precio}.00</p>
                                            </div>
                                        ) : (
                                            <p className="info-incompleta">Presentación no disponible</p>
                                        )}
                                        <button
                                            className='btnVerProducto'
                                            onClick={() => handleVerProducto(producto._id)}
                                        >
                                            Ver Producto
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button className="btn-flecha derecha" onClick={() => scroll('derecha')}>▶</button>
            </div>

            {mensaje && (
                <div className={`mensaje ${tipoMensaje}`}>
                    {mensaje}
                </div>
            )}
        </div>
    );
}
