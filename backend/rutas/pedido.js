const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');

router.post('/crearPedido', pedidoController.crearPedido);
router.get('/pedidosUsuario/:usuarioId', pedidoController.pedidosUsuario);
router.get('/detallesPedido/:pedidoId', pedidoController.detallesPedido);
router.get('/pedidosAdmin', pedidoController.pedidosAdmin);
router.patch('/actualizarEstado/:pedidoId', pedidoController.actualizarEstado);

module.exports = router;
