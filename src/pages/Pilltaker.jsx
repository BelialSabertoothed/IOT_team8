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
  const [groupedMedicines, setGroupedMedicines] = useState([]);

  useEffect(() => {
    if (Medicine) {
      const initialState = {};
      Medicine.forEach((medicine) => {
        initialState[medicine._id] = false; // Default state is "Neužito"
      });
      setTakenStates(initialState);
      const filteredAndGrouped = groupMedicinesByTime(filterMedicinesInNext48Hours(Medicine));
      setGroupedMedicines(filteredAndGrouped);
      console.log("Filtered and Grouped Medicines:", filteredAndGrouped);
    }
  }, [Medicine]);

const handleButtonClick = (id, dose) => {
  setTakenStates(prevState => {
    const newState = !prevState[id];
    const updatedMedicines = groupedMedicines.map(group => ({
      ...group,
      medicines: group.medicines.map(medicine => {
        if (medicine._id === id) {
          if (newState && !prevState[id]) { // Only decrease count when changing to "Užito"
            medicine.history.push({
              startDate: new Date().toISOString(),
              endDate: new Date().toISOString(),
              state: "Active"
            }); // Add to history
            medicine.count = Math.max(0, medicine.count - dose); // Decrease the count by the dose amount, ensuring it doesn't go below 0
          }
        }
        return medicine;
      })
    }));

    const newGroupedMedicines = groupMedicinesByTime(filterMedicinesInNext48Hours(updatedMedicines.flatMap(group => group.medicines)));
    setGroupedMedicines(newGroupedMedicines);

    return { ...prevState, [id]: newState };
  });
};


  const parseRecurrenceRule = (rule) => {
    const ruleParts = rule.split(';');
    const ruleObj = {};
    ruleParts.forEach(part => {
      const [key, value] = part.split('=');
      ruleObj[key] = value;
    });
    return ruleObj;
  };

  const getReminderTimes = (reminder) => {
    const ruleObj = parseRecurrenceRule(reminder.recurrenceRule || '');
    const days = (ruleObj.BYDAY || '').split(',').map(day => {
      const dayMap = {
        SU: 0,
        MO: 1,
        TU: 2,
        WE: 3,
        TH: 4,
        FR: 5,
        SA: 6
      };
      return dayMap[day];
    }).filter(day => !isNaN(day)); // Filter out invalid days
    const hours = (ruleObj.BYHOUR || '').split(',').map(Number).filter(hour => !isNaN(hour)); // Filter out invalid hours
    const minutes = (ruleObj.BYMINUTE || '').split(',').map(Number).filter(min => !isNaN(min)); // Filter out invalid minutes
    const dose = reminder.dose || 0; // Ensure dose is included
    console.log(`Parsed reminder: days: ${days}, hours: ${hours}, minutes: ${minutes}, dose: ${dose}`);
    return { days, hours, minutes, dose };
  };  
  
  const getNextDoseTime = (medicine) => {
    const now = new Date();
    const currentDay = now.getDay();
    let nextDose = null;

    medicine.reminder.forEach(reminder => {
      const { days, hours, minutes } = getReminderTimes(reminder);

      days.forEach(day => {
        hours.forEach((hour, idx) => {
          const minute = minutes[idx];
          const reminderTime = new Date(now);
          reminderTime.setHours(hour, minute, 0, 0);

          if (day === currentDay && reminderTime > now) {
            // Reminder is later today
            if (nextDose === null || reminderTime < nextDose) {
              nextDose = reminderTime;
            }
          } else if (day > currentDay) {
            // Reminder is later this week
            reminderTime.setDate(now.getDate() + (day - currentDay));
            if (nextDose === null || reminderTime < nextDose) {
              nextDose = reminderTime;
            }
          } else if (day < currentDay) {
            // Reminder is next week
            reminderTime.setDate(now.getDate() + (7 - (currentDay - day)));
            if (nextDose === null || reminderTime < nextDose) {
              nextDose = reminderTime;
            }
          }
        });
      });
    });

    console.log(`Next dose time for ${medicine.name}:`, nextDose);
    return nextDose;
  };

  const filterMedicinesInNext48Hours = (medicines) => {
    const now = new Date();
    const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 hours from now

    const filteredMedicines = medicines.filter(medicine => {
      const nextDoseTime = getNextDoseTime(medicine);
      console.log(`Next dose time for ${medicine.name}:`, nextDoseTime); // Log next dose time
      const isInNext48Hours = nextDoseTime >= now && nextDoseTime <= in48Hours;
      console.log(`Is ${medicine.name} in next 48 hours?`, isInNext48Hours);
      return isInNext48Hours;
    });

    console.log("Filtered medicines in next 48 hours:", filteredMedicines);
    return filteredMedicines;
  };

  const groupMedicinesByTime = (medicines) => {
    const grouped = {};

    medicines.forEach((medicine) => {
      const nextDoseTime = getNextDoseTime(medicine);
      if (!nextDoseTime) return; // Skip if nextDoseTime is null
      const timeKey = nextDoseTime.toISOString().slice(0, 16); // Use date and hour:minute as key
      if (!grouped[timeKey]) {
        grouped[timeKey] = [];
      }
      grouped[timeKey].push({ ...medicine, time: nextDoseTime });
    });

    const groupedArray = Object.keys(grouped).map((timeKey) => ({
      time: new Date(timeKey),
      medicines: grouped[timeKey]
    })).sort((a, b) => a.time - b.time);

    console.log("Grouped medicines by time:", groupedArray);
    return groupedArray;
  };

  const handleGroupCheck = (time) => {
    setTakenStates(prevState => {
      const updatedTakenStates = { ...prevState };
      const updatedGroupedMedicines = groupedMedicines.map(group => {
        if (group.time.getTime() === time.getTime()) {
          return {
            ...group,
            medicines: group.medicines.map(medicine => {
              if (!updatedTakenStates[medicine._id]) { // Only decrease count if not already taken
                updatedTakenStates[medicine._id] = true;
                medicine.history.push({
                  startDate: new Date().toISOString(),
                  endDate: new Date().toISOString(),
                  state: "Active"
                });
                // Find the corresponding reminder for the specific time
                medicine.reminder.forEach(reminder => {
                  const { days, hours, minutes, dose } = getReminderTimes(reminder);
                  if (days.includes(time.getDay()) && hours.includes(time.getHours()) && minutes.includes(time.getMinutes())) {
                    medicine.count -= dose;
                    console.log(`Dose for ${medicine.name} deducted by ${dose}. Remaining count: ${medicine.count}`);
                  }
                });
              }
              return medicine;
            })
          };
        }
        return group;
      });
  
      const newGroupedMedicines = groupMedicinesByTime(filterMedicinesInNext48Hours(updatedGroupedMedicines.flatMap(group => group.medicines)));
      setGroupedMedicines(newGroupedMedicines);
      console.log("New Grouped Medicines after check:", newGroupedMedicines);
  
      return updatedTakenStates;
    });
  };
  

  const groupedPillCards = groupedMedicines.map((group, index) => {
    const allTaken = group.medicines.every(medicine => takenStates[medicine._id]);
    const localTime = new Date(group.time.getTime() - (group.time.getTimezoneOffset() * 60000));
    const dayOfWeek = localTime.toLocaleString('en-US', { weekday: 'long' });
    const date = localTime.toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const time = localTime.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
  
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
        {group.medicines.map((med, idx) => {
          let dose = 0;
          med.reminder.forEach(r => {
            const { days, hours, minutes } = getReminderTimes(r);
            if (days.includes(localTime.getDay()) && hours.includes(localTime.getHours()) && minutes.includes(localTime.getMinutes())) {
              dose = r.dose; // Set correct dose
            }
          });
  
          console.log(`Rendering medicine in group: ${med.name}, dose: ${dose}`);
  
          return (
            <Text
              key={idx}
              size="sm"
              style={{
                textDecoration: takenStates[med._id] ? 'line-through' : 'none', marginLeft: '57px', marginTop: '5px'
              }}
            >
              {med.name} {dose} pill
            </Text>
          );
        })}
      </Card>
    );
  });  
  

  const pillCards = groupedMedicines.flatMap(group => group.medicines).map(medicine => (
    <Card w='290px' h='200px' mt={20} key={medicine._id} withBorder={true} radius={10} p='20px' shadow="sm">
      <Flex direction="column" justify="space-between" h="100%">
        <Stack spacing="lg">
          <Group position="apart">
            <Title order={4} style={{ marginBottom: '0.5rem' }}>
              {medicine.name}
            </Title>
            <IconSettings
              size={20}
              style={{ marginLeft: 'auto', cursor: 'pointer', position: 'relative', top: '-10px'}}
              /*onClick={() => update}*/
            />
          </Group>
          <Text size="sm">{medicine.reminder.map(rem => {
            const { days, hours, minutes, dose } = getReminderTimes(rem);
            if (days.length === 7) {
              return `Daily at ${hours[0]}:${minutes[0] < 10 ? `0${minutes[0]}` : minutes[0]} - Dose: ${dose}`;
            }
            return `${days.map(day => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]).join(', ')} at ${hours[0]}:${minutes[0] < 10 ? `0${minutes[0]}` : minutes[0]} - Dose: ${dose}`;
          }).join(', ')}</Text>
          <Text size="sm">Zbývá {medicine.count} dávek</Text>
        </Stack>
        <Flex mt="auto" justify="center">
          <Button
            variant="filled"
            color={takenStates[medicine._id] ? 'black' : 'purple'}
            onClick={() => handleButtonClick(medicine._id, medicine.reminder[0]?.dose || 0)}
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
        {pillCards}
        <Box w='100%' h='1px' mt={30} mb={30} style={{ backgroundColor: theme.colors.gray[4] }}></Box>
        {groupedPillCards}
      </Grid>
    </Box>
  );
}

export default Pilltaker;