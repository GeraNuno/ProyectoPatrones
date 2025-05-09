import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import './lineasPerfumes.css'

import Navbar from '../../componentes/navbar/navbar'

import { useNavigate } from 'react-router-dom';

export default function lineasPerfumes() {
    const navigate = useNavigate();
    const { nombreMarca, tipoLinea } = useParams();

    const [datosLineas, setDatosLineas] = useState([]);

    const datosMarca = JSON.parse(localStorage.getItem('marcas')) || [];
    const marca = datosMarca.find((marca) => marca.nombreMarca === nombreMarca);

    useEffect(() => {
        const fetchLineas = async () => {
            try {
                const response = await fetch(`http://localhost:5000/linea/lineas/${nombreMarca}/${tipoLinea}`);	
                const data = await response.json();
                setDatosLineas(data);
            } catch (error) {
                console.error('Error fetching lineas:', error);
            }
        }
        fetchLineas();
    }
    , [nombreMarca, tipoLinea]);

    const handleMarcaHome = () => {
        navigate(`/marca/${nombreMarca}`);
    }

    const handleProductos = (e) => {
        const linea = e.currentTarget.querySelector('.nombre-linea').textContent;
        console.log(linea);
        navigate(`/${nombreMarca}/${linea}/productos`)
    }
  return (
    <div className='lineasPerfumes-container'>
        <Navbar />
        <div className="lineasPerfumes-header">
            <img src={marca.imgMarca} className='img-Marca handle' onClick={handleMarcaHome} />
        </div>
        <div className="lineasPerfumes-opciones">
            <div className="lineasPerfumes-container">
            {datosLineas.map((linea) => (
                <div className="lineasPerfumes-item" key={linea._id}>
                    <div className="linea-imagen-contenedor" onClick={handleProductos}>
                        <img src={linea.imgBanner} className="img-lineaPerfume" alt={linea.nombreLinea} />
                        <div className="nombre-linea">{linea.nombreLinea}</div>
                    </div>
                </div>
                ))}
            </div>
        </div>

    </div>
  )
}
