import React, { useState } from 'react'
import { /* Modal */Popover, Avatar, Text, Title, Button, Group } from '@mantine/core';
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
      window.location.replace("/")
    }else {
      alert('something went wrong')
    }
  }
  
  return (
    <>
      {/* <Modal size={'lg'} opened={open} onClose={() => setOpen(false)} title="Profile" centered>
        <Text>{"Name: " + props.user.firstName + props.user.lastName}</Text>
        <Text>{"Email: " + props.user.email}</Text>
        <Button leftSection={<LogOut size={14} />} onClick={() => handleLogout()}>Log Out</Button>
      </Modal> */}

      <Popover width={300} position="bottom-start" clickOutsideEvents={['mouseup', 'touchend']}  offset={{ mainAxis: 11}} shadow="sm">
        <Popover.Target>
          <Avatar key={"profile"} color='violet' onClick={() => setOpen(true)}>{props.user.firstName[0] + props.user.lastName[0]}</Avatar>
        </Popover.Target>
        <Popover.Dropdown>
          <Group>
            <Avatar size="4rem" color='violet'>{props.user.firstName[0] + props.user.lastName[0]}</Avatar>
            <Title order={3}>{props.user.firstName +' ' + props.user.lastName} <Text>{props.user.email}</Text></Title>
          </Group>
          <Group justify='flex-end'>
            <Button variant="outline" mt={20} mb={10} leftSection={<LogOut size={14} />} onClick={() => handleLogout()}>Log Out</Button>
          </Group>
        </Popover.Dropdown>
      </Popover>

      
      {/* <Avatar component="button" key={"profile"} onClick={() => setOpen(true)}/> */}
      
    </>
  );
}

export default Profile