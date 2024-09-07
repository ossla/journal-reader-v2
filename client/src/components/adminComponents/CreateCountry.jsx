import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../..'
import { createCountry, fetchCountries } from '../../http/mangaAPI'
import { observer } from 'mobx-react-lite'
import { Form, Button, Alert } from 'react-bootstrap'
import DestroyCountryModal from './DestroyCountryModal'

const CreateYear = observer(() => {

  const { manga } = useContext(Context)

  const [name, setName] = useState('')

  const [load, setLoad] = useState(true)

  // Alert Messages
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    fetchCountries()
      .then(({data}) => { manga.setCountries(data); setLoad(false) })
  }, [])

  const create = async () => {
    try {
      await createCountry(name)
      setShowSuccess(true)
    } catch (error) {
      setAlertMessage(error.response.data.message)
      setShowAlert(true)
    }
  }

  if (load) {
    return (
      <img src="/loading.gif" alt="loading..." />
    )
  }

  return (
    <div>
      {   showAlert &&
          <Alert
          variant="danger"
          onClose={() => setShowAlert(false)} dismissible
          >
              <p>{alertMessage}</p>
          </Alert>
      }

      <DestroyCountryModal />

      <hr />

      <Form.Group>
        <p>Страна *</p>
        <Form.Control 
          type='text'
          className='admin_input'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </Form.Group>

      <hr />

      {   showSuccess &&
          <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
              <p>Страна успешно добавлена!</p>
          </Alert>
      }

      <div className="create_block">
          <Button
              variant='success'
              onClick={create}
          >
              Добавить страну
          </Button>
      </div>
    </div>
)
})

export default CreateYear
