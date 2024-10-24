import React, { useEffect } from 'react';
import useStore from '../stores/useStore';
import socket from '../socket';
import MessageInput from './MessageInput';

const FullDialog = () => {
  const { selectedDialog, messages, addMessage, setMessages } = useStore();

  useEffect(() => {
    if (selectedDialog) {
      // Запрашиваем сообщения по диалогу
      socket.emit('getMessagesByDialogId', { dialogId: selectedDialog._id });

      socket.on('messagesFetched', (data) => {
        setMessages(data); // Обновляем весь список сообщений
      });
    }

    return () => {
      socket.off('messagesFetched');
    };
  }, [selectedDialog]);

  // Отслеживаем создание новых сообщений
  useEffect(() => {
    socket.on('messageCreated', () => {
      // После создания сообщения запрашиваем обновленный список
      if (selectedDialog) {
        socket.emit('getMessagesByDialogId', { dialogId: selectedDialog._id });
      }
    });

    return () => {
      socket.off('messageCreated');
    };
  }, [selectedDialog]);

  if (!selectedDialog) {
    return <div>Выберите диалог</div>;
  }

  return (
    <div>
      <h2>Сообщения</h2>
      <ul>
        {messages.map((message) => (
          <li key={message._id}>
            <strong>{message.senderId}:</strong> {message.content}
          </li>
        ))}
      </ul>
      <MessageInput />
    </div>
  );
};

export default FullDialog;
