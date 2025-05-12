import React, { useEffect, useState } from 'react';

export default function EditarProducto() {
    const [producto, setProducto] = useState(null);
    const [presentacion, setPresentacion] = useState(null);

    useEffect(() => {
        // Obtener el producto y la presentación desde el localStorage
        const productoData = JSON.parse(localStorage.getItem('producto'));
        const presentacionData = JSON.parse(localStorage.getItem('presentacion'));

        if (productoData && presentacionData) {
            setProducto(productoData);
            setPresentacion(presentacionData);
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí iría el código para enviar la actualización al servidor, por ejemplo:
        // fetch('http://localhost:5000/producto/actualizarPresentacion', { ... })
    };

    if (!producto || !presentacion) {
        return <div>Cargando...</div>;
    }

    return (
        <div className="editarProducto-container">
            <h1>Editar Presentación de Producto</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Mililitros:</label>
                    <input
                        type="number"
                        value={presentacion.mililitros}
                        onChange={(e) => setPresentacion({ ...presentacion, mililitros: e.target.value })}
                    />
                </div>
                <div>
                    <label>Precio:</label>
                    <input
                        type="number"
                        value={presentacion.precio}
                        onChange={(e) => setPresentacion({ ...presentacion, precio: e.target.value })}
                    />
                </div>
                <div>
                    <label>Stock:</label>
                    <input
                        type="number"
                        value={presentacion.stockProducto}
                        onChange={(e) => setPresentacion({ ...presentacion, stockProducto: e.target.value })}
                    />
                </div>
                <div>
                    <label>Imagen:</label>
                    <input
                        type="file"
                        onChange={(e) => setPresentacion({ ...presentacion, imagenesProducto: [URL.createObjectURL(e.target.files[0])] })}
                    />
                </div>
                <button type="submit">Guardar Cambios</button>
            </form>
        </div>
    );
}
