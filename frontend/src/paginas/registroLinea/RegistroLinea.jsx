import React, { useState } from 'react'

import Navbar from '../../componentes/navbar/Navbar'

export default function RegistroLinea() {
    const [imgBanner, setImgBanner] = useState(null)
    
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onloadend = () => {
            setImgBanner(reader.result)
        }
        if (file) {
            reader.readAsDataURL(file)
        } else {
            setImgBanner(null)
        }
    }
    return (
        <>
            <div className="registroLinea-container">
                <Navbar/>
                    <form className="registroLinea-form" >
                        <div className="form-top">
                            <h1>REGISTRO DE LÍNEA DE PRODUCTOS</h1>
                            <p>Ingrese los datos correctos</p>
                        </div>
    
                        <div className="form-content">
                            <div className="form-left">
                                <input type="text" id="nombreMarca" name="nombreMarca" placeholder="Nombre de la Línea" required/>

                                <select
                                    placeholder='Marca de la Línea'
                                    type="text" id="marcaProducto" 
                                    name="marcaProducto" required 
                                >
                                    <option value="">Seleccione una marca</option>
                                    <option value="dior">Dior</option>
                                    <option value="valentino">Valentino</option>
                                </select> 

                                <select id="tipoLinea" name="tipoLinea" required>
                                    <option value="">Seleccione el tipo de Línea</option>
                                    <option value="lineaHombre">Hombre</option>
                                    <option value="lineaMujer">Mujer</option>
                                </select>   
                                <div className="form-center">
                                    <label>Imagen de la Línea</label>
                                    <input type="file" name="imgMarca" className='imgForm' accept="image/*" 
                                    onChange={handleFileChange} required/>
                                </div>
                            </div>
    
                            <div className="form-right">
                                <div className="image-container">
                                    {imgBanner && <img src={imgBanner} alt="Vista previa" className="event-image" />}
                                </div>
                            </div>
                        </div>
                        <button type="submit">Registrar Línea</button>
                    </form>
            </div>
        </>
    )
    }
    
