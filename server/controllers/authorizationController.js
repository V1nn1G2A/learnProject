const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const authorizationController = {};

authorizationController.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ message: 'Missing username or password' });
    }

    const user = await User.findOne({ username });

    if (!user) {
      console.log('Invalid username');
      return res.status(401).json({ message: 'Invalid username' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid password');
      return res.status(401).json({ message: 'Invalid password' });
    }

    console.log('User logged in:', user);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

authorizationController.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      console.log('Missing username, email or password');
      return res
        .status(400)
        .json({ message: 'Missing username, email or password' });
    }

    const existingUser = await User.findOne({ username });
    const existingEmail = await User.findOne({ email });

    if (existingUser || existingEmail) {
      console.log('Username already exists');
      return res.status(409).json({ message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();

    console.log('User registered:', user);
    res.status(201).json(user);
  } catch (error) {
    console.error('Error registering:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
