import React, { useEffect, useState } from 'react'

import './marcaHome.css';
import Navbar from '../../componentes/navbar/navbar'

import { useNavigate, useParams } from "react-router-dom";

export default function MarcaHome() {
  const { nombreMarca } = useParams();
  const datosMarca = JSON.parse(localStorage.getItem('marcas')) || [];

  const marca = datosMarca.find((marca) => marca.nombreMarca === nombreMarca);
  const [tipoLinea, setTipoLinea] = useState([{
    hombre: 'lineaHombre',
    mujer: 'lineaMujer'
}]); 


  const navigate = useNavigate();

  const handleLineasH = () => {
    navigate(`/lineasPerfumes/${nombreMarca}/${tipoLinea[0].hombre}`);
  }

  const handleLineasM = () => {
    navigate(`/lineasPerfumes/${nombreMarca}/${tipoLinea[0].mujer}`);
  }

  return (
    <>
        <div className="fragances-container">
            <Navbar />
            <div className="fragances-header">
              <img src={marca.imgMarca} className='img-Marca' />
            </div>
            <div className="fragancias-opciones">
              <div className="frag-hombre">
                <h2 className="frag-title">Fragancias Hombre</h2>
                <div className="frag-hombre-container">
                  <div className="frag-hombre-item">
                    <img src={marca.imgFragH} className='img-fragancia' onClick={handleLineasH}/>
                  </div>
                </div>
              </div>
              <div className="frag-mujer">
                <h2 className="frag-title">Fragancias Mujer</h2>
                <div className="frag-mujer-container">
                  <div className="frag-mujer-item">
                    <img src={marca.imgFragM} className='img-fragancia' onClick={handleLineasM} />
                  </div>
                </div>
              </div>
            </div>
        </div>
    </>
  )
}
