const mongoose = require('mongoose');
const Message = require('../models/Message');
const Dialog = require('../models/Dialog');

const messageListeners = (socket) => {
  // Слушаем создание нового сообщения
  socket.on('createMessage', async (data) => {
    try {
      const { content, senderId, dialogId } = data;

      if (!content || !senderId || !dialogId) {
        console.log('All fields are required', data);
        socket.emit("error", { type: 'messageCreateError', message: 'All fields are required' });
        return;
      }

      if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(dialogId)) {
        console.log('Invalid sender ID or dialog ID');
        socket.emit("error", { type: 'messageCreateError', message: 'Invalid sender ID or dialog ID' });
        return;
      }

      const message = new Message({
        content,
        senderId: new mongoose.Types.ObjectId(senderId),
        dialogId: new mongoose.Types.ObjectId(dialogId),
      });

      const savedMessage = await message.save();

      await Dialog.findByIdAndUpdate(dialogId, {
        $push: { messages: savedMessage._id },
        $set: { lastMessage: { content: savedMessage.content, sender: savedMessage.senderId } },
        updatedAt: new Date(),
      });

      console.log('Message created:', savedMessage);
      socket.emit('messageCreated', savedMessage);
    } catch (error) {
      console.error('Error creating message:', error);
      socket.emit("error", { type: 'messageCreateError', message: error.message });
    }
  });

  // Слушаем запрос на получение сообщений по ID диалога
  socket.on('getMessagesByDialogId', async (data) => {
    try {
      const { dialogId } = data;

      if (!mongoose.Types.ObjectId.isValid(dialogId)) {
        socket.emit("error", { type: 'messagesFetchError', message: 'Invalid dialog ID' });
        return;
      }

      const messages = await Message.find({ dialogId: new mongoose.Types.ObjectId(dialogId) });

      console.log('Messages retrieved:', messages);
      socket.emit('messagesFetched', messages);
    } catch (error) {
      console.error('Error retrieving messages:', error);
      socket.emit("error", { type: 'messagesFetchError', message: error.message });
    }
  });

  // Слушаем запрос на обновление сообщения
  socket.on('updateMessage', async (data) => {
    try {
      const { id, content } = data;

      if (!mongoose.Types.ObjectId.isValid(id) || !content) {
        socket.emit("error", { type: 'messageUpdateError', message: 'Invalid message ID or content' });
        return;
      }

      const updatedMessage = await Message.findByIdAndUpdate(id, {
        content,
        updatedAt: new Date(),
      }, { new: true });

      if (!updatedMessage) {
        socket.emit("error", { type: 'messageUpdateError', message: 'Message not found' });
        return;
      }

      console.log('Message updated:', updatedMessage);
      socket.emit('messageUpdated', updatedMessage);
    } catch (error) {
      console.error('Error updating message:', error);
      socket.emit("error", { type: 'messageUpdateError', message: error.message });
    }
  });

  // Слушаем запрос на удаление сообщения
  socket.on('deleteMessage', async (data) => {
    try {
      const { id } = data;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        socket.emit("error", { type: 'messageDeleteError', message: 'Invalid message ID' });
        return;
      }

      const deletedMessage = await Message.findByIdAndDelete(id);

      if (!deletedMessage) {
        socket.emit("error", { type: 'messageDeleteError', message: 'Message not found' });
        return;
      }

      await Dialog.findByIdAndUpdate(deletedMessage.dialogId, {
        $pull: { messages: id },
      });

      console.log('Message deleted:', deletedMessage);
      socket.emit('messageDeleted', deletedMessage);
    } catch (error) {
      console.error('Error deleting message:', error);
      socket.emit("error", { type: 'messageDeleteError', message: error.message });
    }
  });
};

module.exports = messageListeners;
