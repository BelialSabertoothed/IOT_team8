import {React} from 'react'
import {useMantineTheme, UnstyledButton, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import LoginForm from './loginForm';

function ModalLogin() {
  const [opened, { open, close }] = useDisclosure(true);
  const theme = useMantineTheme();
   return (
    <>
    <Modal size={'lg'} opened={opened} onClose={close} title="Please Log in" centered>
      <LoginForm modal={true}/>
    </Modal>
    <UnstyledButton style={{color: theme.colors.violet[5]}} onClick={open}>Log in</UnstyledButton>
    </>
  );
}

export default ModalLogin