import React from 'react'

import {
  Grid, Box, Image, Text, Title
} from '@mantine/core';

function Pilltaker() {
  return (
    <Grid justify="center" align="flex-start">
      <Grid.Col span={{ base: 11,xxs: 11, xs: 11, sm: 6, md: 6, lg: 6 }}>
      <Box>
        <Image
          radius={100}
          src={null}
          h={200}
          w={200}
          fit="cover"
          fallbackSrc="https://placehold.co/600x400?text=Placeholder"
        />
        <Title order={1}>Namme of user</Title>
        <Text c="violet">
          Basic informations, I dont know what information. Thats why placeholder. BackgroundImage component can be used to add any content on image. It is useful for hero
          headers and other similar sections
        </Text>
    </Box>
    </Grid.Col>
    </Grid>
  )
}

export default Pilltaker