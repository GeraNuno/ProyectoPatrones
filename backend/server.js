require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const cors = require('cors');

// Importar rutas
const authRoutes = require('./rutas/auth');
const marcasRoutes = require('./rutas/marcas');
const lineasRoutes = require('./rutas/linea');
const productosRoutes = require('./rutas/productos');
const carritoRoutes = require('./rutas/carrito');
const pedidosRoutes = require('./rutas/pedido');

const app = express();
const server = http.createServer(app);

// Configurar CORS (ajusta origen en producción)
app.use(cors({
  origin: '*',
  methods: '*',
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware para parsear cuerpo de solicitudes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rutas de la API
app.use('/auth', authRoutes);
app.use('/marca', marcasRoutes);
app.use('/linea', lineasRoutes);
app.use('/producto', productosRoutes);
app.use('/carrito', carritoRoutes);
app.use('/pedido', pedidosRoutes);

// Middleware para rutas no encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware global para manejo de errores
app.use((err, req, res, next) => {
  console.error('Error global:', err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Conectar a MongoDB y arrancar servidor
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
.then(() => {
  console.log('Conexión a MongoDB exitosa');
  server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
})
.catch(err => {
  console.error('Error conectando a MongoDB:', err);
});
