import React, { useState, useEffect } from 'react';
import {
  Grid, Box, Text, Title, useMantineTheme, Group, Card, Button, Stack, Flex, Checkbox, Modal
} from '@mantine/core';
import { IconSettings, IconPill } from '@tabler/icons-react';
//import { TbPill } from 'react-icons/tb';
import CreateMedicine from '../components/Medicine/createMedicine';
import UpdateMedicine from '../components/Medicine/updateMedicine';
import AlarmMedicine from '../components/Medicine/alarmMedicine';
import useAxiosFetch from '../hooks/useAxiosFetch';
import sendToServer from '../utils/SendToServer';
import { RRule } from 'rrule'

function Pilltaker() {
  const theme = useMantineTheme();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const medsTakerID = urlParams.get('medstaker');
  console.log("medsTaker id:", medsTakerID);
  const {
    isLoading: MedicinePending,
    data: Medicine,
    isError: MedicineError,
    errorStatus: MedicineErrorStatus,
    errorMessage: MedicineErrorMessage,
    refetch: MedicineRefresh
  } = useAxiosFetch(`/medicine/getByMedsTaker/` + medsTakerID);
  const {
    isLoading: MedsTakersPending,
    data: MedsTaker,
    isError: MedsTakersError,
    errorStatus: errorStatus,
    errorMessage: errorMessage,
    refetch: MedsTakersRefresh
  } = useAxiosFetch(`/medsTaker/get` + medsTakerID);
  const {
    isLoading: UnitsPending,
    data: Units,
    isError: UnitsError,
    errorStatus: UnitsErrorStatus,
    errorMessage: UnitsErrorMessage,
    refetch: UnitsRefresh
  } = useAxiosFetch(`/unit/list`);
  const MedicineCanBeTaken = []   //TODO get from server
  const [groupedMedicines, setGroupedMedicines] = useState([]);
  const [modalOpened, setModalOpened] = useState(false);            /*Neded*/
  const [selectedMedicine, setSelectedMedicine] = useState(null);   /*Neded*/

  useEffect(() => {
    if (Medicine) {
      console.log("Medicine data loaded:", Medicine);
      const filteredAndGrouped = MedicinesInNext24Hours(MedicineCanBeTaken,Medicine);
      setGroupedMedicines(filteredAndGrouped);
    }
  }, [Medicine]);

  const handlePillClick = (medicine) => {     /*Neded*/
    setSelectedMedicine(medicine);
    setModalOpened(true);
  };

  async function handleConfirmAddDose() {        /*Neded*/
    if (selectedMedicine) {
      selectedMedicine.count += selectedMedicine.addPerRefill;
      const translatedReminder = translateReminder(selectedMedicine.reminder)
      const id = selectedMedicine._id
      const request ={
        count: selectedMedicine.count,
        reminder: translatedReminder
      }
      console.log("medicine ubdate request:",request)
      const result = await sendToServer(`/medicine/update/`+id, request);
      if (result) {
        setModalOpened(false);
        setSelectedMedicine(null);
        location.reload()
      }else {
        alert('something went wrong')
      }
    }
  };

  const handleCancleAddDose = () => {             /*Neded*/
    setModalOpened(false);
    setSelectedMedicine(null);
  } 
  
  const translateReminder = (reminder) => {  
  let clonedArray = reminder.map(a => {return {...a}})       /*Neded*/
  clonedArray.forEach(element => {
      element.recurrenceRule = translateRRuleSring(element.recurrenceRule)
    });
    return clonedArray
  }

  const translateRRuleSring = (rruleStrig) => {     /*Neded*/
    const days = [RRule.MO,RRule.TU,RRule.WE,RRule.TH,RRule.FR,RRule.SA,RRule.SU]
    const rule = RRule.fromString(rruleStrig)
    let recurrenceRule = { byhour: [rule.origOptions.byhour], byminute: [rule.origOptions.byminute], byweekday: []}
    rule.origOptions.byweekday.forEach(element => {
      recurrenceRule.byweekday.push(days.indexOf(element))
    });
    return recurrenceRule
  }

  const getNextMedicineTime = (reminder) => {       /*Neded*/
    const now = new Date()
    let arreyNextTime = []
    reminder.forEach(element => {
      let rule = RRule.fromString(element.recurrenceRule)
      rule.options.count=1
      rule.options.dtstart= new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 
        now.getUTCHours() + 1, now.getUTCMinutes(), 0))
      arreyNextTime.push({time:rule.all()[0],dose:element.dose})
      //arreyNextTime.push({time:RRule.fromString(element.recurrenceRule+";COUNT=1").all()[0],dose:element.dose})
    });
    return arreyNextTime.sort((a, b) => (a.time.getTime() > b.time.getTime()) ? 1 : -1)
  }

  const getReminderTimes = (reminder) => {    /*Neded*/
    const ruleObj = RRule.fromString(reminder.recurrenceRule).origOptions
    let days = []
    ruleObj.byweekday.forEach(element => {
      days.push(element.weekday)
    });
    const hours = [ruleObj.byhour]
    const minutes = [ruleObj.byminute]
    const dose = reminder.dose || 0; 
    return { days, hours, minutes, dose };
  };

  const pillCanBeTaken = (medicine) => {     /*Neded*/
    return false //TODO 
  }

  const takePill = (medicine) => {         /*Neded*/
    //TODO 
  }

  const MedicinesInNext24Hours = (MedicineCanBeTaken, medicines) => {
    const now = new Date();
    const in24Hours = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() + 1, 
      now.getHours(), now.getMinutes(), 0)) // 24 hours from now
    let nextMedicineIn24hour = []
    let usedDose = []
    MedicineCanBeTaken.forEach(item => {
      const medicine = medicines.find((medicine) => medicine._id == item.id)
      const usedDoseIndex = usedDose.indexOf((dose) => dose.id == item.id)
      if (usedDoseIndex == -1) {
        usedDose.push({id:item.id, dose:item.dose})
        nextMedicineIn24hour.push({medicine:medicine, time:now, dose:item.dose, dosesUntilNow:item.dose, canBeTaken:true})
      }
      else {
        usedDose[usedDoseIndex].dose += item.dose
        nextMedicineIn24hour.push({medicine:medicine, time:now, dose:item.dose, dosesUntilNow:usedDose[usedDoseIndex].dose, canBeTaken:true})
      }
    })
    console.log("time 24:",in24Hours)
    medicines.forEach(medicin => {
      const nextMedicine = getNextMedicineTime(medicin.reminder)
      console.log("nextMedicine:",nextMedicine)
      nextMedicine.forEach(item => {
        if(item.time.valueOf() < in24Hours.valueOf()) {
          const usedDoseIndex = usedDose.map(e => e.id).indexOf(medicin._id)

          if (usedDoseIndex == -1) {
            usedDose.push({id:medicin._id, dose:item.dose})
            nextMedicineIn24hour.push({medicine:medicin, time:item.time, dose:item.dose, dosesUntilNow:item.dose, canBeTaken:false})
          }
          else {
            usedDose[usedDoseIndex].dose += item.dose
            nextMedicineIn24hour.push({medicine:medicin, time:item.time, dose:item.dose, dosesUntilNow:usedDose[usedDoseIndex].dose, canBeTaken:false})
          }
        }
      })
    });
    nextMedicineIn24hour.sort((a, b) => (a.time > b.time) ? 1 : -1)
    console.log("nextMedicineIn24hour:",nextMedicineIn24hour)
    const grouped = {};
    nextMedicineIn24hour.forEach((medicine) => {
      if (!grouped[medicine.time.toISOString().slice(0, 16)]) {
        grouped[medicine.time.toISOString().slice(0, 16)] = [];
      }
      grouped[medicine.time.toISOString().slice(0, 16)].push(medicine);
    });

    const groupedArray = Object.keys(grouped).map((timeKey) => ({
      time:grouped[timeKey][0].time,
      canBeTaken:grouped[timeKey][0].canBeTaken,
      medicines: grouped[timeKey]
    })).sort((a, b) => a.time - b.time);
    console.log("grouped nextMedicineIn24hour:",groupedArray)
    return groupedArray;
  }; 

  const getUnitName = (unitId) => {                   /*Neded*/
    const unit = Units?.find(u => u._id === unitId);
    return unit ? unit.name : '';
  };

  const formatReminderTimes = (reminders) => {    /*Neded*/
    const dailyTimes = [];
    const specificTimes = [];

    reminders.forEach(rem => {
      const { days, hours, minutes } = getReminderTimes(rem);
      const time = `${hours[0]}:${minutes[0] < 10 ? `0${minutes[0]}` : minutes[0]}`;
      if (days.length === 7) {
        dailyTimes.push(time);
      } else {
        specificTimes.push(
          `${days.map(day => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day]).join(', ')} at ${time}`
        );
      }
    });

    let result = '';
    if (dailyTimes.length > 0) {
      result += `Daily at ${dailyTimes.join(' and ')}`;
    }
    if (specificTimes.length > 0) {
      if (result) result += '; ';
      result += specificTimes.join('; ');
    }

    return result;
  };

  // Always render all medicines
  const allPillCards = Medicine?.map(medicine => {
    const unitName = getUnitName(medicine.unit);
    const nextDose = getNextMedicineTime(medicine.reminder)[0]
    const isRefillNeeded = medicine.count < nextDose.dose;
    const canBeTaken = pillCanBeTaken(medicine)
    
    return (
      <Card 
        w='290px' 
        h='200px' 
        mt={20} 
        key={medicine._id} 
        withBorder={true} 
        radius={10} 
        p='20px' 
        shadow="sm"
        style={{ backgroundColor: isRefillNeeded ? theme.colors.gray[2] : 'white' }}
      >
        <Flex direction="column" justify="space-between" h="100%">
          <Stack spacing="lg">
            <Group position="apart">
              <Title order={4} style={{ marginBottom: '0.5rem' }}>
                {medicine.name}
                <Text
                  size="xs"
                  style={{
                    display: 'inline',
                    marginLeft: '8px'
                  }}
                >
                  {nextDose.dose || 0} {unitName}
                </Text>
              </Title>
              <Group style={{ marginLeft: 'auto' }}>
                <IconPill //TbPill
                  size={20}
                  style={{ cursor: 'pointer', position: 'relative', top: '-10px' }}
                  onClick={() => handlePillClick(medicine)}
                />
                <UpdateMedicine medicine={medicine} reminder={translateReminder(medicine.reminder)}/>
              </Group>
            </Group>
            <Text size="sm">{formatReminderTimes(medicine.reminder)}</Text>
            <Text size="sm"> Doses left: {medicine.count} {unitName} </Text>
          </Stack>
          <Flex mt="auto" justify="center">
            <Button
              variant="filled"
              color={isRefillNeeded ? 'gray' : canBeTaken ? 'purple' : 'black'}
              onClick={() => isRefillNeeded ? handlePillClick(medicine) : canBeTaken ? takePill() : null}
              style={{ width: '250px', height: '35px' }}
            >
              {isRefillNeeded ? 'Refill Dose' : canBeTaken ? 'Take Medicine' : 'Next on '+ nextDose.time.toUTCString().slice(0, 22)}
            </Button>
          </Flex>
        </Flex>
      </Card>
    );
  });

  // Render grouped medicines for the next 24 hours
  const groupedPillCards = groupedMedicines.map((group, index) => {   
    const localTime = new Date(group.time.getTime() - (group.time.getTimezoneOffset() * 60000));
    const dayOfWeek = localTime.toLocaleString('en-US', { weekday: 'long' });
    const date = localTime.toLocaleDateString('cs-CZ', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const time = localTime.getUTCHours();
    console.log("group:",group)
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
        style={{ backgroundColor: group.canBeTaken ? 'white':theme.colors.gray[2]}}
      >
        <Group position="apart">
          <Title order={5}>{group.canBeTaken?"NOW":group.time.toUTCString().slice(0, 22)}</Title>
        </Group>
        {group.medicines.map((med, idx) => {
          return (
            <Group key={idx} style={{ marginLeft: '57px', marginTop: '5px' }}>
              <Text size="sm">
                {med.medicine.name} {med.dose} {getUnitName(med.medicine.unit)} {med.dosesUntilNow > med.medicine.count?'! (Need at least '+med.dosesUntilNow+' '+getUnitName(med.medicine.unit)+')':null}
              </Text>
            </Group>
          );
        })}
        {group.canBeTaken ? <Button
            p='10px'
            onClick={() => /*handleGroupCheck(group.time)*/{}}
          >Teke Medicine</Button>:null}
      </Card>
    );
  });

  return (
    <Box maw={{ base: 300, xxs: 300, xs: 300, sm: 600, md: 900, lg: 900, xl: 900 }} mx="auto" mt={50}>
      <Grid justify="space-between">
        <Box w={{ base: '440px', xxs: '440px', xs: '440px', sm: '440px', md: '892px', lg: '892px', xl: '892px' }} h='50'>
          <Group justify="space-between">
            <Title>{MedsTaker?.name ? MedsTaker.name : "MedsTaker.name"}</Title>
            <Group justify="flex-end" gap="xs">
              {/*<AlarmMedicine />*/}
              <CreateMedicine />
            </Group>
          </Group>
        </Box>
        <Box w='100%' h='1px' mt={30} mb={30} style={{ backgroundColor: theme.colors.gray[4] }}></Box>
        {allPillCards}
        <Box w='100%' h='1px' mt={30} mb={30} style={{ backgroundColor: theme.colors.gray[4] }}></Box>
        {groupedPillCards}
      </Grid>
      <Modal
        centered
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
      >
        <Title order={2} align="center" mb="md">Confirm Dose Refill</Title>
        <Stack spacing="md" align="center">
          <Text align="center">Are you sure you want to add {selectedMedicine?.addPerRefill} doses to {selectedMedicine?.name}?</Text>
          <Group position="center">
            <Button onClick={() => handleConfirmAddDose()}>Confirm</Button>
            <Button variant="outline" onClick={() => handleCancleAddDose()}>Cancel</Button>
          </Group>
        </Stack>
      </Modal>
    </Box>
  );
}

