const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    carrito: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Carrito',
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    direccionEnvio: {
        direccion: { type: String, required: true },
        colonia: { type: String, required: true },
        ciudad: { type: String, required: true },
        estado: { type: String, required: true },
    },
    telefono: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/, // ejemplo para México
    },
    estadoPedido: {
        type: String,
        enum: ['Pendiente', 'Enviado', 'Entregado'],
        default: 'Pendiente',
    },
}, { timestamps: true });

module.exports = mongoose.model('Pedido', pedidoSchema);