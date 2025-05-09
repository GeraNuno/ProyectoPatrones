import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../componentes/navbar/navbar'

export default function RegistroProducto() {
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('')
  const [nombresMarcas, setNombresMarcas] = useState([])
  const [nombresLineas, setNombresLineas] = useState([])
  const [imagenes, setImagenes] = useState([])

  const [formData, setFormData] = useState({
    nombreProducto: '',
    marcaProducto: '',
    lineaProducto: '',
    precioProducto: '',
    stockProducto: '',
  })

  const navigate = useNavigate()

  useEffect(() => {
    const fetchNombresMarcas = async () => {
      try {
        const res = await fetch('http://localhost:5000/marca/nombreMarcas')
        const data = await res.json()
        setNombresMarcas(data)
      } catch (err) {
        console.error('Error obteniendo marcas:', err)
      }
    }

    fetchNombresMarcas()
  }, [])

  useEffect(() => {
    const fetchLineasPorMarca = async () => {
      if (!formData.marcaProducto) return
      try {
        const res = await fetch(`http://localhost:5000/linea/lineasPorMarca/${formData.marcaProducto}`)
        const data = await res.json()
        setNombresLineas(data)
      } catch (err) {
        console.error('Error obteniendo líneas:', err)
      }
    }

    fetchLineasPorMarca()
  }, [formData.marcaProducto])

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files)
    setImagenes(files)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const form = new FormData()
    form.append('nombreProducto', formData.nombreProducto)
    form.append('marcaProducto', formData.marcaProducto)
    form.append('lineaProducto', formData.lineaProducto)
    form.append('precioProducto', parseFloat(formData.precioProducto))
    form.append('stockProducto', parseInt(formData.stockProducto, 10))

    imagenes.forEach(img => {
      form.append('imagenesProducto', img)
    })

    try {
      const res = await fetch('http://localhost:5000/producto/registroProducto', {
        method: 'POST',
        body: form
      })

      const data = await res.json()

      if (res.ok) {
        setTipoMensaje('exito')
        setMensaje(data.message)
        setFormData({
          nombreProducto: '',
          marcaProducto: '',
          lineaProducto: '',
          precioProducto: '',
          stockProducto: '',
        })
        setImagenes([])

        setTimeout(() => {
          setMensaje('')
          navigate('/listaProductos')
        }, 3000)
      } else {
        setTipoMensaje('error')
        setMensaje(data.error || 'Error al registrar el producto')
      }
    } catch (err) {
      console.error('Error:', err)
      setTipoMensaje('error')
      setMensaje('Error al registrar el producto')
    }
  }

  return (
    <div className="registroProducto-container">
      <Navbar />

      <form className="formulario-registro" onSubmit={handleSubmit}>
        <div className="form-top">
          <h1>Registro de Producto</h1>
          <p>Agrega una nueva fragancia</p>
        </div>

        <div className="form-content">
          <div className="form-left">
            <input
              type="text"
              name="nombreProducto"
              placeholder="Nombre del Producto"
              value={formData.nombreProducto}
              onChange={handleChange}
              required
            />

            <select
              name="marcaProducto"
              value={formData.marcaProducto}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una marca</option>
              {nombresMarcas.map((marca, i) => (
                <option key={i} value={marca.nombreMarca}>{marca.nombreMarca}</option>
              ))}
            </select>

            <select
              name="lineaProducto"
              value={formData.lineaProducto}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una línea</option>
              {nombresLineas.map((linea, i) => (
                <option key={i} value={linea.nombreLinea}>{linea.nombreLinea}</option>
              ))}
            </select>

            <input
              type="number"
              name="precioProducto"
              placeholder="Precio del Producto"
              value={formData.precioProducto}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />

            <input
              type="number"
              name="stockProducto"
              placeholder="Cantidad en Stock"
              value={formData.stockProducto}
              onChange={handleChange}
              min="0"
              required
            />

            <label>Imágenes del Producto</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          <div className="form-right">
            {imagenes.map((img, index) => (
              <div key={index} className="image-container">
                <img
                  src={URL.createObjectURL(img)}
                  alt={`Preview ${index}`}
                  className="event-image"
                />
              </div>
            ))}
          </div>
        </div>

        <button type="submit">Registrar Producto</button>
      </form>

      {mensaje && (
        <div className={`mensaje ${tipoMensaje}`}>
          {mensaje}
        </div>
      )}
    </div>
  )
}
