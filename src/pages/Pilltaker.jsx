import React, { useState, useEffect } from 'react';
import {
  Grid, Box, Text, Title, useMantineTheme, Group, Card, Button, Stack, Flex, Checkbox, Modal, Badge,
  ScrollArea, Accordion, Space
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { IconSettings, IconPill, IconArrowBackUp, IconPlus } from '@tabler/icons-react'
import CreateMedicine from '../components/Medicine/createMedicine';
import UpdateMedicine from '../components/Medicine/updateMedicine';
import AlarmMedicine from '../components/Medicine/alarmMedicine';
import useAxiosFetch from '../hooks/useAxiosFetch';
import sendToServer from '../utils/SendToServer';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import UpdateMedsTaker from '../components/MedsTaker/updateMedsTaker';


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
  const [modalOpened, setModalOpened] = useState(false);           
  const [selectedMedicine, setSelectedMedicine] = useState(null);   
  const [events, setEvents] = useState([])
  console.log("medsTaker:", MedsTaker);
  

  useEffect(() => {
    if (Medicine) {
      console.log("Medicine data loaded:", Medicine);
      const events = GetEvents(Medicine);
      setEvents(events);
    }
  }, [Medicine]);

  function parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
  }

  const GetEvents = (medicines) => {  //events={[  { title: 'event 1', date: '2024-06-12' },  { title: 'event 2', date: '2024-06-17' }]}
    let now = new Date()
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset()) 
    const ISOnow = now.toISOString()
    console.log("ISOnow",ISOnow)
    let arreyNextMedicine = []
    console.log("events medicine:",medicines)
    medicines.forEach(medicine => {
      const unitName = getUnitName(medicine.unit)
      medicine.reminder.forEach(element => {
        let rule = RRule.fromString(element.recurrenceRule)
        rule.options.dtstart = now
        rule.options.until = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 3 , 0, 0, 0, 0))
        const times = rule.all()
        times.forEach(time => {
          time.setMinutes(time.getMinutes() + time.getTimezoneOffset()) 
          arreyNextMedicine.push({date:time.toISOString(), title:medicine.name+' '+element.dose+' '+unitName, state:null})
        });
      });

      medicine.history.forEach(element => {
        if (element.startDate < ISOnow) {
          let time = parseISOString(element.startDate)
          time.setMinutes(time.getMinutes() + time.getTimezoneOffset()) 
          arreyNextMedicine.push({date:time.toISOString(), title:medicine.name+' '+element.dose+' '+unitName, 
          state:element.state, backgroundColor: element.state== "Taken"?'green': element.state=='Forgotten'?'red':'purple'})
        }
        else {
          const index = arreyNextMedicine.indexOf((item) => 
            (parseISOString(item.date).valueOf() === parseISOString(element.startDate).valueOf()) && 
            (item.title === medicine.name+' '+element.dose+' '+unitName))
          if(index != -1){
            arreyNextMedicine[index].state = element.state
            arreyNextMedicine[index].backgroundColor = element.state == "Taken"?'green': element.state=='Forgotten'?'red':'purple'
          } 
        }
      });
    }); 

    return arreyNextMedicine
  };
  
  const handlePillClick = (medicine) => {     
    setSelectedMedicine(medicine);
    setModalOpened(true);
  };

  async function handleConfirmAddDose() {        
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

  const handleCancleAddDose = () => {             
    setModalOpened(false);
    setSelectedMedicine(null);
  } 
  
  const translateReminder = (reminder) => {  
  let clonedArray = reminder.map(a => {return {...a}})       
  clonedArray.forEach(element => {
      element.recurrenceRule = translateRRuleSring(element.recurrenceRule)
    });
    return clonedArray
  }

  const translateRRuleSring = (rruleStrig) => {     
    const days = [RRule.MO,RRule.TU,RRule.WE,RRule.TH,RRule.FR,RRule.SA,RRule.SU]
    const rule = RRule.fromString(rruleStrig)
    let recurrenceRule = { byhour: [rule.origOptions.byhour], byminute: [rule.origOptions.byminute], byweekday: []}
    rule.origOptions.byweekday.forEach(element => {
      recurrenceRule.byweekday.push(days.indexOf(element))
    });
    return recurrenceRule
  }

  const getNextMedicineTime = (reminder) => {       
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

  const getReminderTimes = (reminder) => {    
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

  const getUnitName = (unitId) => {                   
    const unit = Units?.find(u => u._id === unitId);
    return unit ? unit.name : '';
  };

  const formatReminderTimes = (reminders, unit) => {    
    const everyTimes = [];

    reminders.forEach(rem => {
      const { days, hours, minutes, dose } = getReminderTimes(rem);
      const time = `${hours[0]}:${minutes[0] < 10 ? `0${minutes[0]}` : minutes[0]}`;
      if (days.length === 7) {
        everyTimes.push(`${time} - Daily / ${dose} ${getUnitName(unit)}`)
      } else {
        everyTimes.push(
          `${time} - ${days.map(day => ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][day]).join(', ') } / ${dose} ${getUnitName(unit)}`
        );
      }
    });
    return everyTimes;
  };


  // Always render all medicines
  const allPillCards = Medicine?.map(medicine => {
    const unitName = getUnitName(medicine.unit);
    const nextDose = getNextMedicineTime(medicine.reminder)[0]
    const isRefillNeeded = medicine.count < nextDose.dose;
    const dataText = formatReminderTimes(medicine.reminder, medicine.unit)
    console.log(dataText)

    let dates = dataText.map((element, index) => (<Text size="sm" mb={5} key={medicine._id+'_'+index}>{element}</Text>))
    
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
              <Group>
                <Box w={205} mt={-5}>
                  <Title order={4} textWrap="nowrap" lineClamp={2}> {medicine.name} </Title>
                </Box>
                <Box w={10} mt={-10} h={30} ml={-25} bg={isRefillNeeded ?"linear-gradient(270deg, rgba(233, 236, 239) 0%, rgba(0, 0, 0, 0) 100%)":"linear-gradient(270deg, rgba(255, 255, 255, 1) 0%, rgba(0, 0, 0, 0) 100%)"}></Box>
              </Group>
              <Group style={{ marginLeft: 'auto' }}>
                <UpdateMedicine medicine={medicine} reminder={translateReminder(medicine.reminder)}/>
              </Group>
            </Group>
            <ScrollArea /* bg={'red'} */ h={80} mb={1} type="auto">
              {dates}
            </ScrollArea>
          </Stack>
          <Button
             h={35}
            variant="filled"
            color={isRefillNeeded ? 'gray' : /* canBeTaken ? */ 'purple' /* : 'black' */}
            onClick={() => /* isRefillNeeded ?  */handlePillClick(medicine)/*   : canBeTaken ? takePill() : null */}
            /* rightSection={<IconDownload size={14} />} */
          >
            {isRefillNeeded ? 'Refill Dose' : /* canBeTaken ? 'Take Medicine' : */ <Group justify="space-between"><div>Doses left: {medicine.count} {unitName}</div>
            <IconPlus size={20}/>
              </Group>/* 'Next on '+ nextDose.time.toUTCString().slice(0, 22) */}
          </Button>
        </Flex>
      </Card>
    );
  });
  return (
    <Box maw={{ base: 300, xxs: 300, xs: 300, sm: 600, md: 900, lg: 900, xl: 900 }} mx="auto" mt={50}>
      <Button mt={-130} mb={-40} ml={-20} onClick={() => (window.location.replace("/Home"))} leftSection={<IconArrowBackUp size={14} />} variant="transparent">
        Home
      </Button>
      <Grid justify="space-between">
        <Box w={{ base: '440px', xxs: '440px', xs: '440px', sm: '440px', md: '892px', lg: '892px', xl: '892px' }} h='50'>
          <Group justify="space-between">
            <Title>{MedsTaker?.name ? MedsTaker.name : "MedsTaker.name"}</Title>
            <Group justify="flex-end" gap="xs">
              {/*<AlarmMedicine />*/}
              <CreateMedicine />
              <UpdateMedsTaker medsTaker={MedsTaker !== null ?(MedsTaker):''}/>
            </Group>
          </Group>
        </Box>
        <Box w='100%' h='1px' mt={30} mb={30} style={{ backgroundColor: theme.colors.gray[4] }}></Box>
        <Group>{allPillCards}</Group>
      </Grid>
      {(Medicine)?.length>0?<><Box w='100%' h='1px' mt={50} mb={30} style={{ backgroundColor: theme.colors.gray[4] }}></Box>
      <FullCalendar
        plugins={[ dayGridPlugin, timeGridPlugin, listPlugin ]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridWeek,timeGridDay,listWeek',
        }}
        initialView='listWeek'
        events={events}
      />
      <Space h="xl"/></>:null}
      <Modal  centered opened={modalOpened} onClose={() => setModalOpened(false)}>
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