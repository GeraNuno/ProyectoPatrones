const express = require('express');
const multer = require('multer');
const marcaController = require('../controllers/marcaController');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/registro',
  upload.fields([
    { name: 'imgMarca', maxCount: 1 },
    { name: 'imgFragH', maxCount: 1 },
    { name: 'imgFragM', maxCount: 1 }
  ]),
  marcaController.registroMarca
);

router.get('/listaMarcas', marcaController.listaMarcas);

router.get('/nombreMarcas', marcaController.nombreMarcas);

module.exports = router;
