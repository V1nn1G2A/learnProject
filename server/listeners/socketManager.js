const userListener = require('./userListener');
const dialogListener = require('./dialogListener');
const messageListener = require('./messageListener');
const authorizationListener = require('./authriaztionListener');

const socketManager = (socket) => {
  console.log('Socket connected:', socket.id);

  userListener(socket);
  dialogListener(socket);
  messageListener(socket);
  authorizationListener(socket);

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
};

module.exports = socketManager;
