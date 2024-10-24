const mongoose = require('mongoose');
const User = require('./models/User');
const Dialog = require('./models/Dialog');
const Message = require('./models/Message');

// Замените строку подключения на вашу
const dbURI = 'mongodb://localhost:27017/chat-app';

mongoose.connect(dbURI)
  .then(() => {
    console.log('Connected to MongoDB...');
    return seedDatabase();
  })
  .catch(err => console.error('Could not connect to MongoDB...', err));

async function seedDatabase() {
  await User.deleteMany({});
  await Dialog.deleteMany({});
  await Message.deleteMany({});

  const user1 = new User({
    username: "JohnDoe",
    email: "john@example.com",
    password: "hashedpassword1"
  });

  const user2 = new User({
    username: "JaneDoe",
    email: "jane@example.com",
    password: "hashedpassword2"
  });

  await user1.save();
  await user2.save();

  const dialog = new Dialog({
    participants: [user1._id, user2._id],
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    lastMessage: null
  });

  await dialog.save();

  const message = new Message({
    content: "Hello, Jane",
    senderId: user1._id,
    createdAt: new Date(),
    dialogId: dialog._id
  });

  await message.save();

  dialog.messages.push(message._id);
  dialog.lastMessage = message._id;
  await dialog.save();

  console.log('Mock data inserted into the database.');
  mongoose.connection.close();
}
