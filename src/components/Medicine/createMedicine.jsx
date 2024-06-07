import {React, useState} from 'react'
import useAxiosFetch from '../../hooks/useAxiosFetch';
import { useDisclosure } from '@mantine/hooks';
import { Modal, Button, Box, TextInput, Group, Input, NumberInput, NativeSelect, rem, Text, ActionIcon, Checkbox, ScrollArea, Chip, MultiSelect, Switch, Tooltip } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { IconChevronDown, IconTrash } from '@tabler/icons-react';
import { SquarePlus } from 'lucide-react';

function CreateMedicine() {
  let remineder = []
  const {data: unitList} = useAxiosFetch(`/unit/list`)
  const [opened, { open, close }] = useDisclosure(false);
  console.log(unitList)
  const form = useForm({
    initialValues: {
      name: '',
      unit: null,
      count: 0,
      addPerRefill: 0,
      reminder: [], //{recurrenceRule: {byweekday: [0, 6],byhour: [4, 16], byminute: [0]}, dose: 1}
    },

    validate: {
      medicineName: (value) => (/[a-z]/.test(value) ? null : 'Requested'),
    },
  });

  function CreateReminderList(reminder){

  }

  async function handlSubmit(content){
    console.log("medicine create content:",content)
    /*const result = await sendToServer(`/medsTaker/create`, content);
    if (result) {
      setOpen(false) //close TODO
      props.refreshData()
    }else {
      alert('something went wrong')
    }*/
  }  

  //unit list

  const listOfUnits = unitList?.map((unit) => (
    {value: unit._id, label: unit.name}
    
  ));

  const selectUnits = (
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

  const unitName = unitList?.map(unit => {
    const unitId = unit._id;
    const unitName = unit.name;
    if (unitId === form.values.unit) {
      return unitName
    } if(form.values.unit === null) {
      return Object.getOwnPropertyDescriptors(unitList.at(0)).name.value
    } else {null}
  });

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
      value={unitName}
      
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

  const hour = (
    <Input
        component="select"
        mr={-5}
    >
      <option value={0}>00</option>
      <option value={1}>01</option>
      <option value={2}>02</option>
      <option value={3}>03</option>
      <option value={4}>04</option>
      <option value={5}>05</option>
      <option value={6}>06</option>
      <option value={7}>07</option>
      <option value={8}>08</option>
      <option value={9}>09</option>
      <option value={10}>10</option>
      <option value={11}>11</option>
      <option value={12}>12</option>
      <option value={13}>13</option>
      <option value={14}>14</option>
      <option value={15}>15</option>
      <option value={16}>16</option>
      <option value={17}>17</option>
      <option value={18}>18</option>
      <option value={19}>19</option>
      <option value={20}>20</option>
      <option value={21}>21</option>
      <option value={22}>22</option>
      <option value={23}>23</option>
    </Input>
  )
  const minutes = (
    <Input
        component="select"
        ml={-5}
    >
      <option value={0}>00</option>
      <option value={30}>30</option>
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
                    {...form.getInputProps('name')}
                />
                <NumberInput
                    withAsterisk
                    label="Medicine amount per refill"
                    placeholder="Amount"
                    min={1}
                    max={511}
                    rightSection={selectUnits}
                    rightSectionWidth={92}
                    {...form.getInputProps('addPerRefill')}
                />
                <NumberInput
                    withAsterisk
                    label="The amount off medicine you possess"
                    placeholder="Amount"
                    min={1}
                    max={511}
                    rightSection={selectUnits}
                    rightSectionWidth={92}
                    {...form.getInputProps('count')}
                />
                <Text mt={20} fw={500} size='sm'>Meds harmonogram *</Text>
                <Text mt={10} mb={5} fw={500} size='xs' c="dimmed">1. dose</Text>
                <ScrollArea mt={20}>
                  <Group>
                      {hour}
                      :
                      {minutes}
                      <NumberInput
                        w={162}
                        withAsterisk
                        placeholder="Amount"
                        rightSection={amoundUnit}
                        rightSectionWidth={92}
                        min={1}
                        max={511}
                        hideControls
                        {...form.getInputProps('dose')}
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
                  {/* <MultiSelect
                  mt={10}
                    placeholder="Select day"
                    maxDropdownHeight={120}
                    leftSection={checkAll}
                    leftSectionWidth={40}
                    checkIconPosition="left"
                    {...form.getInputProps('freqency')}
                    data={days}
                  /> */}
                  <Chip.Group multiple>
                    <Group justify='flex-start' mt={20}>
                      <Switch></Switch>
                      <Chip value={0} ml={4} size='xs' {...form.getInputProps('period.0.days.monday', { type: 'checkbox' })}>Monday</Chip>
                      <Chip value={1} ml={-4} size='xs'>Tuesday</Chip> 
                      <Chip value={2} ml={-4} size='xs'>Wednesday</Chip> 
                      <Chip value={3} mr={-4} size='xs'>Thursday</Chip> 
                      <Chip value={4} mr={-4} size='xs'>Friday</Chip> 
                      <Chip value={5} mr={-4} size='xs'>Saturday</Chip> 
                      <Chip value={6} size='xs'>Sunday</Chip>
                    </Group>
                  </Chip.Group>
                </ScrollArea>
                <Button variant="light" mt={40} fullWidth>Add dose</Button>

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