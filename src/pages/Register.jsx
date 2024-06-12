import React from 'react'
import { useState } from 'react';
import { IconX, IconCheck } from '@tabler/icons-react';
import { TextInput, Checkbox, Button, Group, Box, Title, PasswordInput, Progress, Text, Popover, rem, NativeSelect } from '@mantine/core';
import { useForm } from '@mantine/form';
import sendToServer from '../utils/SendToServer';
import Errors from '../components/Alerts/Errors';


const prep_country_code = [
  { value: '420', label: '+420' },
  { value: '544', label: '+544' },
  { value: '262', label: '+262' },
  { value: '365', label: '+365' },
  { value: '231', label: '+231' },
  { value: 'own value function', label: 'other' } //TODO
];

//Password functions
function PasswordRequirement({ meets, label }) {
  return (
    <Text
      c={meets ? 'teal' : 'red'}
      style={{ display: 'flex', alignItems: 'center' }}
      mt={7}
      size="sm"
    >
      {meets ? (
        <IconCheck style={{ width: rem(14), height: rem(14) }} />
      ) : (
        <IconX style={{ width: rem(14), height: rem(14) }} />
      )}{' '}
      <Box ml={10}>{label}</Box>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: 'Includes number' },
  { re: /[a-z]/, label: 'Includes lowercase letter' },
  { re: /[A-Z]/, label: 'Includes uppercase letter' },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: 'Includes special symbol' },
];
function getStrength(password) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

//Registration
function Register() {
  const form = useForm({
    initialValues: {
      email: '',
      phone_country_code: '420',
      phone_number: '',
      firstName: '',
      lastName: '',
      password: '',
      termsOfService: false,
    },

    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      phone_country_code: (value) => (/[0-9]/.test(value) ? null : 'Requested'),
      phone_number: (value) => (/[0-9]{3}\s[0-9]{3}\s[0-9]{3}|[0-9]{9}/.test(value) ? null : 'Requested'),
      firstName: (value) => (/[a-z]/.test(value) ? null : 'Required'),
      lastName: (value) => (/[a-z]/.test(value) ? null : 'Required'),
      termsOfService: (value) => (value ? null : 'Required'),
    },
  });
  
  const selectPhone = (
    <NativeSelect
      data={prep_country_code}
      styles={{
        input: {
          fontWeight: 500,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          width: rem(77),
          marginLeft: rem(-35),
          paddingLeft: rem(7)
        },
      }}
      {...form.getInputProps('phone_country_code')}
    />
  );

  const handleSubmit = async (values) => {
    values.password = password;
    delete values.termsOfService;

    const result = await sendToServer(`/user/register`, values);
    if (result) {
      window.location.replace("/login");
      Errors(1,1,1,'ahoj')
    }
  }

  //Password const
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [password, setPassword] = useState('');
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement key={index} label={requirement.label} meets={requirement.re.test(password)} />
  ));
  const strength = getStrength(password);
  const color = strength === 100 ? 'teal' : strength > 50 ? 'yellow' : 'red';

  return (
    <Box maw={340} mx="auto">
      <Title mb={10} mt={50} order={3}>Sign up</Title>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          maxLength={255}
          minLength={6}
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps('email')}
        />
        <TextInput
            withAsterisk
            label="Phone number of meds taker"
            leftSection={selectPhone}
            leftSectionWidth={110}
            placeholder="000 000 000"
            /* mask="000 000 000" */
            {...form.getInputProps('phone_number')}
        />
        <TextInput
          withAsterisk
          maxLength={255}
          minLength={3}
          label="First name"
          placeholder="Jane"
          {...form.getInputProps('firstName')}
        />

        <TextInput
          withAsterisk
          maxLength={255}
          minLength={3}
          label="Last name"
          placeholder="Doe"
          {...form.getInputProps('lastName')}
        />

        <Popover opened={popoverOpened} position="bottom" width="target" transitionProps={{ transition: 'pop' }}>
          <Popover.Target>
            <div
              onFocusCapture={() => setPopoverOpened(true)}
              onBlurCapture={() => setPopoverOpened(false)}
            >
              <PasswordInput
                withAsterisk
                label="Your password"
                placeholder="Your password"
                value={password}
                onChange={(event) => setPassword(event.currentTarget.value)}
              />
            </div>
          </Popover.Target>
          <Popover.Dropdown>
            <Progress color={color} value={strength} size={5} mb="xs" />
            <PasswordRequirement label="Includes at least 6 characters" meets={password.length > 5} />
            {checks}
          </Popover.Dropdown>
        </Popover>

        <Checkbox
          mt="md"
          label="I agree with terms"
          {...form.getInputProps('termsOfService', { type: 'checkbox' })}
        />

        <Group justify="flex-end" mt="md">
          <Button type='submit'>Submit</Button>
        </Group>
      </form>
    </Box>
  );
}

export default Register