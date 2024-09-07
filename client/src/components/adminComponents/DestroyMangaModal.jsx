import React, { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite';
import { Button, Modal } from 'react-bootstrap'
import { destroyManga } from '../../http/mangaAPI';
import { Context } from '../../'

const DestroyMangaModal = observer(() => {

    const { manga } = useContext(Context)

    const [show, setShow] = useState(false)
    const [selectedManga, setSelectedManga] = useState({})

    const destroy = () => {
        try {
          destroyManga(selectedManga.id)
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
          <Modal.Title>Удалить мангу</Modal.Title>
        </Modal.Header>
        <Modal.Body className='block_items_to_delete'>
          {manga.manga.map((item, i) => 
            <p
              className='item_to_delete'
              key={i}
              onClick={() => setSelectedManga(item)}
              style={selectedManga.id === item.id ? {background: 'black'} : {}}
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

export default DestroyMangaModal
