const mongoose = require('mongoose');

const marcaSchema = new mongoose.Schema({
    nombreMarca: { type: String, required: true },
    descripcion: { type: String, required: true },
    imgMarca: { type: String, required: true },
    imgFragH: { type: String, required: true },
    imgFragM: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Marca', marcaSchema);