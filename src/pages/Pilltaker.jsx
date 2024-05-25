import React from 'react'
import {
  Grid, Box, Image, Text, Title, useMantineTheme, Group, Container, Card
} from '@mantine/core';
import CreateMedicine from '../components/Medicine/createMedicine';
import AlarmMedicine from '../components/Medicine/alarmMedicine';
import useAxiosFetch from '../hooks/useAxiosFetch';

function Pilltaker() {
  const theme = useMantineTheme();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const medsTakerID = urlParams.get('medstaker')
  console.log("medsTaker id:",medsTakerID);
  const {
    isLoading: MedicinePending,
    data: Medicine,
    isError: MedicineError,
    errorStatus: MedicineErrorStatus,
    errorMessage: MedicineErrorMessage,
    refetch: MedicineRefresh
  } = useAxiosFetch(`/medicine/getByMedsTaker/`+medsTakerID);
  const {
    isLoading: MedsTakersPending,
    data: MedsTaker,
    isError: MedsTakersError,
    errorStatus: errorStatus,
    errorMessage: errorMessage,
    refetch: MedsTakersRefresh
  } = useAxiosFetch(`/medsTaker/get`+medsTakerID);
  console.log("MedsTakers:",MedsTaker)
 
  console.log("Medicine:",Medicine)
  const pill = Medicine?.map((medicine) => (
    <Card w='470' h='200' mt={20} key={medicine._id} withBorder={true} radius={10} p='10px' shadow="sm">
      <Group justify="center">
        <Title>{medicine.name}</Title>
        <Text style={{ paddingRight: '2%' }}>Days: {medicine.period.join(', ')}</Text>
        <Text style={{ paddingRight: '2%' }}>Time: {/* medicine.reminder */}</Text>
      </Group>
    </Card>
  ));

  return (
    
    <Box maw={{ base: 300, xxs: 300, xs: 300, sm: 600, md: 900, lg: 900, xl: 900}} mx="auto" mt={50}>
      <Grid justify="space-between">
        <Box w={{ base: '440',xxs: '440', xs: '440', sm: '440', md: '892', lg: '892', xl: '892'}} h='50'>
          <Group justify="space-between">
            <Title>{MedsTaker?.name?MedsTaker.name:"MedsTaker.name"}</Title>
            <Group justify="flex-end" gap="xs">
              <AlarmMedicine/>
              <CreateMedicine/>
            </Group>
          </Group>
        </Box>
        {pill}
        <Card /* prosim nemazat */  w='290' h='200' mt={20}/>
        
      </Grid>
    </Box> 
  )
}

export default Pilltaker