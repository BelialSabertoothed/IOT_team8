import React from 'react'
import useFetch from "../useFetch";
import useAxiosFetch from '../hooks/useAxiosFetch';
import CreateMedsTaker from '../components/MedsTaker/createMedsTaker';
import { Loader, Card, Grid, Text, Avatar, Box, Title, Group} from '@mantine/core';

function Home() {
  //const [MedsTakers, MedsTakersPending, MedsTakersError, MedsTakersRefresh] = useFetch('http://localhost:3001/medsTaker/list');
  const {
    isLoading: MedsTakersPending,
    data: MedsTakers,
    isError: MedsTakersError,
    refetch: MedsTakersRefresh
  } = useAxiosFetch(`/medsTaker/list`);

  const refreshData = () => {MedsTakersRefresh();};
  console.log("MedsTakers:",MedsTakers)
  console.log("MedsTakersPending:",MedsTakersPending)
  console.log("MedsTakersError:",MedsTakersError)
  
  const addMedsTakerCart = <CreateMedsTaker refreshData={refreshData}></CreateMedsTaker>
  const medsTakersCarts = MedsTakers?.map((MedsTaker) => (
    <Card w='290' h='200' mt={20} key={MedsTaker._id} withBorder={true} shadow="sm" component="a" href={"/pilltaker?"+MedsTaker._id}>
      <Group justify="center">
        <Avatar size="xl"/>
        <Title>{MedsTaker.name}</Title>
        {/* <Grid.Col span={12}><Text>+{MedsTaker.phone_country_code} {MedsTaker.phone_number}</Text></Grid.Col> */}
      </Group> 
    </Card>
  ));

  if (MedsTakersPending) {return <Loader size={30} />;}
  else if (MedsTakersError) {return (<div>ERROR</div>)}
  else return (  
    <Box maw={{ base: 300, xxs: 300, xs: 300, sm: 600, md: 900, lg: 900, xl: 900}} mx="auto" mt={50}>
      <Box w={{ base: '440',xxs: '440', xs: '440', sm: '440', md: '892', lg: '892', xl: '892'}} h='50'>
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