export default Pilltaker;

/*
import React, { useState, useEffect } from 'react';
import {
  Grid, Box, Text, Title, useMantineTheme, Group, Card, Button, Stack, Flex, Checkbox, Modal
} from '@mantine/core';
import { IconSettings, IconPill } from '@tabler/icons-react';
//import { TbPill } from 'react-icons/tb';
import CreateMedicine from '../components/Medicine/createMedicine';
import AlarmMedicine from '../components/Medicine/alarmMedicine';
import useAxiosFetch from '../hooks/useAxiosFetch';

function Pilltaker() {
  const theme = useMantineTheme();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const medsTakerID = urlParams.get('medstaker');
  console.log("medsTaker id:", medsTakerID);
  const {
    isLoading: MedicinePending,
    data: Medicine,
    isError: MedicineError,
    errorStatus: MedicineErrorStatus,
    errorMessage: MedicineErrorMessage,
    refetch: MedicineRefresh
  } = useAxiosFetch(`/medicine/getByMedsTaker/` + medsTakerID);
  const {
    isLoading: MedsTakersPending,
    data: MedsTaker,
    isError: MedsTakersError,
    errorStatus: errorStatus,
    errorMessage: errorMessage,
    refetch: MedsTakersRefresh
  } = useAxiosFetch(`/medsTaker/get` + medsTakerID);

  const {
    isLoading: UnitsPending,
    data: Units,
    isError: UnitsError,
    errorStatus: UnitsErrorStatus,
    errorMessage: UnitsErrorMessage,
    refetch: UnitsRefresh
  } = useAxiosFetch(`/unit/list`);

  const [takenStates, setTakenStates] = useState({});
  const [groupedMedicines, setGroupedMedicines] = useState([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  useEffect(() => {
    if (Medicine) {
      console.log("Medicine data loaded:", Medicine);
      const initialState = {};
      Medicine.forEach((medicine) => {
        initialState[medicine._id] = false; // Default state is "Not Taken"
      });
      setTakenStates(initialState);
      const filteredAndGrouped = groupMedicinesByTime(filterMedicinesInNext48Hours(Medicine));
      setGroupedMedicines(filteredAndGrouped);
    }
  }, [Medicine]);

  const handleButtonClick = (id, dose) => {
    console.log(`Button clicked for medicine ID: ${id}`);
    setTakenStates(prevState => {
      const newState = !prevState[id];

      const updatedMedicines = Medicine.map(medicine => {
        if (medicine._id === id && newState && !prevState[id]) {
          medicine.history.push({
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            state: "Active"
          });
          medicine.count = Math.max(0, medicine.count - dose);
        }
        return medicine;
      });

      const newGroupedMedicines = groupMedicinesByTime(filterMedicinesInNext48Hours(updatedMedicines));
      setGroupedMedicines(newGroupedMedicines);

      return { ...prevState, [id]: newState };
    });
  };

  const handlePillClick = (medicine) => {
    setSelectedMedicine(medicine);
    setModalOpened(true);
  };

  const handleConfirmAddDose = () => {
    if (selectedMedicine) {
      selectedMedicine.count += selectedMedicine.addPerRefill;
      setModalOpened(false);
      setSelectedMedicine(null);
    }
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

    return nextDose;
  };

  const filterMedicinesInNext48Hours = (medicines) => {
    const now = new Date();
    const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000); // 48 hours from now

    const filteredMedicines = medicines.filter(medicine => {
      const nextDoseTime = getNextDoseTime(medicine);
      const isInNext48Hours = nextDoseTime >= now && nextDoseTime <= in48Hours;
      return isInNext48Hours;
    });

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

      return updatedTakenStates;
    });
  };

  const getUnitName = (unitId) => {
    const unit = Units.find(u => u._id === unitId);
    return unit ? unit.name : '';
  };

  const formatReminderTimes = (reminders) => {
    const dailyTimes = [];
    const specificTimes = [];

    reminders.forEach(rem => {
      const { days, hours, minutes } = getReminderTimes(rem);
      const time = `${hours[0]}:${minutes[0] < 10 ? `0${minutes[0]}` : minutes[0]}`;
      if (days.length === 7) {
        dailyTimes.push(time);
      } else {
        specificTimes.push(
          `${days.map(day => ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][day]).join(', ')} at ${time}`
        );
      }
    });

    let result = '';
    if (dailyTimes.length > 0) {
      result += `Daily at ${dailyTimes.join(' and ')}`;
    }
    if (specificTimes.length > 0) {
      if (result) result += '; ';
      result += specificTimes.join('; ');
    }

    return result;
  };

  // Always render all medicines
  const allPillCards = Medicine?.map(medicine => {
    const unitName = getUnitName(medicine.unit);
    const isRefillNeeded = medicine.count === 0;
    const isTaken = takenStates[medicine._id];

    console.log(`Rendering card for: ${medicine.name}, isRefillNeeded: ${isRefillNeeded}, isTaken: ${isTaken}`);

    return (
      <Card 
        w='290px' 
        h='200px' 
        mt={20} 
        key={medicine._id} 
        withBorder={true} 
        radius={10} 
        p='20px' 
        shadow="sm"
        style={{ backgroundColor: isRefillNeeded ? theme.colors.gray[2] : 'white' }}
      >
        <Flex direction="column" justify="space-between" h="100%">
          <Stack spacing="lg">
            <Group position="apart">
              <Title order={4} style={{ marginBottom: '0.5rem' }}>
                {medicine.name}
                <Text
                  size="xs"
                  style={{
                    display: 'inline',
                    marginLeft: '8px'
                  }}
                >
                  {medicine.reminder[0]?.dose || 0} {unitName}
                </Text>
              </Title>
              <Group style={{ marginLeft: 'auto' }}>
                <IconPill //TbPill
                  size={20}
                  style={{ cursor: 'pointer', position: 'relative', top: '-10px' }}
                  onClick={() => handlePillClick(medicine)}
                />
                <IconSettings
                  size={20}
                  style={{ cursor: 'pointer', position: 'relative', top: '-10px' }}
                  //onClick={() => update}
                  />
                  </Group>
                </Group>
                <Text size="sm">{formatReminderTimes(medicine.reminder)}</Text>
                <Text size="sm"> Doses left {medicine.count} </Text>
              </Stack>
              <Flex mt="auto" justify="center">
                <Button
                  variant="filled"
                  color={isRefillNeeded ? 'gray' : isTaken ? 'black' : 'purple'}
                  onClick={() => isRefillNeeded ? handlePillClick(medicine) : handleButtonClick(medicine._id, medicine.reminder[0]?.dose || 0)}
                  style={{ width: '250px', height: '35px' }}
                >
                  {isRefillNeeded ? 'Refill Dose' : (isTaken ? 'Taken' : 'Not Taken')}
                </Button>
              </Flex>
            </Flex>
          </Card>
        );
      });
    
      // Render grouped medicines for the next 48 hours
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
    
              return (
                <Group key={idx} style={{ marginLeft: '57px', marginTop: '5px' }}>
                  <Text
                    size="sm"
                    style={{
                      textDecoration: takenStates[med._id] ? 'line-through' : 'none'
                    }}
                  >
                    {med.name} {dose} {getUnitName(med.unit)}
                  </Text>
                </Group>
              );
            })}
          </Card>
        );
      });
    
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
            {allPillCards}
            <Box w='100%' h='1px' mt={30} mb={30} style={{ backgroundColor: theme.colors.gray[4] }}></Box>
            {groupedPillCards}
          </Grid>
          <Modal
            centered
            opened={modalOpened}
            onClose={() => setModalOpened(false)}
          >
            <Title order={2} align="center" mb="md">Confirm Dose Refill</Title>
            <Stack spacing="md" align="center">
              <Text align="center">Are you sure you want to add {selectedMedicine?.addPerRefill} doses to {selectedMedicine?.name}?</Text>
              <Group position="center">
                <Button onClick={handleConfirmAddDose}>Confirm</Button>
                <Button variant="outline" onClick={() => setModalOpened(false)}>Cancel</Button>
              </Group>
            </Stack>
          </Modal>
        </Box>
      );
    }
    
    export default Pilltaker;
    
*/