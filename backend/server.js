const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const http = require('http');
const cors = require('cors');
const socketIO = require('socket.io');


dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*',
  },
});

require('./socket')(io);

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB conectado');
    server.listen(process.env.PORT || 5000, () =>
      console.log('Servidor backend corriendo...')
    );
  })
  .catch((err) => console.error(err));
