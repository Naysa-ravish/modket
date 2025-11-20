const { Server } = require('socket.io');

const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    socket.on('registerUser', (userId) => {
      socket.join(`user:${userId}`);
    });

    socket.on('joinProductRoom', (productId) => {
      socket.join(`product:${productId}`);
    });

    socket.on('leaveProductRoom', (productId) => {
      socket.leave(`product:${productId}`);
    });

    socket.on('disconnect', () => {});
  });

  return io;
};

module.exports = initSocket;

