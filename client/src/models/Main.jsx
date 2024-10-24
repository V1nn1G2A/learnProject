import React from 'react';

import DialogList from '../components/DialogList';
import FullDialog from '../components/FullDialog';

import useStore from '../stores/useStore';
import socket from '../socket';

const Main = () => {
  const { selectedDialog } = useStore();
  return (
    <div style={{ display: 'flex', padding: '20px' }}>
      <div
        style={{
          width: '30%',
          borderRight: '1px solid #ccc',
          paddingRight: '20px',
        }}
      >
        <DialogList />
      </div>
      <div style={{ width: '70%', paddingLeft: '20px' }}>
        {selectedDialog ? (
          <FullDialog />
        ) : (
          <div>Выберите диалог для просмотра сообщений</div>
        )}
      </div>
    </div>
  );
};

export default Main;
