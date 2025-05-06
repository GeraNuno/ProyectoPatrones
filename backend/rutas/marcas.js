const express = require('express');
const multer = require('multer');

const Marca = require('../modelos/Marca');
const router = express.Router();
const cloudinary = require('../config/cloudinary');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/registro', upload.fields([
    { name: 'imgMarca', maxCount: 1 },
    { name: 'imgFragH', maxCount: 1 },
    { name: 'imgFragM', maxCount: 1 }
  ]), async (req, res) => {
    try {
      const { nombreMarca, descripcion } = req.body;
      const { imgMarca, imgFragH, imgFragM } = req.files;
  
      if (!nombreMarca || !descripcion || !imgMarca || !imgFragH || !imgFragM) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
      }
  
      const uploadImage = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { resource_type: 'image', folder: `Vynce` },
            (error, result) => {
              if (error) return reject(error);
              resolve(result.secure_url);
            }
          );
          stream.end(buffer);
        });
      };
  
      const uploadedImgMarca = await uploadImage(imgMarca[0].buffer);
      const uploadedImgFragH = await uploadImage(imgFragH[0].buffer);
      const uploadedImgFragM = await uploadImage(imgFragM[0].buffer);
  
      const nuevaMarca = new Marca({
        nombreMarca,
        descripcion,
        imgMarca: uploadedImgMarca,
        imgFragH: uploadedImgFragH,
        imgFragM: uploadedImgFragM,
      });
  
      await nuevaMarca.save();
      res.status(201).json({ message: 'Marca registrada con éxito', marca: nuevaMarca });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  });

router.get('/listaMarcas', async (req, res) => {
    try {
        const marcas = await Marca.find();
        res.status(200).json(marcas);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});
  

module.exports = router;
