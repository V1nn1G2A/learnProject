import React, { useEffect } from 'react';
import useStore from '../stores/useStore';
import socket from '../socket';

const DialogList = () => {
  const { dialogs, setDialogs, setSelectedDialog } = useStore();

  useEffect(() => {
    socket.emit('getAllDialogs');

    socket.on('dialogsFetched', (data) => {
      setDialogs(data);
    });

    return () => {
      socket.off('dialogs');
    };
  }, []);

  const handleDialogClick = (dialogId) => {
    setSelectedDialog(dialogs.filter((dialog) => dialog._id === dialogId)[0]);
  };

  return (
    <div>
      <h2>Диалоги</h2>
      <ul>
        {dialogs.map((dialog) => (
          <li
            key={dialog._id}
            onClick={() => handleDialogClick(dialog._id)}
            style={{ cursor: 'pointer', marginBottom: '10px' }}
          >
            <strong>{dialog.title || 'Без названия'}</strong>
            <p>
              Последнее сообщение:{' '}
              {dialog.lastMessage?.content || 'Нет сообщений'}
            </p>
            <p>Отправитель: {dialog.lastMessage?.sender || 'Неизвестно'}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DialogList;
