const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/User');

const authListeners = (socket) => {
  socket.on('login', async (data) => {
    console.log('Login event received:', data);
    const { username, password } = data;
    if (!username || !password) {
      console.log('Username and password are required');
      socket.emit('error', {
        type: 'loginError',
        message: 'Username and password are required',
      });
      return;
    }

    try {
      const user = await User.findOne({ username });
      if (!user) {
        console.log('Invalid username');
        socket.emit('error', {
          type: 'loginError',
          message: 'Invalid username or password',
        });
        return;
      }
      console.log(bcrypt.compare(password, user.password));
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log('Invalid password');
        socket.emit('error', {
          type: 'loginError',
          message: 'Invalid password',
        });
        return;
      }

      console.log('User logged in:', user);
      socket.emit('success', user);
    } catch (error) {
      console.error('Error logging in:', error);
      socket.emit('error', { type: 'loginError', message: 'Failed to login' });
    }
  });

  socket.on('register', async (data) => {
    console.log('Register event received:', data);
    const { username, email, password } = data;
    if (!username || !email || !password) {
      console.log('All fields are required');
      socket.emit('error', {
        type: 'registerError',
        message: 'All fields are required',
      });
      return;
    }

    if ((await User.findOne({ email })) || (await User.findOne({ username }))) {
      console.log('User already exists');
      socket.emit('error', {
        type: 'registerError',
        message: 'User already exists',
      });
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        email,
        password: hashedPassword,
      });
      console.log('User created:', user);
      socket.emit('success', user);
    } catch (error) {
      console.error('Error registering user:', error);
      socket.emit('error', {
        type: 'registerError',
        message: 'Failed to register',
      });
    }
  });
};

module.exports = authListeners;
