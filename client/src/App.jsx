// src/App.jsx
import React from 'react';
import useUser from './stores/useUser';
import Authorization from './models/Authorization';
import Main from './models/Main';
import './App.css';

import { ChakraProvider } from '@chakra-ui/react';

const App = () => {
  const { user } = useUser();

  return <ChakraProvider>{user ? <Main /> : <Authorization />}</ChakraProvider>;
};

export default App;
