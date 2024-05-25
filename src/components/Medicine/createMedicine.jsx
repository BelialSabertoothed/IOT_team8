import React from 'react'
import useAxiosFetch from '../../hooks/useAxiosFetch';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Box, TextInput, Group, Input, NumberInput, NativeSelect, rem, Text, ActionIcon, Checkbox } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconChevronDown, IconTrash } from '@tabler/icons-react';
import { SquarePlus } from 'lucide-react';

function CreateMedicine() {

  const {data: unitList} = useAxiosFetch(`/unit/list`)
  const [opened, { open, close }] = useDisclosure(false);
  console.log(JSON.stringify(unitList))
  const form = useForm({
    initialValues: {
      medicineName: '',
      refill: '',
      time: '',
      amount: '',
      unit: `tady ${unitList} unitList[0].name`,
      freqency: 'DAILY',
    },

    validate: {
      medicineName: (value) => (/[a-z]/.test(value) ? null : 'Requested'),
    },
  });

  //unit list

  const listOfUnits = unitList?.map((unit) => (
    {value: unit.name, label: unit.name}
  ));

  const units = (
    <NativeSelect
      data={listOfUnits}
      rightSectionWidth={28}
      styles={{
        input: {
          fontWeight: 500,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          width: rem(92),
          marginRight: rem(-2),
        },
      }}
      {...form.getInputProps('unit')}
    />
  );

  const amoundUnit = (
    <Input
      rightSectionWidth={28}
      disabled
      styles={{
        input: {
          fontWeight: 500,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          width: rem(82),
          marginRight: rem(-12),
        },
      }}
      {...form.getInputProps('unit')}
    />
  );

  return (
    <>
      <Modal size={'lg'} opened={opened} onClose={close} title="Create new medicine">
        <Box maw={340} mx="auto">
            <form onSubmit={form.onSubmit((values) => console.log(values))}>
                <TextInput
                    withAsterisk
                    maxLength={255}
                    minLength={1}
                    label="Name of medicine"
                    placeholder="Name"
                    {...form.getInputProps('medicineName')}
                />
                <NumberInput
                    withAsterisk
                    label="Medicine amount per refill"
                    placeholder="Amount"
                    min={1}
                    max={511}
                    rightSection={units}
                    rightSectionWidth={92}
                    {...form.getInputProps('refill')}
                />
                <Text mt={20} fw={500} size='sm'>Meds harmonogram *</Text>
                <Group>
                    <NumberInput
                        w={110}
                        mt={2}
                        disabled
                        placeholder=':'
                        rightSection={'00'}
                        rightSectionWidth={50}
                        leftSection={'10'}
                        leftSectionWidth={50}
                        description={`1. dose`}
                        timeSteps={{ minutes: 15 }}
                        {...form.getInputProps('time')}
                    />
                    <NumberInput
                      w={162}
                      withAsterisk
                      mt={20}
                      placeholder="Amount"
                      rightSection={amoundUnit}
                      rightSectionWidth={92}
                      min={1}
                      max={511}
                      hideControls
                      {...form.getInputProps('amount')}
                    />
                    <ActionIcon  variant="light" size={35} mb={-20}>
                      <IconTrash component="button" onClick={console.log('nefunguju pomoc (icontrash)')}/* nefunguje koukni na to! onMouseEnter={console.log('ahoj')} *//>
                    </ActionIcon>
                </Group>
                <Input
                    component="select"
                    rightSection={<IconChevronDown size={14} stroke={1.5} />}
                    pointer
                    mt="md"
                    {...form.getInputProps('freqency')}
                >
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly?</option>
                    <option value="YEARLY">Yearly?</option>
                    <option value="MONDAY">Monday</option>
                    <option value="TUESDAY">Tuesday</option>
                    <option value="WEDNESDAY">Wednesday</option>
                    <option value="THURSDAY">Thursday</option>
                    <option value="FRIDAY">Friday</option>
                    <option value="SATURDAY">Saturday</option>
                    <option value="SUNDAY">Sunday</option>
                </Input>
                <Group>
                  <Checkbox>Monday</Checkbox>
                </Group>
                <Button variant="light" mt={10} fullWidth>Add time</Button>

                <Group justify="space-between" mt="md">
                <Button mb={40} mt={20} variant="light">Cancel</Button>
                <Button mb={40} mt={20} type="submit">Create</Button>
                </Group>
            </form>
        </Box>
      </Modal>

      <SquarePlus size={40} component="button" onClick={open}/>
    </>
  );
}

export default CreateMedicine