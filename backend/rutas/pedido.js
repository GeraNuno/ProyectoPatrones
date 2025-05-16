const express = require('express');
const Pedido = require('../modelos/Pedidos.js');
const Carrito = require('../modelos/Carrito.js');
const router = express.Router();

// Crear un nuevo pedido
router.post('/crearPedido', async (req, res) => {
    const { usuarioId, direccionEnvio, telefono, total } = req.body;

    try {
        // Busca el carrito del usuario
        const carrito = await Carrito.findOne({ usuario: usuarioId });

        if (!carrito) {
            return res.status(400).json({ error: 'Carrito no encontrado' });
        }

        // Crea el nuevo pedido
        const nuevoPedido = new Pedido({
            usuario: usuarioId,
            carrito: carrito._id,
            total: total,
            direccionEnvio,
            telefono,
        });

        await nuevoPedido.save();

        // eliminar el carrito después de crear el pedido
        await Carrito.findByIdAndDelete(carrito._id);

        res.status(201).json(nuevoPedido);
    } catch (err) {
        console.error('Error al crear el pedido:', err);
        res.status(500).json({ error: 'Error al crear el pedido' });
    }
});

module.exports = router;