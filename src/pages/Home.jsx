import {React, useState} from 'react'
import useAxiosFetch from '../hooks/useAxiosFetch';
import CreateMedsTaker from '../components/MedsTaker/createMedsTaker';
import { Loader, Card, Grid, Text, Avatar, Box, Title, Group, Image, Badge, Overlay} from '@mantine/core';
import ModalLogin from '../components/Login/modalLogin';
import {IconBatteryOff, IconFlame, IconAwardFilled} from '@tabler/icons-react'

function Home() {
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

  const {
    data: Medicine
  } = useAxiosFetch(`/medicine/getByMedsTaker/6618011d8925d095a9a5034f`);

  console.log(Medicine)

  //v pripade nesparovaneho zarizeni - bude potreba to vyresit lepe
  const [unpaired, setPair] = useState(false);
  
  const addMedsTakerCart = <CreateMedsTaker refreshData={refreshData}></CreateMedsTaker>
  const medsTakersCarts = MedsTakers?.map((MedsTaker) => (
    <Card w='290' h='200' mt={20} radius={10} key={MedsTaker._id} style={{padding:'2px 23px 10px 35px', justifyContent:'right'}} withBorder={true} shadow="sm" component="a" href={unpaired?null:"/pilltaker?medstaker="+MedsTaker._id}>
      <Group justify="end" mt="md" mb="xs">
        {(/* battery */MedsTaker.phone_country_code === '420'?null:<IconBatteryOff style={{color: 'red'}}/>)}
        {(/* state */MedsTaker.phone_number[0] === '1' ? <Badge>Taken</Badge>
          : MedsTaker.phone_number[0] === '9' ? <Badge variant='light'>Reminded</Badge>
          : MedsTaker.phone_number[0] === '5' ? <Badge color='red'>Forgoten</Badge>
          : <Badge color='lightgrey'>no data</Badge>)}
      </Group>
      <Group justify="start" pt={10}>
        <Avatar size="xl"/>
        <Title>{MedsTaker.name.length === 5?MedsTaker.name.substr(0, 3):MedsTaker.name.substr(0, 4)} {(/* revard */MedsTaker.name.length === 5?<IconAwardFilled component='indicator'/>:null)}</Title>
      </Group>
      {unpaired && <Overlay color="#000" backgroundOpacity={0.5} />}
    </Card>
  ));

  if (MedsTakersPending) {return <Box maw={{ base: 30, xxs: 30, xs: 30, sm: 30, md: 30, lg: 30, xl: 30}} mx="auto" mt={50}><Loader size={30} color='vioet' /></Box>;}
  else if (MedsTakersError) {return (
  <Box maw={{ base: 300, xxs: 300, xs: 300, sm: 500, md: 500, lg: 500, xl: 500}} mx="auto" mt={80}>
    <Image
      h={{ base: 272, xxs: 272, xs: 272, sm: 450, md: 450, lg: 450, xl: 450}}
      w={{ base: 300, xxs: 300, xs: 300, sm: 500, md: 500, lg: 500, xl: 500}}
      fit="contain"
      radius={10}
      fallbackSrc='https://i.pinimg.com/originals/5a/e4/9a/5ae49a02fc6d1281dd9267d679e6ba01.jpg'
      />
      <Text>{errorMessage} please <ModalLogin/></Text>
      
  </Box>
  )}
  else return (  
    <Box maw={{ base: 300, xxs: 300, xs: 300, sm: 600, md: 900, lg: 900, xl: 900}} mx="auto" mt={50}>
      <Box w={{ base: 280, xxs: 280, xs: 280, sm: 600, md: 900, lg: 900, xl: 900}} h='50'>
        <Group justify="space-between">
          <Title>User.name</Title>
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