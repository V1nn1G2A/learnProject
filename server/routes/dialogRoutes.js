const express = require('express');
const dialogController = require('../controllers/dialogController');

const router = express.Router();

router.get('/', dialogController.getAllDialogs);
router.get('/:id', dialogController.getDialogById);
router.post('/', dialogController.createDialogs);

module.exports = router;
