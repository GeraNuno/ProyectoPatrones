const mongoose = require('mongoose');

const productosSchema = new mongoose.Schema({
  nombreProducto: { type: String, required: true },
  nombreMarca: { type: String, required: true },
  lineaProducto: { type: String, required: true },
  presentaciones: [
    {
      mililitros: { type: Number, required: true },
      precio: { type: Number, required: true },
      imagenesProducto: { type: [String], required: true },
      stockProducto: { type: Number, required: true },
    }
  ],
}, { timestamps: true })


module.exports = mongoose.model('Productos', productosSchema);