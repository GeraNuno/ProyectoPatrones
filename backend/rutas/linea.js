const express = require('express');
const multer = require('multer');

const Linea = require('../modelos/Lineas');
const router = express.Router();
const cloudinary = require('../config/cloudinary');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/registroLinea', upload.fields([{ name: 'imgBanner' }]), async (req, res) => {
    try {
        if (!req.files || !req.files['imgBanner'] || req.files['imgBanner'].length === 0) {
            return res.status(400).json({ error: "Imagen requerida" });
        }

        const file = req.files['imgBanner'][0];

        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: "image", folder: "Vynce" },
            async (error, result) => {
                if (error) {
                    return res.status(500).json({ error: "Error al subir imagen" });
                }

                const imgBanner = result.secure_url;

                const nuevaLinea = new Linea({
                    nombreLinea: req.body.nombreLinea,
                    nombreMarca: req.body.nombreMarca,
                    tipoLinea: req.body.tipoLinea,
                    imgBanner: imgBanner,
                    estatus: 'ACTIVO'
                });

                await nuevaLinea.save();
                res.status(201).json({ message: 'Linea registrada con éxito', linea: nuevaLinea });
            }
        );

        uploadStream.end(file.buffer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

router.get('/lineas/:nombreMarca/:tipoLinea', async (req, res) => {
    const { nombreMarca, tipoLinea } = req.params;
    try {
      const lineas = await Linea.find({ nombreMarca, tipoLinea });
      res.status(200).json(lineas);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener líneas por marca' });
    }
  });

router.get('/listaLineas', async (req, res) => {
    try {
        const lineas = await Linea.find({ estatus: 'ACTIVO' });
        res.status(200).json(lineas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

router.get('/lineasPorMarca/:nombreMarca', async (req, res) => {
    const { nombreMarca } = req.params;
    try {
        const lineas = await Linea.find({ nombreMarca });
        res.status(200).json(lineas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener líneas por marca' });
    }
});

router.get('/lineas/:nombreLinea', async (req, res) => {
    const { nombreLinea } = req.params;
    try {
        const linea = await Linea.findOne({ nombreLinea }).select('imgBanner');
        if (!linea) {
            return res.status(404).json({ message: 'Línea no encontrada' });
        }
        res.status(200).json({ imgBanner: linea.imgBanner });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la línea' });
    }
});

module.exports = router;