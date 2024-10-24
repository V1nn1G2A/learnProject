
const mongoose = require('mongoose');
const Message = require('../models/Message');
const Dialog = require('../models/Dialog');

const createMessage = async (req, res) => {
  try {
    const { content, senderId, dialogId } = req.body;

    if (!content || !senderId || !dialogId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    

    const message = new Message({
      content,
      senderId: new mongoose.ObjectId(senderId),
      dialogId: new mongoose.ObjectId(dialogId),
    });

    const savedMessage = await message.save();

    await Dialog.findByIdAndUpdate(dialogId, {
      $push: { messages: savedMessage._id },
      $set: { lastMessage: savedMessage._id },
      updatedAt: new Date(),
    });

    console.log('Message created:', savedMessage);
    res.status(201).json(savedMessage);
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: error.message });
  }
};

const getMessagesByDialogId = async (req, res) => {
  try {
    const dialogId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(dialogId)) {
      return res.status(400).json({ message: 'Invalid dialog ID' });
    }

    const messages = await Message.find({ dialogId: new mongoose.Types.ObjectId(dialogId) });

    console.log('Messages retrieved:', messages);
    res.status(200).json(messages);
  } catch (error) {
    console.error('Error retrieving messages:', error);
    res.status(500).json({ message: error.message });
  }
};

const updatedMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id) || !content) {
      return res.status(400).json({ message: 'Invalid message ID or content' });
    }

    const updatedMessage = await Message.findByIdAndUpdate(id, { content, updatedAt: new Date() }, { new: true });

    if (!updatedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    console.log('Message updated:', updatedMessage);
    res.status(200).json(updatedMessage);

  } catch (error) {
    console.error('Error updating message:', error);
    res.status(500).json({ message: error.message });
  }
}; 

const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid message ID' });
    }

    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ message: 'Message not found' });
    }

    await Dialog.findByIdAndUpdate(deletedMessage.dialogId, {
      $pull: { messages: id },
    });

    console.log('Message deleted:', deletedMessage);
    res.status(200).json(deletedMessage);
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ message: error.message });
  }
};

const createMessageSocket = async (data) => {
  try {
    const { content, senderId, dialogId } = data;

    const message = new Message({
      content,
      senderId: new mongoose.Types.ObjectId(senderId),
      dialogId: new mongoose.Types.ObjectId(dialogId),
      createdAt: new Date(),
    });

    const savedMessage = await message.save();

    await Dialog.findByIdAndUpdate(dialogId, {
      $push: { messages: savedMessage._id },
      lastMessage: savedMessage._id,
      updatedAt: new Date(),
    });

    return await Message.findById(savedMessage._id).populate("senderId");
  } catch (error) {
    throw error;
  }
};

// Получение сообщений по ID диалога для WebSocket
const getMessagesByDialogIdSocket = async (dialogId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(dialogId)) {
      throw new Error("Invalid dialog ID");
    }

    const messages = await Message.find({ dialogId: dialogId }).populate("senderId").sort({ createdAt: 1 });
    return messages;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createMessage,
  getMessagesByDialogId,
  updatedMessage,
  deleteMessage,
  createMessageSocket, // Добавляем этот метод
  getMessagesByDialogIdSocket, // Добавляем этот метод
}