const mongoose = require('mongoose');

const productosSchema = new mongoose.Schema({
    nombreProducto: { type: String, required: true },
    nombreMarca: { type: String, required: true },
    lineaProducto: { type: String, required: true },
    precioProducto: { type: Number, required: true },
    stockProducto: { type: Number, required: true },
    imagenesProducto: { type: [String], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Productos', productosSchema);