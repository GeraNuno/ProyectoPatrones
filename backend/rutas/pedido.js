const express = require('express');
const router = express.Router();
const Pedido = require('../modelos/Pedidos');
const Carrito = require('../modelos/Carrito');
const Producto = require('../modelos/Productos');

router.post('/crearPedido', async (req, res) => {
    const { usuarioId, direccionEnvio, telefono, total } = req.body;

    try {
        // Buscar el carrito del usuario y poblar los productos
        const carrito = await Carrito.findOne({ usuario: usuarioId }).populate('productos.idProducto');

        if (!carrito || carrito.productos.length === 0) {
            return res.status(400).json({ error: 'Carrito vacío o no encontrado' });
        }

        // Transformar los productos del carrito al formato que va en el pedido
        const productosPedido = carrito.productos.map(item => {
            const prod = item.idProducto;
            const presentacion = prod.presentaciones[item.tipoPresentacion];

            return {
                producto: {
                    _id: prod._id,
                    nombre: prod.nombreProducto,
                    marca: prod.nombreMarca,
                    mililitros: presentacion.mililitros,
                    precio: presentacion.precio,
                    imagen: presentacion.imagenesProducto[0], // si está dentro de presentaciones
                },
                cantidad: item.cantidad,
            };
        });

        // Crear el nuevo pedido con snapshot de productos
        const nuevoPedido = new Pedido({
            usuario: usuarioId,
            productos: productosPedido,
            total,
            direccionEnvio,
            telefono,
        });

        await nuevoPedido.save();

        // Eliminar el carrito después de crear el pedido
        await Carrito.findByIdAndDelete(carrito._id);

        res.status(201).json(nuevoPedido);
    } catch (err) {
        console.error('Error al crear el pedido:', err);
        res.status(500).json({ error: 'Error al crear el pedido' });
    }
});

router.get('/pedidosUsuario/:usuarioId', async (req, res) => {
    const { usuarioId } = req.params;

    try {
        const pedidos = await Pedido.find({ usuario: usuarioId })
            .sort({ createdAt: -1 }); // Ordenar por fecha de creación descendente

        res.status(200).json(pedidos);
    } catch (err) {
        console.error('Error al obtener los pedidos:', err);
        res.status(500).json({ error: 'Error al obtener los pedidos' });
    }
});

router.get('/detallesPedido/:pedidoId', async (req, res) => {
    const { pedidoId } = req.params;
    try {
        const pedido = await Pedido.findById(pedidoId);

        if (!pedido) {
        return res.status(404).json({ mensaje: 'Pedido no encontrado' });
        }

        res.json(pedido);
    } catch (err) {
        console.error('Error al obtener el pedido:', err);
        res.status(500).json({ error: 'Error al obtener el pedido' });
    }
});

router.get('/pedidosAdmin', async (req, res) => {
    try {
        const pedidos = await Pedido.find()
            .populate('usuario', 'nombre')
            .sort({ createdAt: -1 }); // Ordenar por fecha de creación descendente

        res.status(200).json(pedidos);
    } catch (err) {
        console.error('Error al obtener los pedidos:', err);
        res.status(500).json({ error: 'Error al obtener los pedidos' });
    }
}
);

router.patch('/actualizarEstado/:pedidoId', async (req, res) => {
  const { pedidoId } = req.params;
  const { estado } = req.body;

  try {
    // Buscar el pedido original
    const pedido = await Pedido.findById(pedidoId);

    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

    // Si el nuevo estado es "Entregado", actualiza el stock
    if (estado === 'Entregado' && pedido.estadoPedido !== 'Entregado') {
      for (const item of pedido.productos) {
        const { _id: productoId, mililitros } = item.producto;
        const cantidadVendida = item.cantidad;

        const producto = await Producto.findById(productoId);

        if (!producto) continue;

        const presentacion = producto.presentaciones.find(p => p.mililitros === mililitros);
        if (presentacion) {
          presentacion.stockProducto = Math.max(0, presentacion.stockProducto - cantidadVendida);
          await producto.save();
        }
      }
    }

    // Actualiza el estado del pedido
    pedido.estadoPedido = estado;
    const pedidoActualizado = await pedido.save();

    res.json(pedidoActualizado);
  } catch (err) {
    console.error('Error al actualizar el estado del pedido:', err);
    res.status(500).json({ error: 'Error al actualizar el estado del pedido' });
  }
});


module.exports = router;
