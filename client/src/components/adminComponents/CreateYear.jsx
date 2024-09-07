import React, { useContext, useEffect, useState } from 'react'
import { Context } from '../..'
import { createYear, fetchYears } from '../../http/mangaAPI'
import { observer } from 'mobx-react-lite'
import { Form, Button, Alert } from 'react-bootstrap'
import { ReactComponent as InfoSvg} from '../../icons/information.svg';
import DestroyYearModal from './DestroyYearModal'

const CreateYear = observer(() => {

  const { manga } = useContext(Context)

  const [name, setName] = useState('')

  const [load, setLoad] = useState(true)

  // Alert Messages
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    fetchYears()
      .then(({data}) => { manga.setYears(data); setLoad(false) })
  }, [])

  const create = async () => {
    try {
      await createYear(name)
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

      <DestroyYearModal />

      <hr />

      <Form.Group>
        <p>ГП *</p>
        <p className='info_text'>
          <InfoSvg className='info_sign'/>
          Обычно проще дробить на десятилетия: 2990-е, 3000-e и т.д.
        </p>
        <Form.Control 
          type='text'
          className='admin_input'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='xxxx-e/xxxx-xxxx/xxxx'
        />
      </Form.Group>

      <hr />

      {   showSuccess &&
          <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
              <p>Годовой промежуток успешно создан!</p>
          </Alert>
      }

      <div className="create_block">
          <Button
              variant='success'
              onClick={create}
          >
              Добавить ГП
          </Button>
      </div>
    </div>
)
})

export default CreateYear
