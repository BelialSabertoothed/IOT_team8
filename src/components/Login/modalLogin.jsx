import {React, useState} from 'react'
import {useMantineTheme, UnstyledButton, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import LoginForm from './loginForm';

function ModalLogin() {
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  let [firstTime,setFirstTime] = useState(true)
  
  if (firstTime === true) {
    window.onload = setTimeout(() => {
          open()
        }, 2000);
    setFirstTime(false)
    } else {null}
  
   return (
    
    <>
    <Modal size={'lg'} opened={opened} onClose={close} title="Please Log in" centered transitionProps={{ transition: 'fade', duration: 500 }} >
      <LoginForm modal={true}/>
    </Modal>
    <UnstyledButton style={{color: theme.colors.violet[5]}} onClick={() => {open()}}
        >Log in</UnstyledButton>
    </>
  );
}

export default ModalLogin