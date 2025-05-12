import React, { useState } from 'react'
import './login-registro.css'
import { useNavigate } from 'react-router-dom'

import Navbar from '../../componentes/navbar/navbar'

export default function Login() {
    const navigate = useNavigate();
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');

    const [mensaje, setMensaje] = useState('');
    const [tipoMensaje, setTipoMensaje] = useState(''); // 'error' o 'exito'
    
    var nombrecompleto = ''; 

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensaje(''); // Limpiar mensaje previo
        setTipoMensaje(''); // Limpiar tipo de mensaje previo

        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ correo, password }),
            });

            if (response.ok) {
                const { token, user } = await response.json();
                localStorage.setItem('nombreEmpleado', user.nombre); // Guardar el nombre completo en el estado
                localStorage.setItem('rolUsuario', user.rolUsuario); // Guardar el tipo de empleado en el estado
                localStorage.setItem('token', token); // Guardar token en localStorage
                localStorage.setItem('userId', user.userid); // Guardar el id del usuario en el estado

                setMensaje('Inicio de sesión exitoso');
                setTipoMensaje('exito');
                setTimeout(() => {
                  setMensaje('');
                }, 3000);

                setTimeout(() => {
                  navigate('/'); // Redirigir a la página principal después de 3 segundos
                }, 3000);

            } else {
                const errorData = await response.json();
                setMensaje('Error al iniciar sesión. Por favor, inténtalo de nuevo.');
                setTipoMensaje('error');
                setNoEmpleado(''); // Limpiar el campo de No. Empleado
                setPassword(''); // Limpiar el campo de contraseña
                setTimeout(() => {
                    setMensaje('');
                }, 3000);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    const handleRegisterRedirect = () => {
        navigate('/registro'); // Redirigir a la página de registro
      };

  return (
    <>
        <div className="login-registro-container">
            <Navbar/>
            <form className="login-registro-form" onSubmit={handleSubmit}>
                <div className="form-top">
                    <h2>INICIAR SESIÓN</h2>
                    <p>Por favor, ingresa tus credenciales</p>
                </div>

                <div className="form-center">
                    <input type="text" id="noEmpleado" placeholder="Correo Electrónico" name="noEmpleado" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
                </div>
                <div className="form-center">
                    <input type="password" id="password" placeholder="Contraseña" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                
                <button type="submit" className='btn-submit'>LOGIN</button>

                <div className="form-registro">
                    <p>¿No tienes una cuenta? <a onClick={handleRegisterRedirect}>Registrate</a></p>
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
