import React, { useState } from 'react'
import { Modal, Avatar, Text, Button } from '@mantine/core';
import { LogOut  } from 'lucide-react';
import sendToServer from '../../utils/SendToServer';


function Profile(props) {
  const [open, setOpen] = useState(false);
  console.log("Profile props:", props)
  
  async function handleLogout(){
    const result = await sendToServer(`/user/logout`);
    if (result) {
      setOpen(false)
      window.location.reload()
      window.location.replace("/Home")
    }else {
      alert('something went wrong')
    }
  }
  
  return (
    <>
      <Modal size={'lg'} opened={open} onClose={() => setOpen(false)} title="Profile" centered>
        <Text>{"Name: " + props.user.firstName + props.user.lastName}</Text>
        <Text>{"Email: " + props.user.email}</Text>
        <Button leftSection={<LogOut size={14} />} onClick={() => handleLogout()}>Log Out</Button>
      </Modal>

      
      <Avatar component="button" key={"profile"} onClick={() => setOpen(true)}/>
      
    </>
  );
}

export default Profile