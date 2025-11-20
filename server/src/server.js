require('dotenv').config();
const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const initSocket = require('./socket');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = initSocket(server);
app.set('io', io);

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`🚀 Modket API running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server', err);
    process.exit(1);
  });

