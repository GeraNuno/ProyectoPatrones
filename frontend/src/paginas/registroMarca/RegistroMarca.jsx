import React, { useState, useEffect } from 'react'
import './registroMarca.css'

import { useNavigate, useLocation } from 'react-router-dom'

import Navbar from '../../componentes/navbar/Navbar'


export default function RegistroMarca() {
    const [imgMarca, setImgMarca] = useState(null)
    const [imgFragH, setImgFragH] = useState(null)
    const [imgFragM, setImgFragM] = useState(null)

    const navigate = useNavigate()
    const location = useLocation()

    const [mensaje, setMensaje] = useState('')
    const [tipoMensaje, setTipoMensaje] = useState('')

    const [formData, setFormData] = useState({
        nombreMarca: '',
        descripcion: '',
        imgMarca: null,
        imgFragH: null,
        imgFragM: null,
    })

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onloadend = () => {
            if (e.target.name === 'imgMarca') {
                setImgMarca(reader.result)
                setFormData({
                    ...formData,
                    imgMarca: file
                });
            } else if (e.target.name === 'imgFragH') {
                setImgFragH(reader.result)
                setFormData({
                    ...formData,
                    imgFragH: file
                });
            } else if (e.target.name === 'imgFragM') {
                setImgFragM(reader.result)
                setFormData({
                    ...formData,
                    imgFragM: file
                });
            }
        }
        if (file) {
            reader.readAsDataURL(file)
        } else {
            setImgMarca(null)
            setImgFragH(null)
            setImgFragM(null)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (e) => {
        console.log("Formulario enviado", formData)
        e.preventDefault()
        
        const form = new FormData();
        form.append('nombreMarca', formData.nombreMarca)
        form.append('descripcion', formData.descripcion)
        form.append('imgMarca', formData.imgMarca)
        form.append('imgFragH', formData.imgFragH)
        form.append('imgFragM', formData.imgFragM)

        try {
            const response = await fetch('http://localhost:5000/marca/registro', {
                method: 'POST',
                body: form,
            })

            if (response.ok) {
                setMensaje("Nueva marca registrada con éxito: " + formData.nombreMarca);
                setTipoMensaje("exito");
                setTimeout(() => {
                    setMensaje("");
                    navigate('/');
                }, 3000);
            } else {
                setMensaje("Error al registrar la marca: " + formData.nombreMarca);
                setTipoMensaje("error");
                setTimeout(() => {
                    setMensaje("");
                    location.reload(); 
                }, 3000);
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Error al registrar la marca')
        }
    }

  return (
    <>
        <div className="registroMarca-container">
            <Navbar/>
                <form className="registroMarca-form" onSubmit={handleSubmit}>
                    <div className="form-top">
                        <h1>REGISTRO DE MARCA</h1>
                        <p>Ingrese los datos correctos</p>
                    </div>

                    <div className="form-content">
                        <div className="form-left">
                            <input type="text" id="nombreMarca" name="nombreMarca" placeholder="Nombre de la Marca" value={formData.nombreMarca} onChange={handleChange} required/>

                            <textarea id="descripcion" name="descripcion" placeholder="Descripción de la Marca" value={formData.descripcion}
                            onChange={handleChange} required></textarea>

                            <div className="form-center">
                                <label>Imagen de la Marca</label>
                                <input type="file" name="imgMarca" className='imgForm' accept="image/*" onChange={handleFileChange} required/>
                            </div>

                            <div className="form-center">
                                <label>Imagen para Fragancia de Hombre</label>
                                <input type="file" name="imgFragH" className='imgForm' accept="image/*" onChange={handleFileChange} required/>
                            </div>
                            
                            <div className="form-center">
                                <label>Imagen para Fragancia de Mujer</label>
                                <input  type="file" name="imgFragM" className='imgForm' accept="image/*" onChange={handleFileChange} required/>
                            </div>
                        </div>

                        <div className="form-right">
                            <div className="image-container">
                                {imgMarca && <img src={imgMarca} alt="Vista previa" className="event-image" />}
                            </div>
                            <div className="image-container">
                                {imgFragH && <img src={imgFragH} alt="Vista previa" className="event-image" />}
                            </div>
                            <div className="image-container">
                                {imgFragM && <img src={imgFragM} alt="Vista previa" className="event-image" />}
                            </div> 
                        </div>
                    </div>
                    <button type="submit">Registrar Marca</button>
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
