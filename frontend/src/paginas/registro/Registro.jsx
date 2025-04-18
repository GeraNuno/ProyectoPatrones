import React from 'react'
import './registro.css'

export default function Registro() {
  return (
    <>
        <div className="registro-container">
            <h1>Registro</h1>
            <form className="registro-form">
            <label htmlFor="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" required />
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
            <label htmlFor="password">Contraseña:</label>
            <input type="password" id="password" name="password" required />
            <button type="submit">Registrar</button>
            </form>
        </div>
    </>
  )
}
