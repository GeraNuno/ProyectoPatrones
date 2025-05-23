const mongoose = require('mongoose');

const productoCarritoSchema = new mongoose.Schema({
    idProducto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Productos',
        required: true,
    },
    tipoPresentacion: {
        type: Number, // el índice de la presentación en el array `presentaciones`
        required: true,
    },
    cantidad: {
        type: Number,
        default: 1,
        min: 1,
    },
});

const carritoSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
        unique: true,
    },
    productos: [productoCarritoSchema],
    actualizadoEn: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Carrito', carritoSchema);
