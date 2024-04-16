import {React} from 'react'
import {Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import LoginForm from './loginForm';

function ModalLogin() {
  const [opened, { open, close }] = useDisclosure(true);
   return (
    <>
    <Modal size={'lg'} opened={opened} onClose={close} title="Please Log in" centered>
      <LoginForm modal={true}/>
    </Modal>
    <Button variant="transparent" size="compact-sm" onClick={open}>Log in</Button>
    </>
  );
}

export default ModalLogin