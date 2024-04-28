import React, { useState } from 'react'
import { Modal, Button, Box, TextInput, Group, NativeSelect, rem, PinInput, Stepper } from '@mantine/core';
import { useForm, hasLength } from '@mantine/form';
import { Pin, SquarePlus } from 'lucide-react';
import sendToServer from '../../utils/SendToServer';

const prep_country_code = [
  { value: '420', label: '+420' },
  { value: '544', label: '+544' },
  { value: '262', label: '+262' },
  { value: '365', label: '+365' },
  { value: '231', label: '+231' },
  { value: 'own value function', label: 'other' }
];

function CreateMedsTaker(props) {
  const [open, setOpen] = useState(false);
  const form = useForm({    
    initialValues: {
      name: '',
      phone_country_code: '420',
      phone_number: '',
      pair:''
    },

    validate: {
      name: (value) => (/[a-z]/.test(value) ? null : 'Requested'),
      phone_country_code: (value) => (/[0-9]/.test(value) ? null : 'Requested'),
      phone_number: (value) => (/[0-9]/.test(value) ? null : 'Requested'),
      pair: hasLength({ min: 5, max: 5 }, ' '),
    },
  });

  async function handlSubmit(content){
    delete content.pair;
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

  return (
    <>
      <Modal size={'lg'} opened={open} onClose={() => setOpen(false)} title="Create new meds taker" centered>
        <Box maw={340} mx="auto">
          <Stepper active={step} onStepClick={setStep} allowNextStepsSelect={false}>
            <Stepper.Step label="MedsTaker" description="Add informations">
              <form>
                  <TextInput
                      mt={40}
                      withAsterisk
                      label="Name of meds taker"
                      placeholder="Name"
                      {...form.getInputProps('name')}
                  />
                  <TextInput
                      withAsterisk
                      label="Phone number of meds taker"
                      leftSection={selectPhone}
                      leftSectionWidth={110}
                      placeholder="000 000 000"
                      {...form.getInputProps('phone_number')}
                  />
                  <Group mb={80} mt={60} justify="space-between">
                    <Button variant="light" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={() => {{form.isValid('name', 'phone_country_code', 'phone_number')===true?setStep((currentStep) => (currentStep < 1 ? currentStep + 1 : currentStep)):form.validate()};console.log(form.values)}}>Next</Button>
                  </Group>
                </form>
            </Stepper.Step>
            <Stepper.Step label="Device" description="Pair device">
              <form onSubmit={form.onSubmit((values) => handlSubmit(values))}>
                <PinInput ml={45} mt={80} mb={100} size="md" length={5} {...form.getInputProps('pair')}/>
                <Group mb={80} mt={60} justify="space-between">
                  <Button variant="light" onClick={() => setOpen(false)}>Cancel</Button>
                  <Group>
                    <Button variant="default" onClick={prevStep}>Back</Button>
                    <Button type="submit">Create</Button>
                  </Group>
                </Group>
              </form>
            </Stepper.Step>
          </Stepper>

          {/* <Group mb={80} mt={60} justify="space-between">
            <Button variant="light" onClick={() => setOpen(false)}>Cancel</Button>
            <Group>
              {step===1?<Button variant="default" onClick={prevStep}>Back</Button>:null}
              {step===1?<Button type="submit">Create</Button>:<Button type="submit" onClick={nextStep}>Next</Button>}
            </Group>
          </Group> */}
        </Box>
      </Modal>

      
      <SquarePlus key={"addMedsTakerCart"} size={40} component="button" onClick={() => setOpen(true)}/>
      
    </>
  );
}

export default CreateMedsTaker