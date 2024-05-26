import React, { useState } from 'react';
import {
  Grid, Box, Text, Title, useMantineTheme, Group, Card, Button, Stack, Flex
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

  const [takenStates, setTakenStates] = useState(() => {
    const initialState = {};
    Medicine?.forEach((medicine) => {
      initialState[medicine._id] = medicine.history.length > 0;
    });
    return initialState;
  });

  const handleButtonClick = (id) => {
    setTakenStates((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
    // TODO: update medicine history
  };

  const pill = Medicine?.map((medicine) => (
    <Card w='290px' h='200px' mt={20} key={medicine._id} withBorder={true} radius={10} p='20px' shadow="sm">
      <Flex direction="column" justify="space-between" h="100%">
        <Stack spacing="lg">
          <Title order={4} style={{ marginBottom: '0.5rem' }}>{medicine.name} {medicine.oneDose} {/* TODO: add unit {medicine.unit} */} pill</Title>
          <Text size="sm">{medicine.reminder.map(rem => rem.time).join(', ')} {medicine.period.join(', ')}</Text>
          <Text size="sm">Zbývá {medicine.count} dávek</Text>
        </Stack>
        <Flex mt="auto" justify="center">
        <Button
            variant="filled"
            color={takenStates[medicine._id] ? 'black' : 'purple'}
            onClick={() => handleButtonClick(medicine._id)}
            style={{ width: '250px', height: '35px' }}
          >
            {takenStates[medicine._id] ? 'Užito' : 'Neužito'}
          </Button>
        </Flex>
      </Flex>
    </Card>
  ));

  const groupMedicinesByTime = (medicines) => {
    const grouped = {};

    medicines.forEach((medicine) => {
      medicine.reminder.forEach((reminder) => {
        if (!grouped[reminder.time]) {
          grouped[reminder.time] = [];
        }
        grouped[reminder.time].push({ ...medicine, time: reminder.time });
      });
    });

    return Object.keys(grouped).map((time) => ({
      time,
      medicines: grouped[time]
    }));
  };

  const groupedMedicines = groupMedicinesByTime(Medicine || []);

  const groupedPillCards = groupedMedicines.map((group, index) => (
    <Card key={index} w='470px' h='150px' mt={20} withBorder={true} radius={10} p='10px' shadow="sm">
      <Group position="apart">
        <Title order={5}>Dnes {group.time}</Title>
        <Button variant="filled" color="green">✓</Button>
      </Group>
      {group.medicines.map((med, idx) => (
        <Text key={idx} size="sm">{med.name} {med.oneDose} {/* TODO: add unit {medicine.unit} */} pill</Text>
      ))}
    </Card>
  ));

  return (
    <Box maw={{ base: 300, xxs: 300, xs: 300, sm: 600, md: 900, lg: 900, xl: 900 }} mx="auto" mt={50}>
      <Grid justify="space-between">
        <Box w={{ base: '440px', xxs: '440px', xs: '440px', sm: '440px', md: '892px', lg: '892px', xl: '892px' }} h='50'>
          <Group justify="space-between">
            <Title>{MedsTaker?.name ? MedsTaker.name : "MedsTaker.name"}</Title>
            <Group justify="flex-end" gap="xs">
              <AlarmMedicine />
              <CreateMedicine />
            </Group>
          </Group>
        </Box>
        <Box w='100%' h='1px' mt={30} mb={30} style={{ backgroundColor: theme.colors.gray[4] }}></Box>
        {pill}
        <Box w='100%' h='1px' mt={30} mb={30} style={{ backgroundColor: theme.colors.gray[4] }}></Box>
        {groupedPillCards}
      </Grid>
    </Box>
  );
}

export default Pilltaker;