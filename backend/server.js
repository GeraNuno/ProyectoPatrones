const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const cors = require('cors');
const socketIO = require('socket.io');

//Rutas
const authRoutes = require('./rutas/auth');
const marcasRoutes = require('./rutas/marcas');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
  },
});

require('./socket')(io);

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/marca', marcasRoutes);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB conectado');
    server.listen(process.env.PORT || 5000, () =>
      console.log(`Servidor backend corriendo en puerto ${process.env.PORT}...`)
    );
  })
  .catch((err) => console.error(err));
