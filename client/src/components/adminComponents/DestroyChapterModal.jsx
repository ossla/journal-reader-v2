import React, { useState, useEffect } from 'react'
import { fetchChapters } from '../../http/mangaAPI'
import { Button, Modal } from 'react-bootstrap'
import { destroyChapter } from '../../http/mangaAPI'

export default function DestroyChapterModal({selectedManga}) {

  const [show, setShow] = useState(false)
  const [load, setLoad] = useState(true)

  const [chapters, setChapters] = useState([])
  const [selectedChapter, setSelectedChapter] = useState({})

  useEffect(() => {
    fetchChapters(selectedManga.id)
      .then(({data}) => {
        console.log(data.data)
        setChapters(data.data)
        setLoad(false)
      })
  }, [])


  const destroy = () => {
    try {
      destroyChapter(selectedChapter.id)
      window.location.reload()
    } catch (error) {
      console.log(error.message)
    }
  }

  if (load) {
    return (
      <></>
    )
  }

  if (typeof chapters === 'string') {
    return (
      <>
        (Глав к удалению не найдено)
      </>
    )
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
          <Modal.Title>Удалить главу</Modal.Title>
        </Modal.Header>
        <Modal.Body className='block_items_to_delete'>
          {chapters.map((item, i) =>
            <p
              className='item_to_delete'
              key={i}
              onClick={() => setSelectedChapter(item)}
              style={selectedChapter.id === item.id ? {background: 'black'} : {}}
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
}
