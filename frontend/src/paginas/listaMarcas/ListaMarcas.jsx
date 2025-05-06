import React, { useState, useEffect } from 'react'
import './listaMarcas.css'

import Navbar from '../../componentes/navbar/Navbar'

export default function ListaMarcas() {
    const [marcasData, setMarcas] = useState([]);

    useEffect(() => {
        const fetchMarcas = async () => {
            try {
                const response = await fetch('http://localhost:5000/marca/listaMarcas');
                const data = await response.json();
                setMarcas(data);
            } catch (error) {
                console.error('Error fetching marcas:', error);
            }
        };
        fetchMarcas();
    }, []);

  return (
    <>
        <div className="listaMarcas-container">
            <Navbar />
            <h1 className="listaMarcas-title">Lista de Marcas</h1>
            <table className="listaMarcas-grid">
                <thead>
                    <tr>
                        <th className="marca-header">Marca</th>
                        <th className="marca-header">Descripción</th>
                        <th className="marca-header">Imagen</th>
                        <th className="marca-header">Estatus</th>
                        <th className="marca-header">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                {marcasData.map((marca, index) => (
                    <tr key={index}>
                        <td className="marca-data marca">{marca.nombreMarca}</td>
                        <td className="marca-data descripcion">{marca.descripcion}</td>
                        <td className="marca-data"><img src={marca.imgMarca} alt={marca.nombreMarca} className="img-marca" /></td>
                        <td className="marca-data estatus">{marca.estatus}</td>
                        <td className="marca-data">
                            <button className="btn-editar">Editar</button>
                            { marca.estatus === 'ACTIVO' ? (
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
    </>
  )
}
