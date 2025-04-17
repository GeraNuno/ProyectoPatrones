module.exports = (io) => {
    io.on('connection', (socket) => {
      console.log('Nuevo cliente conectado:', socket.id);
  
      socket.on('enviarTicket', (data) => {
        io.emit('nuevoTicket', data); // Enviar a todos
      });
  
      socket.on('disconnect', () => {
        console.log('Cliente desconectado');
      });
    });
  };
  