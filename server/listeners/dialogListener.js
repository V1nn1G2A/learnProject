const mongoose = require('mongoose');
const Dialog = require('../models/Dialog');

const dialogListeners = (socket) => {
  // Слушаем запрос на получение всех диалогов
  socket.on('getAllDialogs', async () => {
    try {
      const dialogs = await Dialog.find().populate("lastMessage participants");
      console.log("Dialogs fetched:", dialogs);
      socket.emit("dialogsFetched", dialogs);
    } catch (error) {
      console.error("Error fetching dialogs:", error);
      socket.emit("error", { type: 'dialogsFetchError', message: error.message });
    }
  });

  // Слушаем запрос на создание диалога
  socket.on('createDialog', async (data) => {
    try {
      const { participants } = data;

      if (!participants || participants.length === 0) {
        socket.emit("error", { type: 'dialogCreationError', message: 'Participants are required' });
        return;
      }

      const dialog = new Dialog({
        participants: participants.map(p => new mongoose.ObjectId(p)),
        createdAt: new Date(),
      });

      const savedDialog = await dialog.save();
      console.log("Dialog created:", savedDialog);
      socket.emit("dialogCreated", savedDialog);
    } catch (error) {
      console.error("Error creating dialog:", error);
      socket.emit("error", { type: 'dialogCreationError', message: error.message });
    }
  });

  // Слушаем запрос на получение диалога по ID
  socket.on('getDialogById', async (data) => {
    try {
      const { id } = data;

      if (!mongoose.Types.ObjectId.isValid(id)) {
        socket.emit("error", { type: 'dialogFetchError', message: 'Invalid dialog ID' });
        return;
      }

      const dialog = await Dialog.findById(id).populate("lastMessage participants");

      if (!dialog) {
        socket.emit("error", { type: 'dialogFetchError', message: 'Dialog not found' });
        return;
      }

      console.log("Dialog fetched:", dialog);
      socket.emit("dialogFetched", dialog);
    } catch (error) {
      console.error("Error fetching dialog:", error);
      socket.emit("error", { type: 'dialogFetchError', message: error.message });
    }
  });
};

module.exports = dialogListeners;
