// controllers/dialogController.js
const mongoose = require('mongoose');
const Dialog = require('../models/Dialog');

const getAllDialogsSocket = async (socket) => {
  try {
    const dialogs = await Dialog.find().populate("lastMessage participants");
    socket.emit("dialogsFetched", dialogs);
  } catch (error) {
    console.error("Error fetching dialogs via WebSocket:", error);
    socket.emit("dialogsFetchError", { message: 'Failed to fetch dialogs' });
  }
};

// Получение всех диалогов
const getAllDialogs = async (req, res) => {
  try {
    const dialogs = await Dialog.find().populate("lastMessage participants");
    res.status(200).json(dialogs);
  } catch (error) {
    console.error("Error retrieving dialogs:", error);
    res.status(500).json({ message: error.message });
  }
};

// Получение диалога по ID
const getDialogById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid dialog ID" });
    }

    const dialog = await Dialog.findById(id).populate("lastMessage participants");

    if (!dialog) {
      return res.status(404).json({ message: "Dialog not found" });
    }

    res.status(200).json(dialog);
  } catch (error) {
    console.error("Error retrieving dialog:", error);
    res.status(500).json({ message: error.message });
  }
};

// Создание нового диалога
const createDialogs = async (req, res) => {
  try {
    const { participants, title } = req.body;

    if (!participants || !Array.isArray(participants) || participants.length < 2) {
      return res.status(400).json({ message: "Invalid participants" });
    }

    const dialog = new Dialog({
      participants: participants.map((participant) => new mongoose.Types.ObjectId(participant)),
      messages: [],
      title: title || null,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastMessage: null,
    });

    const savedDialog = await dialog.save();
    console.log("Dialog created:", savedDialog);
    res.status(201).json(savedDialog);
  } catch (error) {
    console.error("Error creating dialog:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllDialogs,
  getDialogById,
  createDialogs,
  getAllDialogsSocket
};
