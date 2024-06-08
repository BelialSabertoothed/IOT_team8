import {React, useState} from 'react'
import useAxiosFetch from '../../hooks/useAxiosFetch';
import { useDisclosure  } from '@mantine/hooks';
import { Modal, Button, Box, TextInput, Group, Input, NumberInput, rem, Text, ScrollArea, Chip, Switch, Card, Select, Stepper } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconTrash } from '@tabler/icons-react';
import { SquarePlus } from 'lucide-react';
import sendToServer from '../../utils/SendToServer';

function CreateMedicine() {
  const {data: unitList} = useAxiosFetch(`/unit/list`)
  const [opened, { close, open }] = useDisclosure(false);
  const [cards, setCards] = useState([{recurrenceRule: {byweekday: [],byhour: [12], byminute: [0]}, dose: 1}]);
    
  const form = useForm({
    initialValues: {
      name: '',
      unit: null,
      count: 0,
      addPerRefill: 1,
      notifications: true
    },
  
    validate: {
      name: (value) => (/[a-z]/.test(value) ? null : ' '),
      unit: (value) => (value === null ? ' ' : null),
      count: (value) => (value >= 0 ? null : ' '),
      addPerRefill: (value) => (0 < value  ? null : ' '),
      notifications: (value) => (value === true || value === false ? null : 'Requested'),
    },
  });

  async function handlSubmit(content){
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const medsTakerID = urlParams.get('medstaker')
    console.log("medicine create content:",content)
    console.log("medicine create medsTakerID:",medsTakerID)
    console.log("medicine create reminder:",cards)
    content.medsTaker=medsTakerID
    content.reminder=cards
    content.history=[]
    console.log("medicine create request:",content)
    const result = await sendToServer(`/medicine/create`, content);
    if (result) {
      close //close TODO
      //props.refreshData()
    }else {
      alert('something went wrong')
    }
  };

  const listOfUnits = unitList?.map((unit) => (
    {value: unit._id, label: unit.name}    
  ));

  const selectUnits = (
    <Select
      allowDeselect={false}
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

  const unitName = () => {
    let unit = listOfUnits?.find(item => item.value === form.values.unit??null)
    return unit?.label
  }

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
      value={unitName()}
    />
  );

  const handl_delete = (index) => {
    const newArray = [...cards];
    newArray.splice(index, 1);
    setCards(newArray);
  };
    
  const handl_add = () =>  {
    setCards([...cards, {recurrenceRule: {byweekday: [],byhour: [12], byminute: [0]}, dose: 1}]);   
  };
    
  const handleHourChange = (value, index) => {
    let onChangeValue = [...cards];
    onChangeValue[index].recurrenceRule.byhour = [Number(value)];
    setCards(onChangeValue);
  };

  const handleMinuteChange = (value, index) => {
    let onChangeValue = [...cards];
    onChangeValue[index].recurrenceRule.byminute = [Number(value)];
    setCards(onChangeValue);
  };

  const handleAmoundChange = (value, index) => {
    console.log("amound value:",value)
    if ((value > 0) && (value < 256)){
      let onChangeValue = [...cards];
      onChangeValue[index].dose = value;
      setCards(onChangeValue);
    }
  };

  const validateAmound = (value) => {
    if ( Number.isInteger(value.floatValue)) {return true}
    else {return false}
  };

  const handleDayChange = (value, index) => {
    let onChangeValue = [...cards];
    let valueIndex = onChangeValue[index].recurrenceRule.byweekday.indexOf(value)
    if (valueIndex == -1) {onChangeValue[index].recurrenceRule.byweekday.push(value)}
    else {onChangeValue[index].recurrenceRule.byweekday.splice(valueIndex,1)}
    setCards(onChangeValue);
  };
    
  const handleDayState = (value, index) => {
    return cards[index].recurrenceRule.byweekday.includes(value);
  };
    
  const handleWeekChange = (index) => {
    let onChangeValue = [...cards];
    if (handleWeekState(index)) {onChangeValue[index].recurrenceRule.byweekday = []}
    else {onChangeValue[index].recurrenceRule.byweekday = [0,1,2,3,4,5,6]}
    setCards(onChangeValue);
  };
    
  const handleWeekState = (index) => {
    if(cards[index].recurrenceRule.byweekday.length == 7) return true
    else return false
  };

  function validateDays() {
    let result = true
    cards.forEach((card) => {
      console.log(card.recurrenceRule.byweekday.length)
      if (card.recurrenceRule.byweekday.length == 0) {
        result = false
      }
    })
    return result
  }

  const [step, setStep] = useState(0);
    
  return (
    <>
      <Modal opened={opened} onClose={close} title="Create Medicine">
        <Box maw={340} mx="auto">
          <Stepper active={step} onStepClick={setStep} allowNextStepsSelect={false}>
            <Stepper.Step label="Medicine" description="Add informations">
              <form>
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
                  label="The amount off medicine you possess"
                  placeholder="Amount"
                  min={0}
                  max={511}
                  rightSection={selectUnits}
                  rightSectionWidth={92}
                  {...form.getInputProps('count')}
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
                <Switch
                  labelPosition="left"
                  label="I want receive notification"
                  {...form.getInputProps('notifications',{type: 'checkbox'})}
                />
                <Group mb={80} mt={60} justify="space-between">
                  <Button variant="light" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={() => {{(
                    form.isValid('name')&&
                    form.isValid('count')&&
                    form.isValid('addPerRefill')&&
                    form.isValid('unit')&&
                    form.isValid('notifications'))===true?setStep(1):form.validate()};console.log(form.values)}}>Next</Button>
                </Group>
              </form>
            </Stepper.Step>
            <Stepper.Step label="Reminder" description="Set Reminder">
                <Text mt={20} fw={500} size='sm'>Meds harmonogram *</Text>    
                <ScrollArea h={300} >
                  <div className="container">
                    {cards.map((item, index) => (
                      <Card key={index} withBorder={true} border-color='red'>
                        <Group>
                          <Select
                            allowDeselect={false}
                            defaultValue={'12'}
                            w={70}
                            onChange={(value) => handleHourChange(value, index)}
                            data={[ '00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']}
                          />
                          :
                          <Select
                            allowDeselect={false}
                            defaultValue={'00'}
                            w={70}
                            onChange={(value) => handleMinuteChange(value, index)}
                            data={[ '00','15','30','45']}
                          />
                        </Group>
                        <NumberInput
                          w={162}
                          withAsterisk
                          isAllowed={(value) => validateAmound(value)}
                          allowDecimal={false}
                          defaultValue={1}
                          rightSection={amoundUnit}
                          rightSectionWidth={92}
                          min={1}
                          max={255}
                          onChange={(value) => handleAmoundChange(value, index)}
                          hideControls
                        />
                        <Chip.Group multiple>
                          <Group justify='flex-start' mt={20}>
                            <Switch checked={handleWeekState(index)} onChange={() => handleWeekChange(index)}/>
                            <Chip ml={4} size='xs' checked={handleDayState(0, index)} onChange={() => handleDayChange(0, index)}>Monday</Chip>
                            <Chip ml={4} size='xs' checked={handleDayState(1, index)} onChange={() => handleDayChange(1, index)}>Tuesday</Chip>
                            <Chip ml={4} size='xs' checked={handleDayState(2, index)} onChange={() => handleDayChange(2, index)}>Wednesday</Chip>
                            <Chip ml={4} size='xs' checked={handleDayState(3, index)} onChange={() => handleDayChange(3, index)}>Thursday</Chip>
                            <Chip ml={4} size='xs' checked={handleDayState(4, index)} onChange={() => handleDayChange(4, index)}>Friday</Chip>
                            <Chip ml={4} size='xs' checked={handleDayState(5, index)} onChange={() => handleDayChange(5, index)}>Saturday</Chip>
                            <Chip ml={4} size='xs' checked={handleDayState(6, index)} onChange={() => handleDayChange(6, index)}>Sunday</Chip>
                          </Group>
                        </Chip.Group>
                        {cards.length > 1 && (
                          <Button onClick={() => handl_delete(index)}>Delete</Button>
                        )}
                      </Card>
                    ))}
                  </div>
                  <Group mt="xl">
                    <Button onClick={() => handl_add()}>Add badge</Button>
                  </Group>
                </ScrollArea>
                <form onSubmit={form.onSubmit((values) => {validateDays()===true?handlSubmit(values):'TODO showError'})}>
                <Group justify="space-between" mt="md">
                  <Button variant="default" onClick={() => setStep(0)}>Back</Button>
                  <Button type="submit">Create</Button>
                </Group> 
              </form> 
            </Stepper.Step>
          </Stepper>           
        </Box>
      </Modal>
      <SquarePlus size={40} component="button" onClick={open}/>
    </>
  );
}

export default CreateMedicine
