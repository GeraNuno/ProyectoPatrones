import React from 'react'
import './homeContent.css'

import { useNavigate } from 'react-router-dom'

import logo from '/VynceLogo.png'
const fotoSauvage  = 'https://res.cloudinary.com/dgwppzl6m/image/upload/v1747159856/Vynce/mtiftzdiomd7qkzgg4xy.jpg'

export default function homeCliente() {
    const navigate = useNavigate()

    const rolUsuario = localStorage.getItem('rolUsuario'); // Obtener el rol del localStorage
    
    const handleDior = () => {
        navigate('/marca/Dior')
    }
    const handleValentino = () => {
        navigate('/marca/Valentino')
    }
  return (
    <>
        <div className="home-container">
            <div className="card-Bienvenida">
                <div className="card-top">
                    <h1 className="titulo">BIENVENIDO</h1>
                </div>
                <div className="card-content">
                    <p className="subtitulo">Contamos con las mejoras marcas de lujo</p>
                    <p className="subtitulo">para que puedas disfrutar de una experiencia única.</p>
                </div>
                <picture className="img-container">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Dior_Logo_2022.svg/1200px-Dior_Logo_2022.svg.png" alt="Dior" className="img-Marca" />
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Valentino_logo.svg/2560px-Valentino_logo.svg.png" alt="Valentino" 
                        className='img-Marca'/>
                </picture>
                <div className="card-bottom">
                    <button className="btn-Bienvenida" onClick={handleDior}>Explorar Dior</button>
                    <button className="btn-Bienvenida" onClick={handleValentino}>Explorar Valentino</button>
                </div>
            </div>
            <div className="card-Login">
                { rolUsuario ? (
                    <>
                        <div className="card-top">
                            <h1 className="titulo">consigue tus productos de lujo</h1>
                        </div>
                        <div className="card-content">
                            <p className="subtitulo">Hola <b>{localStorage.getItem('nombreEmpleado')}</b></p>
                            <p className="subtitulo">Ya puedes disfrutar de los producto </p>
                            <p className='subtitulo'>de lujo que tenemos para ti.</p>
                        </div>
                        <picture className="img-container">
                            <img src={fotoSauvage} alt="Logo" className="img-Marca" />
                        </picture>
                        <div className="card-bottom">
                            <button onClick={() => navigate('/producto/68238b43753e339cda870865')}>Explorar Saugave</button>
                        </div>
                    </>
                ) : (<>
                    <div className="card-top">
                        <h1 className="titulo">INICIAR SESIÓN</h1>
                    </div>
                    <div className="card-content">
                        <p className="subtitulo">Ya tienes una cuenta, puedes iniciar sesión.</p>
                    </div>
                    <picture className="img-container">
                        <img src={logo} alt="Logo" className="img-Marca" />
                    </picture>
                    <div className="card-bottom">
                        <button onClick={() => navigate('/login')}>Iniciar Sesión</button>
                    </div>

                </>)    
                }
            </div>
        </div>
    </>
)
}