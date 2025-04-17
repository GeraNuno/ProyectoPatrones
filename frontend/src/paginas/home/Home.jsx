import React from 'react'
import './home.css' 

import Navbar from '../../componentes/navbar/Navbar'

export default function Home() {
  return (
    <>
        <Navbar/>
        <main className="main-container">
            <div className="main-header">
                <picture>
                    <img src="/Banner.png" alt="Banner" className="Banner" />
                </picture>
            </div>
            <div className="main-content">
                <h1>Bienvenido a la página de inicio</h1>
                <p>Esta es una aplicación de ejemplo para mostrar el uso de React Router.</p>
            </div>
            <div className="main-footer">

            </div>
        </main>
    </>
  )
}
