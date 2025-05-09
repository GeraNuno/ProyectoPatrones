import React, { useState, useEffect } from 'react'
import './ListaMarcas.css'

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
        <div className="listaAdmin-container">
            <Navbar />
            <h1 className="listaAdmin-title">Lista de Marcas</h1>
            <div className="tableAdmin-wrapper">

                <table className="tableAdmin-grid">
                    <thead>
                        <tr>
                            <th className="tableAdmin-header">Marca</th>
                            <th className="tableAdmin-header">Imagen</th>
                            <th className="tableAdmin-header">Estatus</th>
                            <th className="tableAdmin-header">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                    {marcasData.map((marca, index) => (
                        <tr key={index}>
                            <td className="tableAdmin-data estatus">{marca.nombreMarca}</td>
                            <td className="tableAdmin-data"><img src={marca.imgMarca} alt={marca.nombreMarca} className="img-marca" /></td>
                            <td className="tableAdmin-data estatus">{marca.estatus}</td>
                            <td className="tableAdmin-data">
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
        </div>
    </>
  )
}
