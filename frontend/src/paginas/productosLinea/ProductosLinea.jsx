import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './productosLinea.css'

import Navbar from '../../componentes/navbar/navbar'
import { useNavigate } from 'react-router-dom';

export default function ProductosLinea() {
    const navigate = useNavigate();
    const { nombreMarca, nombreLinea } = useParams();
    const [datosProductos, setDatosProductos] = useState([]);

    const [imagenBanner, setImagenBanner] = useState('');

    const handleMarcaHome = () => {
        navigate(`/marca/${nombreMarca}`);
    }

    useEffect(() => {
        const obtenerImagen = async () => {
            try{
                const response = await fetch(`http://localhost:5000/linea/lineas/${nombreLinea}`);
                const data = await response.json();
                if (data) {
                    setImagenBanner(data.imgBanner);
                }
            }
            catch (error) {
                console.error('Error al obtener la imagen:', error);
            }
        }
        obtenerImagen();
    }
    , [nombreLinea]);

    useEffect(() => {
        const obtenerProductos = async () => {
            try{
                const response = await fetch(`http://localhost:5000/producto/productosCliente/${nombreLinea}`);
                const data = await response.json();
                setDatosProductos(data);
            }
            catch (error) {
                console.error('Error al obtener los productos:', error);
            }
        }
        obtenerProductos();
    }
    , [nombreLinea]);
  return (
    <div className='productosLinea-container'>
        <Navbar />
        <div className="productosLinea-header">
            <img src={imagenBanner} className='img-MarcaBanner' />
        </div>
        <div className="productosLinea-opciones">
            {/* Aquí puedes mapear los productos de la línea */}
            {/* Ejemplo: */}
             {datosProductos.map((producto) => (
                <div className="productosLinea-item" key={producto._id}>
                    <div className="datosProducto">
                        <img className="img-Producto" src={producto.imagenesProducto[0]} alt={producto.nombreProducto} />
                        <div>{producto.nombreProducto}</div>
                    </div>
                </div>
            ))} 
        </div>
    </div>
  )
}
