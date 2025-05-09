const express = require('express');
const multer = require('multer');
const Producto = require('../modelos/Productos');
const router = express.Router();
const cloudinary = require('../config/cloudinary');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/registroProducto', upload.fields([{ name: 'imagenesProducto' }]), async (req, res) => {
    try {
        const files = req.files['imagenesProducto'];

        if (!files || files.length === 0) {
            return res.status(400).json({ error: "Imagenes requeridas" });
        }

        // Subimos todas las imágenes con Promise.all
        const uploadPromises = files.map(file => {
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
        });

        const urls = await Promise.all(uploadPromises);

        // Crear el producto con las URLs
        const nuevoProducto = new Producto({
            nombreProducto: req.body.nombreProducto,
            nombreMarca: req.body.marcaProducto,
            lineaProducto: req.body.lineaProducto,
            precioProducto: req.body.precioProducto,
            stockProducto: req.body.stockProducto,
            imagenesProducto: urls
        });

        await nuevoProducto.save();
        res.status(201).json({ message: 'Producto registrado con éxito', producto: nuevoProducto });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

router.get('/listaProductos', async (req, res) => {
    try {
        const productos = await Producto.find();
        res.status(200).json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

router.get('/productosCliente/:nombreLinea', async (req, res) => {
    const { nombreLinea } = req.params;
    try {
        const productos = await Producto.find({ lineaProducto: nombreLinea });
        res.status(200).json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});
module.exports = router;