import React from 'react';

import {
  Input,
  InputGroup,
  FormLabel,
  InputRightElement,
  Button,
} from '@chakra-ui/react';

import { ErrorMessage } from 'formik';

const InputField = ({
  field,
  form: { touched, errors },
  label,
  buttonIcon,
  ...props
}) => {
  return (
    <InputGroup>
      <FormLabel>{props.label}</FormLabel>
      <Input {...props} {...field} />
      {props.buttonIcon && (
        <InputRightElement>
          <Button h="1.75rem" size="sm" onClick={props.onClick}>
            {buttonIcon}
          </Button>
        </InputRightElement>
      )}
      {touched[field.name] && errors[field.name] && (
        <ErrorMessage name={field.name} component="div" />
      )}
    </InputGroup>
  );
};

export default InputField;
