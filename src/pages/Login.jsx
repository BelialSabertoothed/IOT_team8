import React from 'react'
import { TextInput, Checkbox, Button, Group, Box, Title, PasswordInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';

function Login() {
  const form = useForm();

  const [visible, { toggle }] = useDisclosure(false);

  return (
    <Box maw={340} mx="auto">
      <Title mb={10} mt={20} order={3}>Log in</Title>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <TextInput
          label="Email"
          error="This email does not exist"
        />

        <PasswordInput
          label="Password"
          visible={visible}
          onVisibilityChange={toggle}
          error="Invalid password"
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
}

export default Login