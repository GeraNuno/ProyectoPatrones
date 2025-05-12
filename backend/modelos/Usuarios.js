const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    aPaterno: { type: String, required: true },
    aMaterno: { type: String, required: true },
    correo: { type: String, required: true, unique: true },
    password: { type: String, required: true},
    rolUsuario: { type: String, enum: ['admin', 'user'], default: 'user' },
    telefono: { type: String },
}, timestamps= true);

module.exports = mongoose.model('Usuario', userSchema);