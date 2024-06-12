import React, { useState } from 'react'
import { Modal, Button, Box, TextInput, Group, NativeSelect, rem, PinInput, Stepper, Input } from '@mantine/core'; //reset phone from textinput to input
//import { IMaskInput } from 'react-imask'; //plugin add?
import { useForm, hasLength } from '@mantine/form';
import { IconSettings } from '@tabler/icons-react'
import sendToServer from '../../utils/SendToServer';

/* import axios from "axios";
const mainUrl = import.meta.env.VITE_API_URL; */

const prep_country_code = [
  { value: '420', label: '+420' },
  { value: '544', label: '+544' },
  { value: '262', label: '+262' },
  { value: '365', label: '+365' },
  { value: '231', label: '+231' },
  { value: 'own value function', label: 'other' } //TODO
];

function UpdateMedsTaker(props) {
    let medstakerId = props.medstakerId
    console.log(props)
  const [open, setOpen] = useState(false);
  const form = useForm({    
    initialValues: {
      name: null,
      phone_country_code: null,
      phone_number: null
    },

    validate: {
      name: (value) => (/[a-z]/.test(value) ? null : 'Requested'),
      phone_country_code: (value) => (/[0-9]/.test(value) ? null : 'Requested'),
      phone_number: (value) => (value === null ?null:(/[0-9]{3}\s[0-9]{3}\s[0-9]{3}|[0-9]{9}/.test(value) ? null : 'Wrong number')),
    },
  });

  async function handlSubmit(content){
    (content.phone_number=== '' ?  (delete content.phone_country_code, delete content.phone_number):null)
    console.log(content)
    /* const Device = await axios.get(`${mainUrl}/device/getByCode/${content.device}`, { withCredentials: true })
    content.device=`${(Device.data)._id}` */

    const result = await sendToServer(`/medsTaker/update`, content);
    if (result) {
      setOpen(false)
      props.refreshData()
    }else {
      alert('something went wrong')
    }
  }

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

  const [step, setStep] = useState(0);
  const nextStep = () => setStep((currentStep) => (currentStep < 1 ? currentStep + 1 : currentStep));
  const prevStep = () => setStep((currentStep) => (currentStep > 0 ? currentStep - 1 : currentStep));

  let MedsTakerInfo = <form>
  <TextInput
      mt={40}
      withAsterisk
      label="Name of meds taker"
      placeholder="Name"
      {...form.getInputProps('name')}
  />
  <TextInput
      label="Phone number of meds taker"
      leftSection={selectPhone}
      leftSectionWidth={110}
      placeholder="000 000 000"
      /* mask="000 000 000" */
      {...form.getInputProps('phone_number')}
  />
  <Group mb={80} mt={60} justify="space-between">
    <Button variant="light" onClick={() => setOpen(false)}>Cancel</Button>
    <Button type="submit">Update</Button>
  </Group>
</form>

  return (
    <>
      <Modal size={'lg'} opened={open} onClose={() => setOpen(false)} title="Update meds taker" centered>
        <Box maw={340} mx="auto">
            {MedsTakerInfo}
        </Box>
      </Modal>

      
      <IconSettings key={"addMedsTakerCart"} size={40} component="button" onClick={() => setOpen(true)}/>
      
    </>
  );
}

export default UpdateMedsTaker