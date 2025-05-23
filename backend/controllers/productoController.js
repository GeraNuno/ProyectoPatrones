const Producto = require('../modelos/Productos');
const cloudinary = require('../config/cloudinary');

const registroProducto = async (req, res) => {
  try {
    const { nombreProducto, marcaProducto, lineaProducto, presentaciones } = req.body;

    if (!presentaciones) {
      return res.status(400).json({ error: "Presentaciones requeridas" });
    }

    const parsedPresentaciones = JSON.parse(presentaciones);

    // Agrupar archivos por nombre (ej: imagenesPresentaciones_0)
    const imagenesPorIndice = {};
    for (const file of req.files) {
      const match = file.fieldname.match(/imagenesPresentaciones_(\d+)/);
      if (match) {
        const index = match[1];
        if (!imagenesPorIndice[index]) {
          imagenesPorIndice[index] = [];
        }
        imagenesPorIndice[index].push(file);
      }
    }

    // Subir imágenes por presentación
    const presentacionesFinal = await Promise.all(
      parsedPresentaciones.map(async (pres, index) => {
        const files = imagenesPorIndice[index] || [];

        const urls = await Promise.all(
          files.map(file => {
            return new Promise((resolve, reject) => {
              const stream = cloudinary.uploader.upload_stream(
                { resource_type: "image", folder: "Vynce" },
                (error, result) => {
                  if (error) return reject(error);
                  resolve(result.secure_url);
                }
              );
              stream.end(file.buffer);
            });
          })
        );

        return {
          mililitros: pres.mililitros,
          precio: pres.precio,
          stockProducto: pres.stockProducto,
          imagenesProducto: urls
        };
      })
    );

    const nuevoProducto = new Producto({
      nombreProducto,
      nombreMarca: marcaProducto,
      lineaProducto,
      presentaciones: presentacionesFinal
    });

    await nuevoProducto.save();

    res.status(201).json({ message: 'Producto registrado con éxito', producto: nuevoProducto });

  } catch (error) {
    console.error('Error al registrar producto:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

const listaProductos = async (req, res) => {
  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const productosCliente = async (req, res) => {
  const { nombreLinea } = req.params;
  try {
    const productos = await Producto.find({ lineaProducto: nombreLinea });
    res.status(200).json(productos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const productoPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const producto = await Producto.findById(id);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    res.status(200).json(producto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const actualizarPresentacion = async (req, res) => {
  const { idProducto, idPresentacion, precio, stockProducto } = req.body;
  try {
    const producto = await Producto.findById(idProducto);
    if (!producto) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    const presentacion = producto.presentaciones.id(idPresentacion);
    if (!presentacion) {
      return res.status(404).json({ message: 'Presentación no encontrada' });
    }
    presentacion.precio = precio;
    presentacion.stockProducto = stockProducto;
    await producto.save();
    res.status(200).json({ message: 'Presentación actualizada con éxito', producto });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

module.exports = {
  registroProducto,
  listaProductos,
  productosCliente,
  productoPorId,
  actualizarPresentacion
};
