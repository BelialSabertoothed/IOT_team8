import React from 'react'
import { useState } from 'react';
import { IconX, IconCheck } from '@tabler/icons-react';
import { TextInput, Checkbox, Button, Group, Box, Title, PasswordInput, Progress, Text, Popover, rem } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';


function Register() {
  const form = useForm({
    initialValues: {
      email: '',
      first: '',
      last: '',
      password: '',
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      first: (value) => (/[a-z]/.test(value) ? null : 'First name'),
      last: (value) => (/[a-z]/.test(value) ? null : 'Last name'),
      termsOfService: (value) => (value ? null : 'Required'),
    },
  });

  const [visible, { toggle }] = useDisclosure(false);

  /* const requirements = [
    { re: /[0-9]/, label: 'Includes number' },
    { re: /[a-z]/, label: 'Includes lowercase letter' },
    { re: /[A-Z]/, label: 'Includes uppercase letter' },
  ]; */

  return (
    <Box maw={340} mx="auto">
      <Title mb={10} mt={20} order={3}>Sing up</Title>
      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />
        
        <TextInput
          withAsterisk
          label="First name"
          placeholder="Jane"
          {...form.getInputProps('first')}
        />

        <TextInput
          withAsterisk
          label="Last name"
          placeholder="Doe"
          {...form.getInputProps('last')}
        />

        <PasswordInput
          withAsterisk
          label="Password"
          visible={visible}
          onVisibilityChange={toggle}
          error="Invalid password [a-z] [A-Z] [0-9]"
        />

        <Checkbox
          mt="md"
          label="I agree with terms"
          {...form.getInputProps('termsOfService', { type: 'checkbox' })}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
}

export default Register