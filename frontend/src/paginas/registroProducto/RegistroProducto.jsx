import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../componentes/navbar/navbar'

import DeleteIcon from '@mui/icons-material/Delete';

export default function RegistroProducto() {
  const [mensaje, setMensaje] = useState('')
  const [tipoMensaje, setTipoMensaje] = useState('')
  const [nombresMarcas, setNombresMarcas] = useState([])
  const [nombresLineas, setNombresLineas] = useState([])

  const [formData, setFormData] = useState({
    nombreProducto: '',
    marcaProducto: '',
    lineaProducto: '',
    presentaciones: [{ mililitros: '', precio: '', stockProducto: '', imagenes: [] }]
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

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePresentacionChange = (index, field, value) => {
    const nuevas = [...formData.presentaciones]
    if (field === 'imagenes') {
      nuevas[index][field] = Array.from(value.target.files)
    } else {
      nuevas[index][field] = value
    }
    setFormData(prev => ({
      ...prev,
      presentaciones: nuevas
    }))
  }

  const agregarPresentacion = () => {
    setFormData(prev => ({
      ...prev,
      presentaciones: [...prev.presentaciones, { mililitros: '', precio: '', stockProducto: '', imagenes: [] }]
    }))
  }

  const eliminarPresentacion = (index) => {
    const nuevas = formData.presentaciones.filter((_, i) => i !== index)
    setFormData(prev => ({ ...prev, presentaciones: nuevas }))
  }

const handleSubmit = async (e) => {
  e.preventDefault();

  const form = new FormData();
  form.append('nombreProducto', formData.nombreProducto);
  form.append('marcaProducto', formData.marcaProducto);
  form.append('lineaProducto', formData.lineaProducto);

  const presentacionesData = formData.presentaciones.map((pres, i) => {
    // Asociar imágenes con su índice de presentación
    pres.imagenes.forEach((img) => {
      form.append(`imagenesPresentaciones_${i}`, img);
    });
    return {
      mililitros: pres.mililitros,
      precio: pres.precio,
      stockProducto: pres.stockProducto,
    };
  });

  form.append('presentaciones', JSON.stringify(presentacionesData));

  try {
    const res = await fetch('http://localhost:5000/producto/registroProducto', {
      method: 'POST',
      body: form
    });

    const data = await res.json();

    if (res.ok) {
      setTipoMensaje('exito');
      setMensaje(data.message);
      setFormData({
        nombreProducto: '',
        marcaProducto: '',
        lineaProducto: '',
        stockProducto: '',
        presentaciones: [{ mililitros: '', precio: '', imagenes: [] }]
      });

      setTimeout(() => {
        setMensaje('');
        navigate('/listaProductos');
      }, 3000);
    } else {
      setTipoMensaje('error');
      setMensaje(data.error || 'Error al registrar el producto');
    }
  } catch (err) {
    console.error('Error:', err);
    setTipoMensaje('error');
    setMensaje('Error al registrar el producto');
  }
};


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

            {formData.presentaciones.map((pres, i) => (
              <div key={i} className="presentacion-group">
                <div className="presentacionHeader">
                  {formData.presentaciones.length > 1 && (
                    <DeleteIcon onClick={() => eliminarPresentacion(i)} />
                  )}
                </div>
                <input
                  type="number"
                  placeholder="Mililitros"
                  value={pres.mililitros}
                  onChange={(e) => handlePresentacionChange(i, 'mililitros', e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Precio"
                  value={pres.precio}
                  onChange={(e) => handlePresentacionChange(i, 'precio', e.target.value)}
                  required
                />
                <input
                  type="number"
                  name="stockProducto"
                  placeholder="Cantidad en Stock"
                  value={pres.stockProducto}
                  onChange={(e) => handlePresentacionChange(i, 'stockProducto', e.target.value)}
                  min="0"
                  required
                />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handlePresentacionChange(i, 'imagenes', e)}
                  required
                />
              </div>
            ))}
            <button type="button" className='agregarPresentacion' onClick={agregarPresentacion}>Agregar presentación</button>


          </div>

          <div className="form-right">
            {formData.presentaciones.map((pres, i) => (
              pres.imagenes?.map((img, j) => (
                <img
                  key={`${i}-${j}`}
                  src={URL.createObjectURL(img)}
                  alt={`Preview ${i}-${j}`}
                  className="event-image"
                />
              ))
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
