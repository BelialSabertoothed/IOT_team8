import React, { useState } from 'react';
import { AlarmClock } from 'lucide-react';
import { Grid, Title, Group, Container, Text, } from '@mantine/core';
import CreateMedicine from '../components/Medicine/createMedicine';

const mockdata = [
  { name: 'Paralen', days: ['Mon', 'Wed', 'Fri'], time: ['8:00 AM']},
  { name: 'Ibalgin', days: ['Tue', 'Thu', 'Sat'], time: ['7:00 PM', '8:00 AM']},
  { name: 'Fluorouracil', days: ['Mon', 'Wed', 'Fri'], time: ['7:00 PM']},
  { name: 'Zyrtec', days: ['Tue', 'Thu', 'Sat'], time: ['8:00 AM']},
  { name: 'Atomoxetin', days: ['Mon', 'Wed', 'Fri'], time: ['8:00 AM']},
  { name: 'Celaskon', days: ['Tue', 'Thu', 'Sat'], time: ['7:00 PM', '8:00 AM']},
  { name: 'Mucosolvan', days: ['Mon', 'Wed', 'Fri'], time: ['7:00 PM']},
  { name: 'Novalgin', days: ['Tue', 'Thu', 'Sat'], time: ['8:00 AM']},
];

function Medstaker() {
  const [medstakerName, setMedstakerName] = useState('Grandma Nonna');
  const [medsData, setMedsData] = useState(mockdata);

  const pills = medsData.map((pill, index) => (
    <Container
      key={index} w={{ base: '470'}} h='200'
      style={{ borderRadius: '10px', margin: '5px', backgroundColor: '#b838fd', padding: '10px' }}
    >
      <Group justify="space-between">
        <Title style={{ paddingLeft: '2%', marginTop: '5%' }}>{pill.name}</Title>
        <Group style={{  marginLeft: '2%' }}>
          <Text style={{ paddingRight: '2%' }}>Days: {pill.days.join(', ')}</Text>
          <Text style={{ paddingRight: '2%' }}>Time: {pill.time.join(', ')}</Text>
        </Group>
      </Group>
    </Container>
  ));

// Seskupení léků podle pořadí dnů a časů v týdnu a seřazení
const sortedMeds = medsData.reduce((acc, pill) => {
  pill.time.forEach(time => {
    pill.days.forEach(day => {
      const dayIndex = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(day);
      const key = dayIndex * 24 + parseTimeToHours(time);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(pill);
    });
  });
  return acc;
}, {});

// Seřazení klíčů
const sortedKeys = Object.keys(sortedMeds).sort((a, b) => a - b);

// Vytvoření kontejnerů pro každou skupinu léků
const groupedPills = sortedKeys.map((key, index) => (
  <Container
    key={index}
    w={{ base: '100%'}}
    style={{ borderRadius: '10px', margin: '5px', backgroundColor: '#b838fd', padding: '10px' }}
  >
    <Group justify="space-between">
      <Title style={{ margin: '2%' }}>{formatKeyToTimeDay(key)}</Title>
    </Group>
    {sortedMeds[key].map((pill, index) => (
      <div key={index} style={{ margin: '2%' }}>
        <Title>{pill.name}</Title>
      </div>
    ))}
  </Container>
));

  return (
    <Grid justify="center" align="flex-start">
      <Grid.Col span={{ base: 11, xxs: 11, xs: 11, sm: 11, md: 11, lg: 11, xl: 8}}>
        <Group justify="center" gap="sm">
          <MedstakerHeader 
            medstakerName={medstakerName} 
            setMedstakerName={setMedstakerName}
          />
         </Group>
      </Grid.Col>
      <Grid.Col span={{ base: 11, xxs: 11, xs: 11, sm: 11, md: 11, lg: 11, xl: 8}}>
        <Group justify="center" gap="sm">
          {pills}
        </Group>
      </Grid.Col>
      <Grid.Col span={{ base: 11, xxs: 11, xs: 11, sm: 11, md: 11, lg: 11, xl: 8}}>
        <Group justify="center" gap="sm">
        {groupedPills}
        </Group>
      </Grid.Col>
    </Grid>
  );
}

function MedstakerHeader({ medstakerName, setMedstakerName }) {
  return (
    <Container
      style={{
        backgroundColor: '#b838fd',
        width: '100%',
        height: '60px',
        borderRadius: '10px',
        margin: '10px'
      }}
    >
      <Group justify="space-between" style={{ marginTop: '1%' }}>
        <Title style={{ marginLeft: '6%' }}>{medstakerName}</Title>
        <Group justify="flex-end" gap="xs" style={{ paddingRight: '6%' }}>
          <AlarmClock size={40} />
          <CreateMedicine />
        </Group>
      </Group>
    </Container>
  );
}

function parseTimeToHours(time) {
  const parts = time.split(':');
  const hours = parseInt(parts[0]);
  const modifier = parts[1].includes('PM') ? 12 : 0;
  return hours + modifier;
}

function formatKeyToTimeDay(key) {
  const dayIndex = Math.floor(key / 24);
  const hour = key % 24;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const day = days[dayIndex];
  const time = hour < 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`;
  return `${day} ${time}`;
}

export default Medstaker;
