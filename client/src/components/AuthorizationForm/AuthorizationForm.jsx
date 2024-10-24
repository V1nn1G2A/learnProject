import React from 'react';

import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

import { Button, Flex } from '@chakra-ui/react';

import InputField from '../../ui-components/InputField/InputField';

const AuthorizationForm = ({ isRegistered = false, onSubmit }) => {
  const validationSchema = Yup.object().shape({
    username: Yup.string().required('Required'),
    email: isRegistered ? Yup.string().required('Required') : Yup.string(),
    password: Yup.string().required('Required'),
  });

  const handleSubmit = (values, { resetForm }) => {
    onSubmit(values);
    resetForm();
  };

  return (
    <Formik
      initialValues={{ username: '', password: '' }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form>
          <Flex flexDirection="column" alignItems="center" gap="20px" mb="20px">
            <Field
              type="text"
              name="username"
              placeholder="Username"
              label="Username"
              component={InputField}
            />
            {isRegistered && (
              <Field
                type="email"
                name="email"
                placeholder="Email"
                label="Email"
                component={InputField}
              />
            )}
            <Field
              type="password"
              name="password"
              placeholder="Password"
              label="Password"
              component={InputField}
            />
            <Button type="submit">{isRegistered ? 'Register' : 'Login'}</Button>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};

export default AuthorizationForm;
