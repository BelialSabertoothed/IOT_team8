import {React, useState, useContext} from 'react'
import useAxiosFetch from '../hooks/useAxiosFetch';
import CreateMedsTaker from '../components/MedsTaker/createMedsTaker';
import { useMantineTheme, Loader, Card, Grid, Text, Avatar, Box, Title, Group, Image, Badge, Overlay, Indicator, Button, Stack} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import ModalLogin from '../components/Login/modalLogin';
import {IconBatteryOff,IconBattery, IconBattery1,IconBattery2, IconBattery3, IconBattery4, IconArrowsUpDown} from '@tabler/icons-react'
import { UserContext } from '../helpers/UserContext';
import PairMedsTaker from '../components/MedsTaker/pairMedsTaker';

import Errors from '../components/Alerts/Errors';

/* import axios from "axios";
const mainUrl = import.meta.env.VITE_API_URL; */

function Home() {
  const theme = useMantineTheme();
  const {
    isLoading: MedsTakersPending,
    data: MedsTakers,
    isError: MedsTakersError,
    errorStatus: errorStatus,
    errorMessage: errorMessage,
    refetch: MedsTakersRefresh
  } = useAxiosFetch(`/medsTaker/list`);
  const refreshData = () => {MedsTakersRefresh();};
  console.log("MedsTakers:",MedsTakers)
  console.log("MedsTakersPending:",MedsTakersPending)
  console.log("MedsTakersError:",MedsTakersError)
  console.log("ErrorMessage:",errorMessage)
  console.log("ErrorStatus:",errorStatus)

  const { setUser, user } = useContext(UserContext);
  console.log("UserContext",user)
  const [future] = useState(false);
/*
  MedsTaker.device===null? null:let Device = await axios.get(`${mainUrl}device/getById/${MedsTaker.device}`)
  */

  const addMedsTakerCart = <CreateMedsTaker refreshData={refreshData}></CreateMedsTaker>
  const medsTakersCarts = MedsTakers?.map((MedsTaker) => (
    <Card w='290' h='200' mt={20} radius={10} key={MedsTaker._id} style={{padding:'2px 23px 10px 35px', justifyContent:'right'}} withBorder={true} shadow="sm" component="a" href={MedsTaker.device === null/* unpaired */?null:"/pilltaker?medstaker="+MedsTaker._id}>
      <Group justify="end" mt="md" mb={0}>
        {(MedsTaker.device!==null?(MedsTaker.battery <= 3 ? <IconBatteryOff size={25} style={{color: 'red'}}/>
          :  MedsTaker.battery <= 15 && MedsTaker.battery > 3 ? <IconBattery size={28} style={{color: 'red'}}/>
          :  MedsTaker.battery <= 30 && MedsTaker.battery > 15 ? <IconBattery1 size={28} style={{color: 'orange'}}/>
          : MedsTaker.battery <= 50 && MedsTaker.battery > 30 ?<IconBattery2 size={28} style={{color: theme.colors.gray[5]}}/>
          : MedsTaker.battery <= 75 && MedsTaker.battery > 50 ?<IconBattery3 size={28} style={{color: theme.colors.gray[5]}}/>
          : MedsTaker.battery > 85 ?<IconBattery4 size={28} style={{color: '#7DDA58'}}/>
          : <Box w={10} h={30}></Box>):<Box w={10} h={30}></Box>)}
        {(future === true && MedsTaker.phone_number[0] === '1' ? <Badge>Taken</Badge>
          : future === true && MedsTaker.phone_number[0] === '9' ? <Badge variant='light'>Reminded</Badge>
          : future === true && MedsTaker.phone_number[0] === '5' ? <Badge color='red'>Forgoten</Badge>
          : future === true && MedsTaker.phone_number[0] === '6' ?<Badge color='lightgrey'>no data</Badge>
          : null)}
      </Group>
      <Group justify="start" pt={10}>
        {future === true && MedsTaker.phone_number[0] === '9' ? <Indicator label={<Image src={"../../pictures/flame.png"} h={20} w={20}></Image>} size={10} offset={11} position="bottom-end" color="transparent">
          <Avatar size="xl"/>
        </Indicator>:<Avatar size="xl"/>} 
        <Group>
          <Box w={127} mr={-26} /* bg={"linear-gradient(270deg, rgba(255, 0, 255, 1) 0%, rgba(0, 0, 0, 0) 100%)"} */>
            <Title textWrap="wrap" lineClamp={2}> {MedsTaker.name.split(" ")[0]}</Title>
          </Box>
          <Box w={10} h={40} bg={"linear-gradient(270deg, rgba(255, 255, 255, 1) 0%, rgba(0, 0, 0, 0) 100%)"}></Box>
        </Group>
      </Group>
      {MedsTaker.device === null?<PairMedsTaker mesdTakerName={MedsTaker.name} medsTakerId={MedsTaker._id} ></PairMedsTaker>:null}
    </Card>
  ));

  if (MedsTakersPending) {return <Box maw={{ base: 30, xxs: 30, xs: 30, sm: 30, md: 30, lg: 30, xl: 30}} mx="auto" mt={50}><Loader size={30} color='vioet' /></Box>;}
  else if (MedsTakersError) {/* Errors(errorStatus,errorMessage ); */ return (
  <Box maw={{ base: 300, xxs: 300, xs: 300, sm: 500, md: 500, lg: 500, xl: 500}} mx="auto" mt={80} align='center'>
    <Image
      h={{ base: 272, xxs: 272, xs: 272, sm: 450, md: 450, lg: 450, xl: 450}}
      w={{ base: 300, xxs: 300, xs: 300, sm: 500, md: 500, lg: 500, xl: 500}}
      fit="contain"
      radius={10}
      src={'https://cdn.dribbble.com/users/2970137/screenshots/6771179/halalnode-401.png'}
      fallbackSrc='https://i.pinimg.com/originals/5a/e4/9a/5ae49a02fc6d1281dd9267d679e6ba01.jpg'
      />
      <Text >{errorMessage} please <ModalLogin/></Text>
      
  </Box>
  )}
  else return (  
    <Box maw={{ base: 300, xxs: 300, xs: 300, sm: 600, md: 900, lg: 900, xl: 900}} mx="auto" mt={50}>
      <Box w={{ base: 280, xxs: 280, xs: 280, sm: 600, md: 900, lg: 900, xl: 900}} h='50'>
        <Group justify="space-between">
          <Title>{user? user.firstName +" "+ user.lastName : "user.name"}</Title>
          <Group justify="flex-end" gap="xs">
            {addMedsTakerCart}
          </Group>
        </Group>
      </Box>
      <Box mb={10}>
        
      </Box>
      <Grid justify="space-between" align="flex-start">
        {medsTakersCarts}
        <Card /* prosim nemazat */  w='290' h='200' mt={20} mb={20}/>
      </Grid>
    </Box>   
  )
}

export default Home