import { React, useContext } from 'react'
import { TextInput,  Button, Group, Box} from '@mantine/core';
import { notifications } from '@mantine/notifications';


function Errors(errorStatus, errorMessage, warningMessage, infoMessage) {
    /* const { 
        errorStatus: errorStatus,
        errorMessage: errorMessage,
        warningMessage: warningMessage,
        infoMessage: infoMessage
     } = promps; */

  let error = {
    color: 'white',
    title: `Error ${errorStatus}`,
    message: `${errorMessage}`,
    style: { backgroundColor: 'red', WebkitTextFillColor: 'white' },
  }

  let warning = {
    color: 'black',
    title: 'Warning',
    message: `${warningMessage}`,
    style: { backgroundColor: '#FCE793' },
  }

  let info = {
    title: 'Info',
    message: `${infoMessage}`
  }
  notifications.show(error)
}

export default Errors