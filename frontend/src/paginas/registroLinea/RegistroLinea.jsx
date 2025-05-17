import React, { useState, useEffect } from 'react'

import Navbar from '../../componentes/navbar/navbar'
import { useNavigate } from 'react-router-dom'

export default function RegistroLinea() {
    const navigate = useNavigate()
    const [mensaje, setMensaje] = useState('')
    const [tipoMensaje, setTipoMensaje] = useState('')

    const [formData, setFormData] = useState({
        nombreLinea: '',
        nombreMarca: '',
        tipoLinea: '',
        imgBanner: null,
    })  

    const [imgBanner, setImgBanner] = useState(null)
    const [nombresMarcas, setNombresMarcas] = useState([])
    
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImgBanner(URL.createObjectURL(file));
            setFormData({
                ...formData,
                imgBanner: file
            });
        }
    };

    useEffect(() => {
        const fetchNombresMarcas = async () => {
            try {
                const response = await fetch('http://localhost:5000/marca/nombreMarcas')
                const data = await response.json()
                setNombresMarcas(data)
            } catch (error) {
                console.error('Error fetching nombres de marcas:', error)
            }
        }

        fetchNombresMarcas()
    }
    , [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        console.log("Datos del formulario", formData)
        const formDataToSend = new FormData()
        formDataToSend.append('nombreLinea', formData.nombreLinea)
        formDataToSend.append('nombreMarca', formData.nombreMarca)
        formDataToSend.append('tipoLinea', formData.tipoLinea)
        formDataToSend.append('imgBanner', formData.imgBanner)

        console.log("Datos del formulario a enviar", formDataToSend)

        try {
            const response = await fetch('http://localhost:5000/linea/registroLinea', {
                method: 'POST',
                body: formDataToSend,
            })
            if (response.ok) {
                setMensaje("Nueva marca registrada con éxito: " + formData.nombreLinea);
                setTipoMensaje("exito");
                setTimeout(() => {
                    setMensaje("");
                    navigate('/listaLineas');
                }, 3000);
            } else {
                setMensaje("Error al registrar la marca: " + formData.nombreLinea);
                setTipoMensaje("error");
                setTimeout(() => {
                    setMensaje("");
                    
                }, 3000);
            }
        } catch (error) {
            console.error('Error al registrar la línea:', error)
            alert('Error al registrar la línea')
        }
    }

    return (
        <>
            <div className="registroLinea-container">
                <Navbar/>
                    <form className="registroLinea-form" onSubmit={handleSubmit}>
                        <div className="form-top">
                            <h1>REGISTRO DE LÍNEA DE PRODUCTOS</h1>
                            <p>Ingrese los datos correctos</p>
                        </div>
    
                        <div className="form-content">
                            <div className="form-left">
                                <input 
                                    type="text" 
                                    id="nombreLinea" 
                                    name="nombreLinea" 
                                    value={formData.nombreLinea}
                                    onChange={handleChange}
                                    placeholder="Nombre de la Línea" 
                                    required/>

                                <select
                                    placeholder='Marca de la Línea'
                                    type="text" id="nombreMarca" 
                                    value={formData.nombreMarca}
                                    onChange={handleChange}
                                    name="nombreMarca" required 
                                >
                                    <option value="">Seleccione una marca</option>
                                    {nombresMarcas.map((marca, index) => (
                                        <option key={index} value={marca.nombreMarca}>
                                            {marca.nombreMarca}
                                        </option>
                                    ))}
                                </select> 

                                <select id="tipoLinea" name="tipoLinea" value={formData.tipoLinea} onChange={handleChange} required>
                                    <option value="">Seleccione el tipo de Línea</option>
                                    <option value="lineaHombre">Hombre</option>
                                    <option value="lineaMujer">Mujer</option>
                                </select>   
                                <div className="form-center">
                                    <label>Imagen de la Línea</label>
                                    <input type="file" name="imgBanner" className='imgForm' accept="image/*" 
                                    onChange={handleImageChange} required/>
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
    
