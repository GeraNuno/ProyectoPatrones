const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../modelos/Usuarios');
const router = express.Router();

router.post('/login', async (req, res) => {
    try{
        const { noEmpleado, password } = req.body;
        const user = await User.findOne({ noEmpleado });
        if(!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, rolUsuario: user.rolUsuario, nombre: user.nombre, aPaterno: user.aPaterno, aMaterno: user.aMaterno }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user: { nombre: user.nombre, aPaterno: user.aPaterno, aMaterno: user.aMaterno, rolUsuario: user.rolUsuario, noEmpleado: user.noEmpleado, telefono: user.telefono } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { nombre, aPaterno, aMaterno, correo, password, rolUsuario, noEmpleado, telefono } = req.body;

        const existingUser = await User.findOne({ correo });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuario ya existe' });
        }
        const existingEmployee = await User.findOne({ noEmpleado });
        if (existingEmployee) {
            return res.status(400).json({ message: 'Número de empleado ya existe' });
        }
        if (rolUsuario !== 'admin' && rolUsuario !== 'user') {
            return res.status(400).json({ message: 'Rol de usuario inválido' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
        }
        if (telefono && telefono.length < 10) {
            return res.status(400).json({ message: 'El teléfono debe tener al menos 10 dígitos' });
        }
        if (telefono && !/^\d+$/.test(telefono)) {
            return res.status(400).json({ message: 'El teléfono solo puede contener dígitos' });
        }
        if (correo && !/\S+@\S+\.\S+/.test(correo)) {
            return res.status(400).json({ message: 'Correo electrónico inválido' });
        }
        if (noEmpleado && !/^\d+$/.test(noEmpleado)) {
            return res.status(400).json({ message: 'El número de empleado solo puede contener dígitos' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            nombre,
            aPaterno,
            aMaterno,
            correo,
            password: hashedPassword,
            rolUsuario,
            noEmpleado,
            telefono
        });
        await newUser.save();
        res.status(201).json({ message: 'Usuario Registrado con Éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error' });
    }
});

module.exports = router;