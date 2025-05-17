const express = require('express');
const multer = require('multer');
const router = express.Router();
const productoController = require('../controllers/productoController');


const upload = multer({ storage: multer.memoryStorage() });

router.post('/registroProducto', upload.any(), productoController.registroProducto);
router.get('/listaProductos', productoController.listaProductos);
router.get('/productosCliente/:nombreLinea', productoController.productosCliente);
router.get('/productos/:id', productoController.productoPorId);
router.patch('/actualizarPresentacion', productoController.actualizarPresentacion);

module.exports = router;
