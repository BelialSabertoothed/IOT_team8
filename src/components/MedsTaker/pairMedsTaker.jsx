import React, { useState } from 'react'
import { Modal, Button, Box, TextInput, Group, NativeSelect, rem, PinInput, Stepper, Input, Overlay, Stack, Text} from '@mantine/core'; //reset phone from textinput to input
//import { IMaskInput } from 'react-imask'; //plugin add?
import { useForm, hasLength } from '@mantine/form';
import { SquarePlus } from 'lucide-react';
import sendToServer from '../../utils/SendToServer';
import {IconArrowsUpDown} from '@tabler/icons-react';
import axios from "axios";
const mainUrl = import.meta.env.VITE_API_URL;

function PairMedsTaker(props) {
  const [open, setOpen] = useState(false);
  const form = useForm({    
    initialValues: {
      device:''
    },

    validate: {
      device: hasLength({ min: 5, max: 5 }, ' '),
    },
  });

  async function handlSubmit(content){
    const Device = await axios.get(`${mainUrl}/device/getByCode/${content.device}`, { withCredentials: true })
    content.device=`${(Device.data)._id}`
    content.id=props.medsTakerId
    console.log(content.id)
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

    const result = await sendToServer(`/medsTaker/update`, content);
    if (result) {
      setOpen(false)
      window.location.reload();
    }else {
      alert('something went wrong')
    }
  }

  let DeviceCode = <form onSubmit={form.onSubmit((values) => handlSubmit(values))}>
  <PinInput ml={2} mt={110} mb={100} size="xl" length={5} {...form.getInputProps('device')}/>
  <Group mb={80} mt={60} justify="space-between">
    <Button variant="light" onClick={() => setOpen(false)}>Cancel</Button>
    <Group>
      <Box></Box>
      <Button type="submit">Pair</Button>
    </Group>
  </Group>
</form>

  return (
    <>
      <Modal size={'lg'} opened={open} onClose={() => setOpen(false)} title="Pair meds taker" centered>
        <Box maw={340} mx="auto">
            {DeviceCode}
        </Box>
      </Modal>

      <Overlay center color="#000" backgroundOpacity={0.7} blur={5} onClick={() => setOpen(true)}
          /* notifications.show({
            title: `pair device ${MedsTaker._id}`,
            message: 'It is default blue',
            position: 'top-center'
          }) */
        >
        <Stack align='center'>
          <IconArrowsUpDown style={{marginTop: '15px'}} color='white' justify='center' size={50}/>
          <Text ml={10} fw={700} size='lg' c={'white'} textWrap="wrap" lineClamp={2}>PAIR DEVICE</Text>
          <Text c={'white'} mt={-15} size='xs'>({props.mesdTakerName})</Text> 
        </Stack>
      </Overlay>
    </>
  );
}

export default PairMedsTaker