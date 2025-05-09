const mongoose = require('mongoose');

const lineasSchema = new mongoose.Schema({
    nombreLinea: { type: String, required: true },
    nombreMarca: { type: String, required: true },
    tipoLinea: { type: String, required: true },
    imgBanner: { type: String, required: true },
    estatus: { type: String, default: 'ACTIVO' },
}, { timestamps: true });

module.exports = mongoose.model('Lineas', lineasSchema);