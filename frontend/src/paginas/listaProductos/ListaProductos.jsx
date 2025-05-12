import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../../componentes/navbar/navbar';

export default function ListaProductos() {
    const [productosData, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [nombresMarcas, setNombresMarcas] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductos = async () => {
            try {
                const response = await fetch('http://localhost:5000/producto/listaProductos');
                const data = await response.json();
                setProductosFiltrados(data);
                setProductos(data);
            } catch (error) {
                console.error('Error fetching productos:', error);
            }
        };
        fetchProductos();
    }, []);

    useEffect(() => {
        const fetchNombresMarcas = async () => {
            try {
                const response = await fetch('http://localhost:5000/marca/nombreMarcas');
                const data = await response.json();
                setNombresMarcas(data);
            } catch (error) {
                console.error('Error fetching nombres de marcas:', error);
            }
        };
        fetchNombresMarcas();
    }, [productosData]);

    const filtrarPorMarca = async (e) => {
        const marca = e.target.value;
        if (productosData.length > 0) {
            const productosFiltrados = productosData.filter((producto) => producto.nombreMarca === marca);
            setProductosFiltrados(productosFiltrados);
        }
        if (marca === '') {
            setProductosFiltrados(productosData);
        }
    };

    const handleEditarProducto = (e) => {
        const idProducto = e.target.closest('tr').getAttribute('data-id');
        const producto = productosFiltrados.find((producto) => producto._id === idProducto);
        
        // Obtener el índice de la presentación seleccionada
        const indexPresentacion = e.target.closest('tr').getAttribute('data-presentacion-index');
        
        // Obtener la presentación específica
        const presentacion = producto.presentaciones[indexPresentacion];

        // Guardar tanto el producto como la presentación seleccionada en localStorage
        localStorage.setItem('producto', JSON.stringify(producto));
        localStorage.setItem('presentacion', JSON.stringify(presentacion));

        // Redirigir a la página de edición
        navigate('/editarProducto');
    }


    return (
        <div className="listaAdmin-container">
            <Navbar />
            <h1 className="listaAdmin-title">Lista de Productos</h1>
            <div className="filtrosAdmin-container">
                <div className="filtros-container">
                    <select className="filtros-select" onChange={filtrarPorMarca}>
                        <option value="">Todos</option>
                        {nombresMarcas.map((marca, index) => (
                            <option key={index} value={marca.nombreMarca}>
                                {marca.nombreMarca}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="tableAdmin-wrapper">
                <table className="tableAdmin-grid">
                    <thead>
                        <tr>
                            <th className="tableAdmin-header">Producto</th>
                            <th className="tableAdmin-header">Marca</th>
                            <th className="tableAdmin-header">Linea</th>
                            <th className="tableAdmin-header">Presentación</th>
                            <th className="tableAdmin-header">Precio</th>
                            <th className="tableAdmin-header">Stock</th>
                            <th className="tableAdmin-header">Imágenes</th>
                            <th className="tableAdmin-header">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productosFiltrados.map((producto, index) => (
                            // Iterar sobre cada presentación
                            producto.presentaciones.map((presentacion, i) => (
                                <tr key={`${index}-${i}`} data-id={producto._id} data-presentacion-index={i}>
                                    <td className="tableAdmin-data producto">{producto.nombreProducto}</td>
                                    <td className="tableAdmin-data">{producto.nombreMarca}</td>
                                    <td className="tableAdmin-data">{producto.lineaProducto}</td>
                                    <td className="tableAdmin-data">{presentacion.mililitros} ml</td>
                                    <td className="tableAdmin-data precio">{`$${presentacion.precio}.00`}</td>
                                    <td className="tableAdmin-data stock">{`${presentacion.stockProducto} pzs`}</td>
                                    <td className="tableAdmin-data imagenes">
                                        {/* Mostrar imágenes de la presentación */}
                                        <img
                                            src={presentacion.imagenesProducto[0]}
                                            alt={`Imagen presentación ${i + 1}`}
                                            className="img-presentacion"
                                        />
                                    </td>
                                    <td className="tableAdmin-data">
                                        <button className="btn-editar" onClick={handleEditarProducto}>Editar</button>
                                        {presentacion.stockProducto >= 10 ? (
                                            <button className="btn-desactivar">Desactivar</button>
                                        ) : (
                                            <button className="btn-activar">Activar</button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
