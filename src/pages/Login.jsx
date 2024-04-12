import {React, useState} from 'react'
import { TextInput,  Button, Group, Box, Title, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import sendToServer from '../utils/SendToServer';

function Login() {
  const form = useForm({
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
    },
  });

  const [visible, { toggle }] = useDisclosure(false);

  const handleSubmit = async (values) => {
    const result = await sendToServer(`/user/login`, values);
    if (result) {
      window.location.replace("/Home");
    }
    else {
      console.log('invalid email or pasword')
    }
  };

  return (
    <Box maw={340} mx="auto">
      <Title mb={10} mt={50} order={3}>Log in</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Email"
          /* error={(errorEmail?"This email does not exist":null)} */
          {...form.getInputProps('email')}
        />

        <PasswordInput
          label="Password"
          visible={visible}
          onVisibilityChange={toggle}
          /* error={(errorPassword?"Invalid password":null)} */
          {...form.getInputProps('password')}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
}

export default Login