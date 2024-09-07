import React, { useContext, useEffect, useState } from 'react'
import { Form, Alert, Dropdown, Button } from 'react-bootstrap';
import { createChapter, fetchManga } from '../../http/mangaAPI'
import { Context } from '../..'
import { observer } from 'mobx-react-lite';
import DestroyChapterModal from './DestroyChapterModal';
import { ReactComponent as InfoSvg} from '../../icons/information.svg';

const CreateManga = observer(() => {

    const { manga } = useContext(Context)

    const [name, setName] = useState('')
    const [numberch, setNumberch] = useState('')
    const [files, setFiles] = useState([])

    const [selectedManga, setSelectedManga] = useState({})

    // Alert Messages
    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [showSuccess, setShowSuccess] = useState('')

    const [load, setLoad] = useState(true)

    useEffect(() => {
      fetchManga()
        .then(({data}) => {manga.setManga(data.rows); setLoad(false)})
    }, [])

    const create = async () => {
        try {
            const formData = new FormData()
            formData.append('name', name)
            formData.append('mangaId', selectedManga.id)

            if (files.length) {
              for (let i = 0; i < files.length; i++) {
                formData.append('pages', files[i]) 
              }
            } else {
              formData.append('pages', files[0])
            }
            await createChapter(formData)
            setShowSuccess(true)
        }
        catch(error) {
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
            { !selectedManga.name &&
            <>
              <p>(!) Для создания/удаления главы необходимо выбрать нужную мангу.</p>
              <Dropdown>
                <Dropdown.Toggle>{selectedManga.name || 'Выберите мангу * '}</Dropdown.Toggle>
                <Dropdown.Menu>
                  {
                    manga.manga.map((m, i) => 
                      <Dropdown.Item
                        onClick={() => setSelectedManga(m)}
                        key={i}
                      >
                        {m.name}
                      </Dropdown.Item>  
                    )
                  }
                </Dropdown.Menu>
              </Dropdown>
            </>
            }

            {   showAlert &&
                <Alert
                variant="danger"
                onClose={() => setShowAlert(false)} dismissible
                >
                    <p>{alertMessage}</p>
                </Alert>
            }

            { selectedManga.name &&
            <>

            <h3>{selectedManga.name}</h3>

            <hr />

            <DestroyChapterModal
              selectedManga={selectedManga}
            />

            <hr />

            <p>Имя *</p>
            <Form.Control
              type='text'
              value={name}
              className='admin_input'
              onChange={(e) => setName(e.target.value)}
            />

            <hr />

            <Form.Group controlId="formFileMultiple" className="mb-3">
              <Form.Label>Страницы (-а) *</Form.Label>
              <p className='info_text'>
                <InfoSvg className='info_sign'/>
                Важно, чтобы при загрузке страниц, они находились в правильном порядке (обычно для этого достаточно их пронумеровать), *.png, *.jpeg, *.jpg
              </p>
              <Form.Control
                type="file"
                accept="image/png, image/jpeg, image/jpg"
                onChange={(e) => setFiles(e.target.files)}
                multiple
              />
            </Form.Group>

            <hr />

            <p>Номер главы</p>

            <p className='info_text'>
              <InfoSvg className='info_sign'/>
              не обязательно, расчитывается автоматически
            </p>
            <Form.Control
              type='number'
              value={numberch}
              className='admin_input'
              onChange={(e) => setNumberch(Number(e.target.value))}
            />

            <hr />

            {   showSuccess &&
                <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                    <p>Глава успешно добавлена!</p>
                </Alert>
            }

            <div className="create_block">
                <Button
                    variant='success'
                    onClick={create}
                >
                  Добавить главу
                </Button>
            </div>

            </>
            }
        </div>
    )
})

export default CreateManga
