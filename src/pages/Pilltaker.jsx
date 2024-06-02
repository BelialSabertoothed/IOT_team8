import React, { useState, useEffect } from 'react';
import {
  Grid, Box, Text, Title, useMantineTheme, Group, Card, Button, Stack, Flex, Checkbox
} from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';
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

  const [takenStates, setTakenStates] = useState({});
  const [sortedMedicine, setSortedMedicine] = useState([]);

  useEffect(() => {
    if (Medicine) {
      const initialState = {};
      Medicine.forEach((medicine) => {
        initialState[medicine._id] = false; // Default state is "Neužito"
      });
      setTakenStates(initialState);
      setSortedMedicine(sortByNextDose(Medicine));
    }
  }, [Medicine]);

  const handleButtonClick = (id) => {
    setTakenStates(prevState => {
      const newState = !prevState[id];
      const updatedMedicine = sortedMedicine.map(medicine => {
        if (medicine._id === id) {
          if (newState && !prevState[id]) { // Only decrease count when changing to "Užito"
            medicine.history.push(new Date().toISOString()); // Add to history
            medicine.count -= medicine.oneDose; // Decrease the count only when set to "Užito"
          }
        }
        return medicine;
      });
      const newSortedMedicine = sortByNextDose(updatedMedicine);
      setSortedMedicine(newSortedMedicine);

      // Set timeout to reset the state to "Neužito" one hour before the next dose
      const nextDoseTime = getNextDoseTime(Medicine.find(m => m._id === id));
      const resetTime = new Date(nextDoseTime.getTime() - 60 * 60 * 1000); // 1 hour before next dose

      const now = new Date();
      const delay = resetTime - now;
      if (delay > 0) {
        setTimeout(() => {
          setTakenStates((prevState) => ({
            ...prevState,
            [id]: false,
          }));
          // Re-sort after reset
          const resetSortedMedicine = sortByNextDose(updatedMedicine);
          setSortedMedicine(resetSortedMedicine);
        }, delay);
      }

      return { ...prevState, [id]: newState };
    });
  };

  const expandDailyPeriod = (period) => {
    if (period.includes('daily')) {
      return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    }
    return period;
  };

  const filterMedicinesInNext48Hours = (medicines) => {
    const now = new Date();
    const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 hours from now

    const filteredMedicines = medicines.filter(medicine => {
      const nextDoseTime = getNextDoseTime({ ...medicine, period: expandDailyPeriod(medicine.period) });
      console.log(`Next dose time for ${medicine.name}:`, nextDoseTime); // Log next dose time
      return nextDoseTime >= now && nextDoseTime <= in48Hours;
    });

    console.log("Filtered medicines in next 48 hours:", filteredMedicines);
    return filteredMedicines;
  };

  const getNextDoseTime = (medicine) => {
    const now = new Date();
    const currentDay = now.getDay();
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    let nextDose = null;

    const applicableDays = expandDailyPeriod(medicine.period);

    applicableDays.forEach(day => {
      const dayIndex = daysOfWeek.indexOf(day);
      medicine.reminder.forEach(reminder => {
        const [hour, minute] = reminder.time.split(':').map(Number);
        const reminderTime = new Date(now);
        reminderTime.setHours(hour, minute, 0, 0);

        if (dayIndex > currentDay || (dayIndex === currentDay && reminderTime > now)) {
          reminderTime.setDate(now.getDate() + ((dayIndex - currentDay + 7) % 7));
        } else {
          reminderTime.setDate(now.getDate() + ((dayIndex - currentDay + 7) % 7));
        }

        if (nextDose === null || reminderTime < nextDose) {
          nextDose = reminderTime;
        }
      });
    });

    console.log(`Next dose time for ${medicine.name}:`, nextDose);
    return nextDose;
  };

  const sortByNextDose = (medicines) => {
    const sorted = medicines.sort((a, b) => {
      const nextDoseA = getNextDoseTime({ ...a, period: expandDailyPeriod(a.period) });
      const nextDoseB = getNextDoseTime({ ...b, period: expandDailyPeriod(b.period) });
      return nextDoseA - nextDoseB;
    });

    console.log("Sorted medicines by next dose:", sorted);
    return sorted;
  };

  const groupMedicinesByTime = (medicines) => {
    const grouped = {};

    medicines.forEach((medicine) => {
      medicine.reminder.forEach((reminder) => {
        const nextDoseTime = getNextDoseTime({ ...medicine, reminder: [reminder], period: expandDailyPeriod(medicine.period) });
        if (!grouped[nextDoseTime]) {
          grouped[nextDoseTime] = [];
        }
        grouped[nextDoseTime].push({ ...medicine, time: reminder.time });
      });
    });

    const groupedArray = Object.keys(grouped).map((time) => ({
      time: new Date(time),
      medicines: grouped[time]
    })).sort((a, b) => a.time - b.time);

    console.log("Grouped medicines by time:", groupedArray);
    return groupedArray;
  };

  const handleGroupCheck = (time) => {
    setTakenStates(prevState => {
      const updatedTakenStates = { ...prevState };
      const updatedMedicine = sortedMedicine.map(medicine => {
        const medicineTime = getNextDoseTime({ ...medicine, period: expandDailyPeriod(medicine.period) });
        if (medicineTime.getTime() === time.getTime()) {
          if (!updatedTakenStates[medicine._id]) { // Only decrease count if not already taken
            updatedTakenStates[medicine._id] = true;
            medicine.history.push(new Date().toISOString());
            medicine.count -= medicine.oneDose;
          }
        }
        return medicine;
      });
      const newSortedMedicine = sortByNextDose(updatedMedicine);
      setSortedMedicine(newSortedMedicine);

      return updatedTakenStates;
    });
  };

  const groupedMedicines = groupMedicinesByTime(filterMedicinesInNext48Hours(sortedMedicine));

  const groupedPillCards = groupedMedicines.map((group, index) => {
    const allTaken = group.medicines.every(medicine => takenStates[medicine._id]);
    const dayOfWeek = group.time.toLocaleString('en-US', { weekday: 'long' });
    const date = group.time.toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const time = group.time.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });

    return (
      <Card
        key={index}
        w='440px'
        h='150px'
        mt={20}
        withBorder={true}
        radius={10}
        p='10px'
        shadow="sm"
        style={{ backgroundColor: allTaken ? theme.colors.gray[2] : 'white' }}
      >
        <Group position="apart">
          <Checkbox
            p='10px'
            checked={allTaken}
            onChange={() => handleGroupCheck(group.time)}
          />
          <Title order={5}>{dayOfWeek}, {date} - {time}</Title>
        </Group>
        {group.medicines.map((med, idx) => (
          <Text
            key={idx}
            size="sm"
            style={{
              textDecoration: takenStates[med._id] ? 'line-through' : 'none', marginLeft: '57px', marginTop: '5px'
            }}
          >
            {med.name} {med.oneDose} pill
          </Text>
        ))}
      </Card>
    );
  });

  const pill = sortedMedicine.map((medicine) => (
    <Card w='290px' h='200px' mt={20} key={medicine._id} withBorder={true} radius={10} p='20px' shadow="sm">
      <Flex direction="column" justify="space-between" h="100%">
        <Stack spacing="lg">
          <Group position="apart">
            <Title order={4} style={{ marginBottom: '0.5rem' }}>
              {medicine.name} {medicine.oneDose} pill
            </Title>
            <IconSettings
              size={20}
              style={{ marginLeft: 'auto', cursor: 'pointer', position: 'relative', top: '-10px'}}
              /*onClick={() => update}*/
            />
          </Group>
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

  return (
    <Box maw={{ base: 300, xxs: 300, xs: 300, sm: 600, md: 900, lg: 900, xl: 900 }} mx="auto" mt={50}>
      <Grid justify="space-between" mb={50}>
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
        {pill<=0?null:<Box w='100%' h='1px' mt={30} mb={30} style={{ backgroundColor: theme.colors.gray[4] }}></Box>}
        {groupedPillCards}
      </Grid>
    </Box>
  );
}

export default Pilltaker;