import React from 'react'

import {
  Grid, Box, Image, Text, Title, useMantineTheme, Group
} from '@mantine/core';

const mockdata = [
  { name: 'Paralen', color: 'violet'},
  { name: 'Ibalgin', color: 'pink'},
  { name: 'Fluorouracil', color: 'cyan'},
  { name: 'Zyrtec', color: 'red'},
  { name: 'Paralen', color: 'violet'},
  { name: 'Ibalgin', color: 'violet'},
  { name: 'Fluorouracil', color: 'cyan'},
  { name: 'Zyrtec', color: 'violet'},
  { name: 'Paralen', color: 'violet'},
  { name: 'Ibalgin', color: 'violet'},
  { name: 'Fluorouracil', color: 'cyan'},
  { name: 'Zyrtec', color: 'violet'},
];

function Pilltaker() {
  const theme = useMantineTheme();


  const pills = mockdata.map((pill) => (
    <Box bg="red.5" miw='440' maw='auto' h='200'>
      <Group>
        <Image
          radius={100}
          src={null}
          h={200}
          w={200}
          fit="cover"
          fallbackSrc="https://placehold.co/600x400?text=Placeholder"
        />
        <Title c={theme.colors[pill.color][3]} order={1}>{pill.name}</Title>
      </Group>
    </Box>
  ));

  return (
    <Grid justify="center" align="flex-start">
      
      <Grid.Col span={{ base: 11,xxs: 11, xs: 11, sm: 11, md: 11, lg: 11, xl: 8}}>
      <Group justify="center" gap="sm">{pills}</Group>
      </Grid.Col>
    </Grid>
  )
}

export default Pilltaker