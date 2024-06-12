import React, { useState } from 'react'
import { Modal, Button, Box, Stepper} from '@mantine/core';

function Start() {
  const [open, setOpen] = useState(false);

  const [step, setStep] = useState(0);
  const [active, setActive] = useState(1);
  const nextStep = () => setStep((currentStep) => (currentStep < 1 ? currentStep + 1 : currentStep));
  const prevStep = () => setStep((currentStep) => (currentStep > 0 ? currentStep - 1 : currentStep));

  return (
    <>
      <Modal size={'lg'} opened={open} onClose={() => setOpen(false)} title="Get started" centered>
        <Box maw={340} mx="auto">
            <Stepper active={active} onStepClick={setActive} orientation="vertical">
                <Stepper.Step label="Buy device" description="Hardwario" />
                <Stepper.Step label="Create account" description="Get full access" />
                <Stepper.Step label="Create medicine taker" description="Supervise" />
                <Stepper.Step label="Pair device" description="Setup device" />
                <Stepper.Step label="Add medicine" description="Costumize app" />
                <Stepper.Step label="Set reminder" description="Newer forget again" />
            </Stepper>
        </Box>
      </Modal>

      
      
      <Button radius="xl" size="md" onClick={() => setOpen(true) /* window.location.replace("/register") */}>
        Get started
      </Button>
    </>
  );
}

export default Start