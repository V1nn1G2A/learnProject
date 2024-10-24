const bcrypt = require('bcrypt');
const User = require('../models/User');
const mongoose = require('mongoose');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    console.log('Users found:', users);
    res.status(200).json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username ) {
      return res.status(400).json({ message: 'Missing username' });
    }

    if (!email) {
      return res.status(400).json({ message: 'Missing email' });
    }

    if (!password) {
      return res.status(400).json({ message: 'Missing password' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    console.log('User created:', savedUser);
    res.status(201).json(savedUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User found:', user);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ message: error.message });
  }
};

const updatedUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID or missing required fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await User.findByIdAndUpdate(id, {
      username,
      email,
      password: hashedPassword,
    }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User updated:', updatedUser);
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('User deleted:', deletedUser);
    res.status(200).json(deletedUser);
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updatedUser,
  deleteUser
}