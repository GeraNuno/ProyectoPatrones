const express = require('express');
const Carrito = require('../modelos/Carrito.js');
const Producto = require('../modelos/Productos.js');

const router = express.Router();

// Agregar o actualizar producto en el carrito
router.post('/agregar', async (req, res) => {
  const { usuarioId, producto } = req.body;

  try {
    // Verifica que el producto y la presentación existan
    const productoDB = await Producto.findById(producto.idProducto);
    if (!productoDB || !productoDB.presentaciones[producto.indexPresentacion]) {
      return res.status(400).json({ error: 'Producto o presentación no válida' });
    }

    // Busca el carrito del usuario
    let carrito = await Carrito.findOne({ usuario: usuarioId });

    if (!carrito) {
      // Si no tiene carrito, crea uno nuevo
      carrito = new Carrito({
        usuario: usuarioId,
        productos: [{
          idProducto: producto.idProducto,
          tipoPresentacion: producto.indexPresentacion,
          cantidad: producto.cantidad || 1
        }]
      });
    } else {
      // Busca si ya existe el producto con la misma presentación
      const index = carrito.productos.findIndex(p =>
        p.idProducto.toString() === producto.idProducto &&
        p.tipoPresentacion === producto.indexPresentacion
      );

      if (index !== -1) {
        // Si existe, suma la cantidad
        carrito.productos[index].cantidad += producto.cantidad;
      } else {
        // Si no, agrega el nuevo producto
        carrito.productos.push({
          idProducto: producto.idProducto,
          tipoPresentacion: producto.indexPresentacion,
          cantidad: 1
        });
      }
    }

    carrito.actualizadoEn = new Date();
    await carrito.save();

    res.status(200).json(carrito);
  } catch (err) {
    console.error('Error al agregar al carrito:', err);
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
});

// Actualizar cantidad de un producto
router.patch('/actualizar', async (req, res) => {
  const { usuarioId, idProducto, indexPresentacion, nuevaCantidad } = req.body;

  try {
    const carrito = await Carrito.findOne({ usuario: usuarioId });
    if (!carrito) return res.status(404).json({ error: 'Carrito no encontrado' });

    const index = carrito.productos.findIndex(p =>
      p.idProducto.toString() === idProducto && p.tipoPresentacion === indexPresentacion
    );

    if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' });

    carrito.productos[index].cantidad = nuevaCantidad;
    await carrito.save();

    res.json({ message: 'Cantidad actualizada correctamente' });
  } catch (err) {
    console.error('Error al actualizar cantidad:', err);
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

// Eliminar un producto
router.delete('/eliminar', async (req, res) => {
  const { usuarioId, idProducto, indexPresentacion } = req.body;

  try {
    const carrito = await Carrito.findOne({ usuario: usuarioId });
    if (!carrito) return res.status(404).json({ error: 'Carrito no encontrado' });

    carrito.productos = carrito.productos.filter(p =>
      !(p.idProducto.toString() === idProducto && p.tipoPresentacion === indexPresentacion)
    );

    await carrito.save();
    res.json({ message: 'Producto eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar producto:', err);
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

router.get('/productos/:usuarioId', async (req, res) => {
  try {
    const { usuarioId } = req.params;

    const carrito = await Carrito.findOne({ usuario: usuarioId }).populate('productos.idProducto');
    
    if (!carrito) return res.status(404).json({ error: 'Carrito no encontrado' });

    const productosConDatos = carrito.productos.map((item) => {
      const producto = item.idProducto;
      const presentacion = producto.presentaciones[item.tipoPresentacion];

      return {
        idProducto: producto._id,
        nombreProducto: producto.nombreProducto,
        imagenProducto: presentacion.imagenesProducto[0], // si está dentro de presentaciones
        precioProducto: presentacion.precio,
        mililitros: presentacion.mililitros,
        cantidad: item.cantidad,
        indexPresentacion: item.tipoPresentacion
      };
    });

    res.json(productosConDatos);
  } catch (err) {
    console.error('Error al obtener productos del carrito:', err);
    res.status(500).json({ error: 'Error al obtener productos del carrito' });
  }
});

router.get('/datosCarrito/:idCarrito', async (req, res) => {
  const { idCarrito } = req.params;

  try {
    const carrito = await Carrito.findById(idCarrito).populate('productos.idProducto');
    if (!carrito) return res.status(404).json({ mensaje: 'Carrito no encontrado' });
    
    const productosConDatos = carrito.productos.map((item) => {
      const producto = item.idProducto;
      const presentacion = producto.presentaciones[item.tipoPresentacion];

      return {
        idProducto: producto._id,
        nombreProducto: producto.nombreProducto,
        imagenProducto: presentacion.imagenesProducto[0], // si está dentro de presentaciones
        precioProducto: presentacion.precio,
        mililitros: presentacion.mililitros,
        cantidad: item.cantidad,
        indexPresentacion: item.tipoPresentacion
      };
    });

    res.json(productosConDatos);
  } catch (error) {
    console.error('Error al obtener carrito:', error);
    res.status(500).json({ mensaje: 'Error del servidor' });
  }
});

router.get('/obtenerIdCarrito/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const carrito = await Carrito.findOne({ usuario: usuarioId });
    if (!carrito) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json({ idCarrito: carrito._id });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener ID del carrito' });
  }
}
);

module.exports = router;
