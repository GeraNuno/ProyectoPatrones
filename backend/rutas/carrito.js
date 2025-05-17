const express = require('express');
const router = express.Router();
const carritoController = require('../controllers/carritoController');

router.post('/agregar', carritoController.agregarProducto);
router.patch('/actualizar', carritoController.actualizarCantidad);
router.delete('/eliminar', carritoController.eliminarProducto);
router.get('/productos/:usuarioId', carritoController.obtenerProductos);
router.get('/datosCarrito/:idCarrito', carritoController.obtenerDatosCarrito);
router.get('/obtenerIdCarrito/:usuarioId', carritoController.obtenerIdCarrito);

module.exports = router;
