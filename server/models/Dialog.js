const mongoose = require('mongoose');

const dialogSchema = new mongoose.Schema({
  participants: {
    type: [mongoose.Schema.Types.ObjectId],
    required: true,
  },
  messages: {
    type: [mongoose.Schema.Types.ObjectId],
    default: [],
  },
  title: {
    type: String,
    default: null,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
  lastMessage: {
    content: {
      type: String,
      default: null,
      required: true,
    },
    sender: {
      type: String,
      required: true,
    },
  },
});

const Dialog = mongoose.model('Dialog', dialogSchema);

module.exports = Dialog;
