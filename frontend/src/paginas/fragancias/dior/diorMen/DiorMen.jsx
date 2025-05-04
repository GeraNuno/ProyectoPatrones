import React from 'react'
import './DiorMen.css'

import Navbar from '../../../../componentes/navbar/Navbar'

export default function DiorMen() {
  return (
    <>
      <Navbar/>
      <div className="fragancias-container">
        <div className="fragancia-card">
          <h2>Fragancia 1</h2>
          <p>Descripción de la fragancia 1</p>
        </div>
        <div className="fragancia-card">
          <h2>Fragancia 2</h2>
          <p>Descripción de la fragancia 2</p>
        </div>
        <div className="fragancia-card">
          <h2>Fragancia 3</h2>
          <p>Descripción de la fragancia 3</p>
        </div>
      </div>
    </>
    
  )
}
