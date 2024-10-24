const express = require('express');
const authorizationController = require('../controllers/authorizationController');

const router = express.Router();

router.post('/login', authorizationController.login);
router.post('/register', authorizationController.register);

module.exports = router;
