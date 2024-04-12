import React from 'react'
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Box, TextInput, Group} from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { AlarmClock } from 'lucide-react';

function AlarmMedicine() {
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
      <Modal size={'lg'} opened={opened} onClose={close} title="Set alarms">
        <Box maw={340} mx="auto">
            <form onSubmit={form.onSubmit((values) => console.log(values))}>
                <TextInput
                    withAsterisk
                    label="Placeholder"
                    placeholder="Placeholder"
                    {...form.getInputProps('medicineName')}
                />
                
                    <TimeInput
                        id='time1'
                        w={150}
                        mt={20}
                        label="Placeholder"
                        withAsterisk
                        description={`Placeholder`}
                        timeSteps={{ minutes: 15 }}
                    />
                    
                <Group justify="space-between" mt="md">
                <Button mb={40} mt={20} variant="light">Cancel</Button>
                <Button mb={40} mt={20} type="submit">Set</Button>
                </Group>
            </form>
        </Box>
      </Modal>

      <AlarmClock size={40} component="button" onClick={open}/>
    </>
  );
}

export default AlarmMedicine