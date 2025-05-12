import React, { useState } from 'react'
import '../login/login-registro.css'

import { useNavigate } from 'react-router-dom'

import Navbar from '../../componentes/navbar/navbar'

export default function Registro() {
  const navigate = useNavigate()
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("");
  const [datosUsuario, setDatosUsuario] = useState({
    nombre: "",
    aPaterno: "",
    aMaterno: "",
    correo: "",
    password: "",
    rolUsuario: "user",
    telefono: ""
  });

  const handleChange = (e) => {
    const { id, value } = e.target
    setDatosUsuario({
      ...datosUsuario,
      [id]: value
    }) 
  }

  const validarDatos = () => {
    const { nombre, aPaterno, aMaterno, correo, password, telefono } = datosUsuario;
  
    if (!nombre || !aPaterno || !aMaterno || !correo || !password || !telefono) {
      setMensaje("Todos los campos son obligatorios.");
      setTipoMensaje("error");
      return false;
    }
  
    if (!/^\d+$/.test(telefono) || telefono.length < 10) {
      setMensaje("El teléfono debe tener al menos 10 dígitos y solo contener números.");
      setTipoMensaje("error");
      return false;
    }
  
    if (!/\S+@\S+\.\S+/.test(correo)) {
      setMensaje("Correo electrónico inválido.");
      setTipoMensaje("error");
      return false;
    }
  
    if (password.length < 6) {
      setMensaje("La contraseña debe tener al menos 6 caracteres.");
      setTipoMensaje("error");
      return false;
    }
  
    return true;
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(""); // Limpiar mensaje anterior
  
    if (!validarDatos()) {
      setTimeout(() => setMensaje(""), 3000);
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosUsuario),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMensaje("Registro exitoso");
        setTipoMensaje("exito");
        setTimeout(() => {
          setMensaje("");
          navigate('/login');
        }, 3000);
      } else {
        setMensaje(data.message || "Error al registrar. Por favor, inténtalo de nuevo.");
        setTipoMensaje("error");
        setTimeout(() => setMensaje(""), 3000);
      }
  
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error al registrar. Por favor, inténtalo de nuevo más tarde.");
      setTipoMensaje("error");
      setTimeout(() => setMensaje(""), 3000);
    }
  };
  

  const handleRegisterRedirect = () => {
    navigate('/login')
  }
  return (
    <>
        <div className="login-registro-container">
            <Navbar/>
            <form className="login-registro-form" onSubmit={handleSubmit}>
              <div className="form-top">
                <h2>REGISTRO</h2>
                <p>Por favor, ingresa tus credenciales</p>
              </div>
            <div className="form-center">
              <input 
                type="text" 
                id="nombre" 
                name="nombre" 
                placeholder="Nombre (s)"
                value={datosUsuario.nombre} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-center">
              <input 
                type="text"   
                id="aPaterno" 
                name="aPaterno" 
                placeholder='Apellido Paterno'
                value={datosUsuario.aPaterno} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-center">  
              <input 
                type="text" 
                id="aMaterno" 
                name="aMaterno" 
                placeholder='Apellido Materno'
                value={datosUsuario.aMaterno} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-center">
              <input 
                type="text" 
                id="telefono" 
                name="telefono" 
                placeholder='Teléfono'
                value={datosUsuario.telefono} 
                onChange={handleChange} 
              />
            </div>
            <div className="form-center">
              <input 
                type="email" 
                id="correo" 
                name="correo" 
                placeholder='Correo electrónico'
                value={datosUsuario.correo} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-center">
              <input 
                type="password" 
                id="password" 
                name="password" 
                placeholder='Contraseña'
                value={datosUsuario.password} 
                onChange={handleChange} 
              />
            </div>

            <button type="submit" className='btn-submit'>Registrar</button>

            <div className="form-registro">
              <p>¿Ya tienes una cuenta? <a onClick={handleRegisterRedirect}>Inicia sesión</a></p>
            </div>
            </form>
            {
            mensaje && (
              <div className={`mensaje ${tipoMensaje}`}>
                {mensaje}
              </div>
              )}
        </div>
    </>
  )
}
