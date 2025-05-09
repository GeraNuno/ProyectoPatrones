import React, { useState, useEffect } from 'react'
import '../listaMarcas/ListaMarcas.css'
import Navbar from '../../componentes/navbar/navbar'

export default function ListaLineas() {
    const [nombresMarcas, setNombresMarcas] = useState([])
    const [lineasData, setLineas] = useState([]);
    const [lineasFiltradas, setLineasFiltradas] = useState([])

    useEffect(() => {
        const fetchLineas = async () => {
            try {
                const response = await fetch('http://localhost:5000/linea/listaLineas');
                const data = await response.json();
                setLineas(data);
                setLineasFiltradas(data)
            } catch (error) {
                console.error('Error fetching lineas:', error);
            }
        };
        fetchLineas();
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
    , [lineasData]);

    const filtrarPorMarca = async (e) => {
        const marca = e.target.value
        if (lineasData.length > 0) {
            const lineasFiltradas = lineasData.filter((linea) => linea.nombreMarca === marca)
            setLineasFiltradas(lineasFiltradas)
        }
        if (marca === '') {
            setLineasFiltradas(lineasData)
        }
    }

  return (
    <div className="listaAdmin-container">
        <Navbar />
        <h1 className="listaAdmin-title">Lista de Lineas</h1>
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
                        <th className="tableAdmin-header">Linea</th>
                        <th className="tableAdmin-header">Marca</th>
                        <th className="tableAdmin-header">Imagen</th>
                        <th className="tableAdmin-header">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {lineasFiltradas.map((linea, index) => (
                        <tr key={index}>
                            <td className="tableAdmin-data estatus">{linea.nombreLinea}</td>
                            <td className="tableAdmin-data estatus">{linea.nombreMarca}</td>
                            <td className="tableAdmin-data"><img src={linea.imgBanner} alt={linea.nombreLinea} className="img-linea" /></td>
                            <td className="tableAdmin-data">
                                <button className="btn-editar">Editar</button>
                                { linea.estatus === 'ACTIVO' ? (
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
