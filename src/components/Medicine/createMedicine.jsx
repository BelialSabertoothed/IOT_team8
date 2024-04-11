import React from 'react'
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Box, TextInput, Group, Input, NumberInput } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconChevronDown } from '@tabler/icons-react';

function CreateMedicine() {
  const [opened, { open, close }] = useDisclosure(false);
  const form = useForm({
    initialValues: {
      email: '',
      first: '',
      last: '',
      password: '',
      termsOfService: false,
    },

    validate: {
      medicineName: (value) => (/[a-z]/.test(value) ? null : 'Requested'),
      refill: (value) => (/[0-9]/.test(value) ? null : '[number]'),
      amount: (value) => (/[0-9]/.test(value) ? null : '[number]'),
    },
  });

  return (
    <>
      <Modal size={'lg'} opened={opened} onClose={close} title="Create new medicine">
        <Box maw={340} mx="auto">
            <form onSubmit={form.onSubmit((values) => console.log(values))}>
                <TextInput
                    withAsterisk
                    label="Name of medicine"
                    placeholder="Name"
                    {...form.getInputProps('medicineName')}
                />
                <TextInput
                    withAsterisk
                    label="Medicine amount per refill"
                    placeholder="Amount"
                    {...form.getInputProps('refill')}
                />
                <Group>
                    <TimeInput
                        id='time1'
                        w={150}
                        mt={20}
                        label="Meds harmonogram"
                        withAsterisk
                        description={`1. dose`}
                        /* error='Requested' */
                        timeSteps={{ minutes: 15 }}
                    />
                    <NumberInput
                      w={76}
                      mb={-45}
                      withAsterisk
                      mt={20}
                      placeholder="Amount"
                      min={1}
                      max={99}
                      hideControls
                      {...form.getInputProps('amount')}
                    /> 
                    <Input
                      w={92}
                      mb={-45}
                      mt={20}
                      ml={-10}
                      placeholder={'unit'}
                      disabled
                      defaultValue={null}
                    /> 
                </Group>
                <Input
                    component="select"
                    rightSection={<IconChevronDown size={14} stroke={1.5} />}
                    pointer
                    mt="md"
                >
                    <option value="Dayli">Dayli</option>
                    <option value="2">Every two days</option>
                </Input>
                <Button variant="light" mt={10} fullWidth>Add time</Button>

                <Group justify="space-between" mt="md">
                <Button mb={40} mt={20} variant="light">Cancel</Button>
                <Button mb={40} mt={20} type="submit">Create</Button>
                </Group>
            </form>
        </Box>
      </Modal>

      <Button onClick={open}>Create medicine</Button>
    </>
  );
}

export default CreateMedicine