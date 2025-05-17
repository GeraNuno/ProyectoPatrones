import React from 'react'
import './homeContent.css'

import logo from '/VynceLogo.png'

export default function HomeAdmin() {
  return (
    <>
      <div className="home-admin">
        <img src={logo} alt="Logo" className="home-admin-logo-image" />
        <h1 className="home-admin-title">Bienvenido Administrador</h1>
      </div>
    </>
  )
}
