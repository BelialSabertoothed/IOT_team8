import React from 'react'
import useFetch from "../useFetch";
import useAxiosFetch from '../hooks/useAxiosFetch';
import CreateMedsTaker from '../components/MedsTaker/createMedsTaker';
import { Loader, Card, Grid, Text, Avatar} from '@mantine/core';

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
    <Card w='200' h='100' key={MedsTaker._id} withBorder={true} shadow="sm" component="a" href={"/pilltaker?"+MedsTaker._id}>
      <Grid justify="center" align="flex-start">
        <Grid.Col span={4}><Avatar></Avatar></Grid.Col>
        <Grid.Col span={8}><Text>{MedsTaker.name}</Text></Grid.Col>
        <Grid.Col span={12}><Text>+{MedsTaker.phone_country_code} {MedsTaker.phone_number}</Text></Grid.Col>
      </Grid> 
    </Card>
  ));

  if (MedsTakersPending) {return <Loader size={30} />;}
  else if (MedsTakersError) {return (<div>ERROR</div>)}
  else return (      
    <Grid justify="center" align="flex-start">
      {medsTakersCarts}
      {addMedsTakerCart}
    </Grid>   
  )
}

export default Home