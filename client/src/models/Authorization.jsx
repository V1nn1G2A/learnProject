import React from 'react';
import { Link, Text, Box, useToast } from '@chakra-ui/react';
import AuthorizationForm from '../components/AuthorizationForm/AuthorizationForm';
import useUser from '../stores/useUser';

const Authorization = () => {
  const [isRegistered, setIsRegistered] = React.useState(false);

  const { setUser } = useUser();

  const toast = useToast();

  const toggleRegister = (e) => {
    e.preventDefault();
    setIsRegistered(!isRegistered);
  };

  const onSubmit = (values) => {
    const type = isRegistered ? 'register' : 'login';
  };

  return (
    <Box
      backgroundColor={'#F8CBAD'}
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100vw"
      height="100vh"
      justifyContent="center"
    >
      <Box
        backgroundColor={'#F4B084'}
        boxShadow="lg"
        p="4"
        mb="4"
        borderRadius="md"
        minWidth="400px"
      >
        <Text mb={3} fontSize="2xl" fontWeight="bold">
          {isRegistered ? 'Регистрация' : 'Авторизация'}
        </Text>
        <AuthorizationForm
          isRegistered={isRegistered}
          onSubmit={(values) => {
            onSubmit(values);
          }}
        />
      </Box>
      <Text>
        {isRegistered ? 'У вас уже есть аккаунт? ' : 'У вас нет аккаунта? '}
        <Link href="#" onClick={toggleRegister}>
          {isRegistered ? 'Войти' : 'Зарегистрироваться'}
        </Link>
      </Text>
    </Box>
  );
};

export default Authorization;
