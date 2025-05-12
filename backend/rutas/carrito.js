
const express = require('express');
const Carrito = require('../modelos/Carrito.js');

const router = express.Router();

// Agregar o actualizar producto en el carrito
router.post('/agregar', async (req, res) => {
  const { usuarioId, producto } = req.body;
    console.log('Producto a agregar:', producto);
  console.log('Usuario ID:', usuarioId);
  try {
    let carrito = await Carrito.findOne({ usuario: usuarioId });

    if (!carrito) {
      carrito = new Carrito({ usuario: usuarioId, productos: [producto] });
    } else {
      const index = carrito.productos.findIndex(p =>
        p.idProducto.toString() === producto.idProducto &&
        p.mililitros === producto.mililitros
      );

      if (index !== -1) {
        carrito.productos[index].cantidad += producto.cantidad;
      } else {
        carrito.productos.push(producto);
      }
    }

    await carrito.save();
    res.status(200).json(carrito);
  } catch (err) {
    res.status(500).json({ error: 'Error al agregar al carrito' });
  }
});

// Actualizar cantidad de un producto
router.patch('/actualizar', async (req, res) => {
  const { usuarioId, idProducto, mililitros, nuevaCantidad } = req.body;

  try {
    const carrito = await Carrito.findOne({ usuario: usuarioId });
    if (!carrito) return res.status(404).json({ error: 'Carrito no encontrado' });

    const index = carrito.productos.findIndex(p =>
      p.idProducto.toString() === idProducto && p.mililitros === mililitros
    );
    if (index === -1) return res.status(404).json({ error: 'Producto no encontrado' });

    carrito.productos[index].cantidad = nuevaCantidad;
    await carrito.save();

    res.json(carrito);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar' });
  }
});

// Eliminar un producto
router.delete('/eliminar', async (req, res) => {
  const { usuarioId, idProducto, mililitros } = req.body;

  try {
    const carrito = await Carrito.findOne({ usuario: usuarioId });
    if (!carrito) return res.status(404).json({ error: 'Carrito no encontrado' });

    carrito.productos = carrito.productos.filter(p =>
      !(p.idProducto.toString() === idProducto && p.mililitros === mililitros)
    );

    await carrito.save();
    res.json(carrito);
  } catch (err) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
});

router.get('/productos/:usuarioId', async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const carrito = await Carrito.findOne({ usuario: usuarioId });
    if (!carrito) return res.status(404).json({ error: 'Carrito no encontrado' });
    res.json(carrito.productos);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener productos del carrito' });
  }
}
);

module.exports = router;
