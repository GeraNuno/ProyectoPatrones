import React, { useState } from 'react'

import Navbar from '../../componentes/navbar/Navbar'

export default function RegistroProducto() {
  const [imagenes, setImagenes] = useState([]);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // convierte FileList a array
    setImagenes(files);
  };
  return (
    <>
        <div className="registroProducto-container">
            <Navbar />

              <form className="formulario-registro">
                <div className="form-top">
                    <h1>Registro de Producto</h1>
                    <p>Agrega una nueva fragancia</p>
                </div>
                
                <div className="form-content">
                    <div className="form-left">
                      <input 
                        placeholder='Nombre del Producto'
                        type="text" id="nombreProducto" name="nombreProducto" required />

                      <select
                        placeholder='Marca del Producto'
                        type="text" id="marcaProducto" 
                        name="marcaProducto" required 
                      >
                          <option value="">Seleccione una marca</option>
                          <option value="dior">Dior</option>
                      </select>

                      <select
                        placeholder='Línea del Producto'
                        type="text" id="marcaProducto" 
                        name="marcaProducto" required 
                      >
                          <option value="">Seleccione una línea de la marca</option>
                          <option value="dior">Sauvage</option>
                          <option value="valentino">Dior Homme</option>
                      </select>

                      <input
                        placeholder='Precio del Producto'
                        type="text" id="precioProducto" name="precioProducto" required />

                      <input
                          placeholder='Cantidad en Stock'
                        type="text" id="stockProducto" name="stockProducto" required />

                      <div className="form-center">
                        <label>Imágenes del Producto</label>
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </div>
                    </div>
                    <div className="form-right">
                      {imagenes.map((img, index) => (
                        <div key={index} className="image-container">
                          <img src={URL.createObjectURL(img)} alt={`Vista previa ${index}`} className="event-image" />
                        </div>
                      ))}
                    </div>
                  </div>
                    <button type="submit">Registrar Producto</button>
                </form>
            </div>
    </>
  )
}
