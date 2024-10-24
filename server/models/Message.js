const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dialogId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
