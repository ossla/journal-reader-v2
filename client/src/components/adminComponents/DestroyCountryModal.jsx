import React, { useState, useContext } from 'react'
import { Modal, Button } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
import { destroyCountry } from '../../http/mangaAPI'
import { Context } from '../..'

const DestroyYearModal = observer(() => {

  const { manga } = useContext(Context)

  const [show, setShow] = useState(false)

  const [countryId, setCountryId] = useState({})


  const destroy = () => {
    try {
      destroyCountry(countryId)
      window.location.reload()
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <>
      <Button
        variant="warning"
        onClick={() => setShow(true)}
      >
        Удалить
      </Button>

      <Modal
        show={show}
        onHide={() => setShow(false)}
        backdrop="static"
        keyboard={false}
        className='destroy_modal'
      >
        <Modal.Header closeButton>
          <Modal.Title>Удалить Страну</Modal.Title>
        </Modal.Header>
        <Modal.Body className='block_items_to_delete'>
          {manga.countries.map((item, i) =>
            <p
              className='item_to_delete'
              key={i}
              onClick={() => setCountryId(item.id)}
              style={countryId === item.id ? {background: 'black'} : {}}
            >
              {item.name}
            </p>
          )}
        </Modal.Body>

        <Modal.Footer>

          <Button variant="secondary" onClick={() => setShow(false)}>
            Закрыть
          </Button>
          <Button variant="danger" onClick={destroy}>Удалить</Button>
        </Modal.Footer>
      </Modal>
    </>
  )
})

export default DestroyYearModal
