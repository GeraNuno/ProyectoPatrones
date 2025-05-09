import React, { useState, useEffect} from 'react'

import Navbar from '../../componentes/navbar/Navbar'

export default function ListaProductos() {
    const [productosData, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([])

    const [nombresMarcas, setNombresMarcas] = useState([])

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
    }
    , []);

        useEffect(() => {
            const fetchNombresMarcas = async () => {
                try {
                    const response = await fetch('http://localhost:5000/marca/nombreMarcas')
                    const data = await response.json()
                    setNombresMarcas(data)
                } catch (error) {
                    console.error('Error fetching nombres de marcas:', error)
                }
            }
            fetchNombresMarcas()
        }
        , [productosData]);

    const filtrarPorMarca = async (e) => {
        const marca = e.target.value
        if (productosData.length > 0) {
            const productosFiltrados = productosData.filter((producto) => producto.nombreMarca === marca)
            setProductosFiltrados(productosFiltrados)
        }
        if (marca === '') {
            setProductosFiltrados(productosData)
        }
    }

  return (
    <div className="listaAdmin-container">
        <Navbar />
        <h1 className="listaAdmin-title">Lista de Productos</h1>
            <div className="filtrosAdmin-container">
                <div className="filtros-container">
                    <select className="filtros-select" onClick={filtrarPorMarca}>
                        <option value="">Todos</option>
                        {nombresMarcas.map((marca, index) => (
                        <option key={index} value={marca.nombreMarca}>{marca.nombreMarca}</option>
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
                        <th className="tableAdmin-header">Precio</th>
                        <th className="tableAdmin-header">Stock</th>
                        <th className="tableAdmin-header">Imagen Principal</th>
                        <th className="tableAdmin-header">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productosFiltrados.map((producto, index) => (
                        <tr key={index}>
                            <td className="tableAdmin-data producto">{producto.nombreProducto}</td>
                            <td className="tableAdmin-data">{producto.nombreMarca}</td>
                            <td className="tableAdmin-data">{producto.lineaProducto}</td>
                            <td className="tableAdmin-data precio">$ {producto.precioProducto}.00</td>
                            <td className="tableAdmin-data stock">{producto.stockProducto} pzs</td>
                            <td className="tableAdmin-data"><img src={producto.imagenesProducto[0]} alt={producto.nombreProducto} className="img-producto" /></td>
                            <td className="tableAdmin-data">
                                <button className="btn-editar">Editar</button>
                                { producto.stockProducto >= 10 ? (
                                    <button className="btn-desactivar">Desactivar</button>
                                ) : (
                                    <button className="btn-activar">Activar</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  )
}
