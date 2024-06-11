import {React, useState} from 'react'
import useAxiosFetch from '../../hooks/useAxiosFetch';
import { useDisclosure  } from '@mantine/hooks';
import { Modal, Button, Box, TextInput, Group, Input, NumberInput, rem, Text, ScrollArea, Chip, Switch, Card, Select, Stepper, ActionIcon } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconTrash, IconSettings } from '@tabler/icons-react';
import sendToServer from '../../utils/SendToServer';

function UpdateMedicine(props) {
  const {data: unitList} = useAxiosFetch(`/unit/list`)
  const [opened, { close, open }] = useDisclosure(false);
  const [cards, setCards] = useState(props.reminder);
  const [showDayError, setShowDayError] = useState(false);
  console.log("props",props)

  const form = useForm({
    initialValues: {
      name: props.medicine.name,
      unit: props.medicine.unit,
      count: props.medicine.count,
      addPerRefill: props.medicine.addPerRefill,
      notifications: props.medicine.notifications
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
    content.medsTaker=medsTakerID
    content.reminder=cards
    content.history=[]
    console.log("medicine create request:",content)
    const result = await sendToServer(`/medicine/update/`+props.medicine._id, content);
    if (result) {
      close()
      location.reload()
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
      placeholder='unit'
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

  const box = (<Box w={10} h={10} c={'white'}></Box>)
  const selectUnitsDis = (
    <Select
      allowDeselect={false}
      placeholder='unit'
      data={listOfUnits}
      rightSectionWidth={28}
      disabled
      rightSection={box}
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
      mt={0}
      styles={{
        input: {
          fontWeight: 500,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          width: rem(62),
          marginRight: rem(-32),
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

  function validateDaysAndSubmit(values) {
    let result = true
    cards.forEach((card) => {
      if (card.recurrenceRule.byweekday.length == 0) {
        result = false
      }
    })
    if(result) {
      handlSubmit(values)
    }
    else {
      setShowDayError(true)
    }
  }

  const validateDayError = (index) => {
    if (showDayError == true && cards[index].recurrenceRule.byweekday.length == 0) {
      return "Select at least one day"
    }
    return null
  }

  const getString = (number) => {
    if (number<10) {
      return '0'+String(number)
    }
    else {
      return String(number)
    }
    
  }
  const [step, setStep] = useState(0);
  return (
    <>
      <Modal size={'lg'} opened={opened} onClose={close} title="Create Medicine" centered>
      <Box maw={370} mx="auto">
          <Stepper active={step} onStepClick={setStep} allowNextStepsSelect={false}>
            <Stepper.Step label="Medicine" description="Add informations">
              <form>
                <TextInput
                  withAsterisk
                  maxLength={255}
                  minLength={1}
                  label="Name of medicine"
                  placeholder="Name"
                  mb={10}
                  {...form.getInputProps('name')}
                />
                <Group>
                  <NumberInput
                    name="Amount"
                    withAsterisk
                    label="Medicine amount per refill"
                    placeholder="Amount"
                    min={1}
                    max={511}
                    w={180}
                    rightSection={selectUnits}
                    rightSectionWidth={92}
                    {...form.getInputProps('addPerRefill')}
                  />
                  <NumberInput
                    withAsterisk
                    label="Current amount medicine"
                    placeholder="Amount"
                    min={0}
                    max={511}
                    w={174}
                    rightSection={selectUnitsDis}
                    rightSectionWidth={92}
                    {...form.getInputProps('count')}
                  />
                </Group>
                <Switch
                  mt={20}
                  labelPosition="right"
                  label="I want receive notification on phone"
                  {...form.getInputProps('notifications',{type: 'checkbox'})}
                />
                <Group mb={80} mt={60} justify="space-between">
                  <Button variant="light" onClick={close}>Cancel</Button>
                  <Button onClick={() => {(
                    form.isValid('name')&&
                    form.isValid('count')&&
                    form.isValid('addPerRefill')&&
                    form.isValid('unit')&&
                    form.isValid('notifications'))===true?setStep(1):form.validate()}}>Next</Button>
                </Group>
              </form>
            </Stepper.Step>
            <Stepper.Step label="Reminder" description="Set Reminder">
                <Text mt={20} fw={500} size='sm'>Meds harmonogram *</Text>    
                <ScrollArea.Autosize mah={300} mx="auto" >
                  <div className="container">
                    {cards.map((item, index) => (
                      <Card mt={10} key={index} withBorder={true} bg={'#FFFEFE'}>
                        <Group>
                          <Select
                            description="time"
                            allowDeselect={false}
                            defaultValue={getString(props.reminder[index].recurrenceRule.byhour[0])}
                            mr={-10}
                            mt={-5}
                            w={65}
                            withCheckIcon={false}
                            onChange={(value) => handleHourChange(value, index)}
                            data={[ '00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23']}
                          />
                          <div style={{marginTop: '15px'}}>:</div>
                          <Select
                            allowDeselect={false}
                            defaultValue={getString(props.reminder[index].recurrenceRule.byminute[0])}
                            ml={-10}
                            mt={15}
                            w={65}
                            withCheckIcon={false}
                            onChange={(value) => handleMinuteChange(value, index)}
                            data={[ '00','15','30','45']}
                          />
                          <NumberInput
                            description="dose"
                            ml={5}
                            mt={-5}
                            w={115}
                            withAsterisk
                            isAllowed={(value) => validateAmound(value)}
                            allowDecimal={false}
                            defaultValue={props.reminder[index].dose}
                            rightSection={amoundUnit}
                            rightSectionWidth={92}
                            min={1}
                            max={255}
                            onChange={(value) => handleAmoundChange(value, index)}
                            hideControls
                          />
                          {cards.length > 1 && (
                          <ActionIcon mt={15} variant="light" size={35}>
                            <IconTrash component="button" onMouseEnter={() => console.log('grey')} onClick={() => handl_delete(index)} />
                          </ActionIcon>
                          )}
                          </Group>
                          <Input.Wrapper error={validateDayError(index)}>
                        <Chip.Group multiple label="Ned selekt" labelcolor='red'>
                          <Group justify='flex-start' mt={20}>
                            <Switch checked={handleWeekState(index)} onChange={() => handleWeekChange(index)}/>
                            <Chip ml={4} size='xs' checked={handleDayState(0, index)} onChange={() => handleDayChange(0, index)}>Monday</Chip>
                            <Chip ml={-4} size='xs' checked={handleDayState(1, index)} onChange={() => handleDayChange(1, index)}>Tuesday</Chip>
                            <Chip ml={-4} size='xs' checked={handleDayState(2, index)} onChange={() => handleDayChange(2, index)}>Wednesday</Chip>
                            <Chip ml={-4} size='xs' checked={handleDayState(3, index)} onChange={() => handleDayChange(3, index)}>Thursday</Chip>
                            <Chip ml={-4} size='xs' checked={handleDayState(4, index)} onChange={() => handleDayChange(4, index)}>Friday</Chip>
                            <Chip ml={-4} size='xs' checked={handleDayState(5, index)} onChange={() => handleDayChange(5, index)}>Saturday</Chip>
                            <Chip size='xs' checked={handleDayState(6, index)} onChange={() => handleDayChange(6, index)}>Sunday</Chip>
                          </Group>
                        </Chip.Group>
                        </Input.Wrapper>
                      </Card>
                    ))}
                  </div>
                </ScrollArea.Autosize>
                <Button variant="light" mt={30} fullWidth onClick={() => handl_add()}>Add dose</Button>
                <form onSubmit={form.onSubmit((values) => validateDaysAndSubmit(values))}>
                <Group justify="space-between" mt="md">
                  <Button variant="default" mb={40} onClick={() => setStep(0)}>Back</Button>
                  <Button type="submit" mb={40}>Create</Button>
                </Group> 
              </form> 
            </Stepper.Step>
          </Stepper>           
        </Box>
      </Modal>
      <IconSettings
        size={20}
        style={{ cursor: 'pointer', position: 'relative', top: '-10px' }}
        component="button" 
        onClick={open} 
      />
    </>
  );
}

export default UpdateMedicine
