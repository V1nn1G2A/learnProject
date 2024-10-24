const bcrypt = require('bcrypt');
const User = require('../models/User');
const mongoose = require('mongoose');

const userListeners = (socket) => {
  socket.on('getAllUsers', async () => {
    try {
      const users = await User.find();
      console.log('Users found:', users);
      socket.emit('usersFetched', users);
    } catch (error) {
      console.error('Error retrieving users:', error);
      socket.emit("error", { type: 'usersFetchError', message: 'Failed to fetch users' });
    }
  });

  socket.on('createUser', async (data) => {
    try {
      const { username, email, password } = data;

      if (!username) {
        socket.emit("error", { type: 'userCreationError', message: 'Missing username' });
        return;
      }

      if (!email) {
        socket.emit("error", { type: 'userCreationError', message: 'Missing email' });
        return;
      }

      if (!password) {
        socket.emit("error", { type: 'userCreationError', message: 'Missing password' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });

      const savedUser = await newUser.save();
      console.log('User created:', savedUser);
      socket.emit('userCreated', savedUser);
    } catch (error) {
      console.error('Error creating user:', error);
      socket.emit("error", { type: 'userCreationError', message: error.message });
    }
  });

  socket.on('getUserById', async (data) => {
    try {
      const { id } = data;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        socket.emit("error", { type: 'userFetchError', message: 'Invalid user ID' });
        return;
      }

      const user = await User.findById(id);
      if (!user) {
        socket.emit("error", { type: 'userFetchError', message: 'User not found' });
        return;
      }

      console.log('User found:', user);
      socket.emit('userFetched', user);
    } catch (error) {
      console.error('Error retrieving user:', error);
      socket.emit("error", { type: 'userFetchError', message: error.message });
    }
  });

  socket.on('updateUser', async (data) => {
    try {
      const { id, username, email, password } = data;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        socket.emit("error", { type: 'userUpdateError', message: 'Invalid user ID' });
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const updatedUser = await User.findByIdAndUpdate(id, {
        username,
        email,
        password: hashedPassword,
      }, { new: true });

      if (!updatedUser) {
        socket.emit("error", { type: 'userUpdateError', message: 'User not found' });
        return;
      }

      console.log('User updated:', updatedUser);
      socket.emit('userUpdated', updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      socket.emit("error", { type: 'userUpdateError', message: error.message });
    }
  });

  // Слушаем запрос на удаление пользователя
  socket.on('deleteUser', async (data) => {
    try {
      const { id } = data;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        socket.emit("error", { type: 'userDeleteError', message: 'Invalid user ID' });
        return;
      }

      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        socket.emit("error", { type: 'userDeleteError', message: 'User not found' });
        return;
      }

      console.log('User deleted:', deletedUser);
      socket.emit('userDeleted', deletedUser);
    } catch (error) {
      console.error('Error deleting user:', error);
      socket.emit("error", { type: 'userDeleteError', message: error.message });
    }
  });
};

module.exports = userListeners;
