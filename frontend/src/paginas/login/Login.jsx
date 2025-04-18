import React, { useState } from 'react'
import './login.css'
import { useNavigate } from 'react-router-dom'

import Navbar from '../../componentes/navbar/Navbar'

export default function Login() {
    const navigate = useNavigate();
    const [noEmpleado, setNoEmpleado] = useState('');
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
                body: JSON.stringify({ noEmpleado, password }),
            });

            if (response.ok) {
                const { token } = await response.json();
                nombrecompleto = `${data.user.nombre} ${data.user.aPaterno} ${data.user.aMaterno}`; // Concatenar los nombres y apellidos
                localStorage.setItem('nombreEmpleado', nombrecompleto); // Guardar el nombre completo en el estado
                localStorage.setItem('token', token); // Guardar token en localStorage
                
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
        <div className="login-container">
            <Navbar/>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-top">
                    <h2>Iniciar Sesión</h2>
                    <p>Por favor, ingresa tus credenciales</p>
                </div>

                <div className="form-center">
                    <input type="text" id="noEmpleado" placeholder="No. Empleado" name="noEmpleado" value={noEmpleado} onChange={(e) => setNoEmpleado(e.target.value)} required />
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
