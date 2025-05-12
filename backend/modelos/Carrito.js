const mongoose = require('mongoose');

const productoCarritoSchema = new mongoose.Schema({
    idProducto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true,
    },
    nombreProducto: String,
    mililitros: Number,
    precioProducto: Number,
    imagenProducto: String,
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