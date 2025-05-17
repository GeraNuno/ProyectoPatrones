const mongoose = require('mongoose');

const pedidoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    },
    productos: [
        {
            producto: {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Producto',
                    required: true,
                },
                nombre: String,
                marca: String,
                mililitros: Number,
                precio: Number,
                imagen: String,
            },
            cantidad: {
                type: Number,
                required: true,
                min: 1,
            },
        },
    ],
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
        match: /^[0-9]{10}$/,
    },
    estadoPedido: {
        type: String,
        enum: ['Pendiente', 'Aceptado', 'Entregado', 'Cancelado'],
        default: 'Pendiente',
    },
}, { timestamps: true });

module.exports = mongoose.model('Pedido', pedidoSchema);
