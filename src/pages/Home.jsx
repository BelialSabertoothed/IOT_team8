import React from 'react'
import useFetch from "../useFetch";
import useAxiosFetch from '../hooks/useAxiosFetch';
import CreateMedsTaker from '../components/MedsTaker/createMedsTaker';
import { Loader, Card, Grid, Text, Avatar, Box, Title, Button} from '@mantine/core';

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
      <Grid justify="center">
        <Grid.Col span={4}><Avatar size="xl"/></Grid.Col>
        <Grid.Col span={8}><Title>{MedsTaker.name}</Title></Grid.Col>
        {/* <Grid.Col span={12}><Text>+{MedsTaker.phone_country_code} {MedsTaker.phone_number}</Text></Grid.Col> */}
      </Grid> 
    </Card>
  ));

  if (MedsTakersPending) {return <Loader size={30} />;}
  else if (MedsTakersError) {return (<div>ERROR</div>)}
  else return (  
    <Box maw={{ base: 300, xxs: 300, xs: 300, sm: 600, md: 900, lg: 900, xl: 900}} mx="auto" mt={50}>
      <Box mb={10}>
        {addMedsTakerCart}
      </Box>
      <Grid justify="space-between" align="flex-start">
        {medsTakersCarts}
        <Card /* prosim nemazat */  w='290' h='200' mt={20}/>
        
      </Grid>
    </Box>   
  )
}

export default Home