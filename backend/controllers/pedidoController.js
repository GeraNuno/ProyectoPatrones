const Pedido = require('../modelos/Pedidos');
const Carrito = require('../modelos/Carrito');
const Producto = require('../modelos/Productos');

const crearPedido = async (req, res) => {
  const { usuarioId, direccionEnvio, telefono, total } = req.body;

  try {
    const carrito = await Carrito.findOne({ usuario: usuarioId }).populate('productos.idProducto');

    if (!carrito || carrito.productos.length === 0) {
      return res.status(400).json({ error: 'Carrito vacío o no encontrado' });
    }

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
          imagen: presentacion.imagenesProducto[0],
        },
        cantidad: item.cantidad,
      };
    });

    const nuevoPedido = new Pedido({
      usuario: usuarioId,
      productos: productosPedido,
      total,
      direccionEnvio,
      telefono,
    });

    await nuevoPedido.save();

    await Carrito.findByIdAndDelete(carrito._id);

    res.status(201).json(nuevoPedido);
  } catch (err) {
    console.error('Error al crear el pedido:', err);
    res.status(500).json({ error: 'Error al crear el pedido' });
  }
};

const pedidosUsuario = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const pedidos = await Pedido.find({ usuario: usuarioId }).sort({ createdAt: -1 });
    res.status(200).json(pedidos);
  } catch (err) {
    console.error('Error al obtener los pedidos:', err);
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
};

const detallesPedido = async (req, res) => {
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
};

const pedidosAdmin = async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate('usuario', 'nombre')
      .sort({ createdAt: -1 });

    res.status(200).json(pedidos);
  } catch (err) {
    console.error('Error al obtener los pedidos:', err);
    res.status(500).json({ error: 'Error al obtener los pedidos' });
  }
};

const actualizarEstado = async (req, res) => {
  const { pedidoId } = req.params;
  const { estado } = req.body;

  try {
    const pedido = await Pedido.findById(pedidoId);

    if (!pedido) {
      return res.status(404).json({ mensaje: 'Pedido no encontrado' });
    }

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

    pedido.estadoPedido = estado;
    const pedidoActualizado = await pedido.save();

    res.json(pedidoActualizado);
  } catch (err) {
    console.error('Error al actualizar el estado del pedido:', err);
    res.status(500).json({ error: 'Error al actualizar el estado del pedido' });
  }
};

module.exports = {
    crearPedido,
    pedidosUsuario,
    detallesPedido,
    pedidosAdmin,
    actualizarEstado,
};