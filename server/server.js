// server.js
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');

const connectDB = require('./config/db');

const userRouter = require('./routes/userRoutes');
const dialogRouter = require('./routes/dialogRoutes');
const messageRouter = require('./routes/messageRoutes');
const authorizationRouter = require('./routes/authorizationRoutes');

const socketManager = require('./listeners/socketManager');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

connectDB();

app.use('/users', userRouter);
app.use('/dialogs', dialogRouter);
app.use('/messages', messageRouter);
app.use('/auth', authorizationRouter);

const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socketManager(socket);
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
