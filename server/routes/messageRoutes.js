const express = require('express');
const messageController = require('../controllers/messageController');

const router = express.Router();

router.get('/:dialogId', messageController.getMessagesByDialogId);
router.post('/', messageController.createMessage);
router.delete('/:id', messageController.deleteMessage);
router.patch('/:id', messageController.updatedMessage);

module.exports = router;