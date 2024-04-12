import React, { useState } from 'react'
import { Grid, Modal, Button, Box, TextInput, Group } from '@mantine/core';
import { useForm } from '@mantine/form';
import { SquarePlus } from 'lucide-react';
import sendToServer from '../../utils/SendToServer';

function CreateMedsTaker(props) {
  const [open, setOpen] = useState(false);
  const form = useForm({
    initialValues: {
      name: '',
      phone_country_code: '',
      phone_number: '',
    },

    validate: {
      name: (value) => (/[a-z]/.test(value) ? null : 'Requested'),
      phone_country_code: (value) => (/[0-9]/.test(value) ? null : 'Requested'),
      phone_number: (value) => (/[0-9]/.test(value) ? null : 'Requested'),
    },
  });

  async function handlSubmit(content){
    /*const response = await fetch("http://localhost:3001/medsTaker/create", 
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      }
    );
    if (response.status == 200){
      setOpen(false)
      props.refreshData()
    }*/

    const result = await sendToServer(`/medsTaker/create`, content);
    if (result) {
      setOpen(false)
      props.refreshData()
    }
  }

  return (
    <>
      <Modal size={'lg'} opened={open} onClose={() => setOpen(false)} title="Create new meds taker">
        <Box maw={340} mx="auto">
            <form onSubmit={form.onSubmit((values) => handlSubmit(values))}>
                <TextInput
                    withAsterisk
                    label="Name of meds taker"
                    placeholder="Name"
                    {...form.getInputProps('name')}
                />
                <TextInput
                    withAsterisk
                    label="phone country code"
                    placeholder="420"
                    leftSection="+"
                    {...form.getInputProps('phone_country_code')}
                />
                <TextInput
                    withAsterisk
                    label="phone number"
                    placeholder="000 000 000"
                    {...form.getInputProps('phone_number')}
                />
                <Group justify="space-between" mt="md">
                <Button mb={40} mt={20} variant="light" onClick={() => setOpen(false)}>Cancel</Button>
                <Button mb={40} mt={20} type="submit">Create</Button>
                </Group>
            </form>
        </Box>
      </Modal>

      
      <SquarePlus key={"addMedsTakerCart"} size={40} component="button" onClick={() => setOpen(true)}/>
      
    </>
  );
}

export default CreateMedsTaker