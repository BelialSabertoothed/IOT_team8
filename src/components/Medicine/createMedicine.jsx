import {React, useState} from 'react'
import useAxiosFetch from '../../hooks/useAxiosFetch';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Box, TextInput, Group, Input, NumberInput, NativeSelect, rem, Text, ActionIcon, Checkbox, MultiSelect, Switch, Tooltip } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconChevronDown, IconTrash } from '@tabler/icons-react';
import { SquarePlus } from 'lucide-react';

function CreateMedicine() {

  const {data: unitList} = useAxiosFetch(`/unit/list`)
  const [opened, { open, close }] = useDisclosure(false);
  console.log(unitList)
  const form = useForm({
    initialValues: {
      medicineName: '',
      refill: '',
      time: '',
      amount: '',
      unit: '',
      freqency: [],
    },

    validate: {
      medicineName: (value) => (/[a-z]/.test(value) ? null : 'Requested'),
    },
  });

  /* form.setValues({unit: 'unitList[0].name'}) */
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

  //refil chackbox

  //const allChecked = values.every((value) => value.checked);

  const days = [
    { value:'0', label:"Monday" },
    { value: '1', label: 'Tuesday' },
    { value: '2', label: 'Wednesday' },
    { value: '3', label: 'Thursday' },
    { value: '4', label: 'Friday' },
    { value: '5', label: 'Saturday' },
    { value: '6', label: 'Sunday' }
  ]

  const [checked, setChecked] = useState(false);
  const checkAll = (
      <Switch label="Dayli" labelPosition="left"/>
  )

  const hour = (
    <Input
        component="select"
    >
      <option value="MONDAY">01</option>
      <option value="TUESDAY">02</option>
      <option value="WEDNESDAY">03</option>
      <option value="THURSDAY">04</option>
      <option value="FRIDAY">05</option>
      <option value="SATURDAY">06</option>
      <option value="SUNDAY">07</option>
    </Input>
  )
  const minutes = (
    <Input
        component="select"
    >
      <option value="MONDAY">00</option>
      <option value="TUESDAY">30</option>
    </Input>
  )

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
                <Text mt={10} mb={5} fw={500} size='xs' c="dimmed">1. dose</Text>
                <Group>
                    <Input
                        component="select"
                        mr={-5}
                    >
                      <option value="MONDAY">01</option>
                      <option value="TUESDAY">02</option>
                      <option value="WEDNESDAY">03</option>
                      <option value="THURSDAY">04</option>
                      <option value="FRIDAY">05</option>
                      <option value="SATURDAY">06</option>
                      <option value="SUNDAY">07</option>
                    </Input>
                    :
                    <Input
                      component="select"
                      ml={-5}
                    >
                      <option value="MONDAY">00</option>
                      <option value="TUESDAY">30</option>
                    </Input>
                    <NumberInput
                      w={162}
                      withAsterisk
                      placeholder="Amount"
                      rightSection={amoundUnit}
                      rightSectionWidth={92}
                      min={1}
                      max={511}
                      hideControls
                      {...form.getInputProps('amount')}
                    />
                    <ActionIcon  variant="light" size={35}>
                      <IconTrash component="button" onMouseEnter={() => console.log('grey')} onClick={() =>console.log('deleate')} />
                    </ActionIcon>
                </Group>
                {/* {<Checkbox.Group
                  defaultValue={['']}
                  {...form.getInputProps('freqency')}
                >
                  <Group mt="xs">
                    <Checkbox value="0" label="Monday" />
                    <Checkbox value="1" label="Tuesday" />
                    <Checkbox value="2" label="Wednesday" />
                    <Checkbox value="3" label="Thursday" />
                    <Checkbox value="4" label="Friday" />
                    <Checkbox value="5" label="Saturday" />
                    <Checkbox value="6" label="Sunday" />
                  </Group>
                </Checkbox.Group>} */}
                {/* <Input
                    component="select"
                    rightSection={<IconChevronDown size={14} stroke={1.5} />}
                    pointer
                    mt="md"
                    {...form.getInputProps('freqency')}
                >
                    <option value="MONDAY">Monday</option>
                    <option value="TUESDAY">Tuesday</option>
                    <option value="WEDNESDAY">Wednesday</option>
                    <option value="THURSDAY">Thursday</option>
                    <option value="FRIDAY">Friday</option>
                    <option value="SATURDAY">Saturday</option>
                    <option value="SUNDAY">Sunday</option>
                </Input> */}
                <MultiSelect
                mt={10}
                  placeholder="Select day"
                  hidePickedOptions
                  maxDropdownHeight={120}
                  /* rightSection={checkAll} */
                  rightSectionWidth={100}
                  {...form.getInputProps('freqency')}
                  data={days}
                />
                <Button variant="light" mt={10} fullWidth>Add dose</Button>

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