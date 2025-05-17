import React from 'react'
import './home.css' 

import Navbar from '../../componentes/navbar/navbar'

import HomeCliente from '../../componentes/homeContent/homeCliente'
import HomeAdmin from '../../componentes/homeContent/HomeAdmin'

export default function Home() {
    const rol = localStorage.getItem('rolUsuario'); // Obtener el rol del localStorage
    const nombre = localStorage.getItem('nombreUsuario'); // Obtener el nombre completo del localStorage
  return (
    <>
        <main className="main-container ">
            <Navbar/>

            <div className="main-header">
                <picture>
                    <img src="/Banner.png" alt="Banner" className="Banner" />
                </picture>

            </div>
            
            <div className="main-content">
                {rol === 'admin' ? <HomeAdmin/> : <HomeCliente/>}
            </div>

            <div className="main-footer">
                © 2025 Vynce S.A. de C.V.
            </div>
        </main>
    </>
  )
}
