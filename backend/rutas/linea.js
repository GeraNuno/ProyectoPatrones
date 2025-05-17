const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

const lineasController = require('../controllers/lineasController');

router.post('/registroLinea', upload.fields([{ name: 'imgBanner' }]), lineasController.registrarLinea);
router.get('/lineas/:nombreMarca/:tipoLinea', lineasController.obtenerLineasPorMarcaYTipo);
router.get('/listaLineas', lineasController.listarLineasActivas);
router.get('/lineasPorMarca/:nombreMarca', lineasController.obtenerLineasPorMarca);
router.get('/lineas/:nombreLinea', lineasController.obtenerImgBannerPorLinea);

module.exports = router;
