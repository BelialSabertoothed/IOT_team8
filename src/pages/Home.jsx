import React from 'react'
import useFetch from "../useFetch";
import useAxiosFetch from '../hooks/useAxiosFetch';
import CreateMedsTaker from '../components/MedsTaker/createMedsTaker';
import { Loader, Card, Grid, Text, Avatar, Box, Title, Group, Image} from '@mantine/core';

function Home() {
  //const [MedsTakers, MedsTakersPending, MedsTakersError, MedsTakersRefresh] = useFetch('http://localhost:3001/medsTaker/list');
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
  
  const addMedsTakerCart = <CreateMedsTaker refreshData={refreshData}></CreateMedsTaker>
  const medsTakersCarts = MedsTakers?.map((MedsTaker) => (
    <Card w='290' h='200' mt={20} key={MedsTaker._id} style={{paddingBlock:'30px'}} withBorder={true} shadow="sm" component="a" href={"/pilltaker?"+MedsTaker._id}>
      <Group justify="center">
        <Avatar size="xl"/>
        <Title>{MedsTaker.name}</Title>
        <Text>+{MedsTaker.phone_country_code} {MedsTaker.phone_number}</Text>
      </Group> 
    </Card>
  ));

  if (MedsTakersPending) {return <Box maw={{ base: 30, xxs: 30, xs: 30, sm: 30, md: 30, lg: 30, xl: 30}} mx="auto" mt={50}><Loader size={30} color='vioet' /></Box>;}
  else if (MedsTakersError) {return (
  <Box maw={{ base: 300, xxs: 300, xs: 300, sm: 500, md: 500, lg: 500, xl: 500}} mx="auto" mt={50}>
    <Image
      h={{ base: 272, xxs: 272, xs: 272, sm: 450, md: 450, lg: 450, xl: 450}}
      w={{ base: 300, xxs: 300, xs: 300, sm: 500, md: 500, lg: 500, xl: 500}}
      fit="contain"
      radius={10}
      fallbackSrc='https://i.pinimg.com/originals/5a/e4/9a/5ae49a02fc6d1281dd9267d679e6ba01.jpg'
      />
      <Text>{errorMessage}</Text>
  </Box>
  )}
  else return (  
    <Box maw={{ base: 300, xxs: 300, xs: 300, sm: 600, md: 900, lg: 900, xl: 900}} mx="auto" mt={50}>
      <Box w={{ base: 440,xxs: 440, xs: 440, sm: 440, md: 892, lg: 892, xl: 892}} h='50'>
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
        <Card /* prosim nemazat */  w='290' h='200' mt={20}/>
        
      </Grid>
    </Box>   
  )
}

export default Home