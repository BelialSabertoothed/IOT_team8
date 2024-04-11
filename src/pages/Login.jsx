import {React, useState} from 'react'
import { TextInput,  Button, Group, Box, Title, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import sendToServer from '../utils/SendToServer';

//Sory furt to nefachá, kouknu na to zítra... zuzaf ok

function Login() {
  const [user, setUser] = useState('');
  const form = useForm(
  );

  const [visible, { toggle }] = useDisclosure(false);

  const handleSubmit = async (values) => {
    const result = await sendToServer(`/user/login`, values);
    if (result) {
      console.log(result);
    }
  };

  return (
    <Box maw={340} mx="auto">
      <Title mb={10} mt={20} order={3}>Log in</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          label="Email"
          error="This email does not exist"
          {...form.getInputProps('email')}
        />

        <PasswordInput
          label="Password"
          visible={visible}
          onVisibilityChange={toggle}
          error="Invalid password"
          {...form.getInputProps('password')}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
      <Title>{/* Pozdeji smazat */user}</Title>
    </Box>
  );
}

export default Login