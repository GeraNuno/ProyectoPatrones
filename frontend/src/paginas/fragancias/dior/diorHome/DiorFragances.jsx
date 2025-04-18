import React from 'react'
import './diorFragances.css';

import '../../fragancias.css'; 

import Navbar from '../../../../componentes/Navbar/Navbar';

import { useNavigate } from "react-router-dom";

//Imagenes de fragancias
import Sauvage from '../../../../assets/imagesMarcas/Dior/Fragancias/Hombre/Sauvage/EauDeToilette/EauDeToilette_Principal.png';
import MissDior from '../../../../assets/imagesMarcas/Dior/Fragancias/Mujer/MissDior/EauDeParfum/EauDeParfum_Principal.png';

export default function DiorFragances() {
  const navigate = useNavigate();

  const handleMissDiorClick = () => {
    navigate('/dior/women');
  }

  const handleSauvageClick = () => {
    navigate('/dior/men');
  }

  return (
    <>
        <div className="fragances-container">
          <Navbar />

            <div className="fragances-header">
              <h1 className="fragances-title">Dior</h1>
            </div>
            <div className="fragancias-opciones">
              <div className="frag-hombre">
                <h2 className="frag-title">Fragancias Hombre</h2>
                <div className="frag-hombre-container">
                  <div className="frag-hombre-item">
                    <img src={Sauvage} className='img-fragancia' onClick={handleSauvageClick}/>
                  </div>
                </div>
              </div>
              <div className="frag-mujer">
                <h2 className="frag-title">Fragancias Mujer</h2>
                <div className="frag-mujer-container">
                  <div className="frag-mujer-item">
                    <img src={MissDior} className='img-fragancia' onClick={handleMissDiorClick}/>
                  </div>
                </div>
              </div>
            </div>
        </div>
    </>
  )
}
