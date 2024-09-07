import React, { useContext, useEffect, useState } from 'react'
import { Form, Alert, Dropdown, Button } from 'react-bootstrap';
import { createManga, fetchCountries, fetchManga, fetchYears } from '../../http/mangaAPI'
import { Context } from '../..'
import { observer } from 'mobx-react-lite';
import DestroyMangaModal from './DestroyMangaModal';


const CreateManga = observer(() => {

    const { manga } = useContext(Context)

    const [name, setName] = useState('')
    const [startedyear, setStartedyear] = useState('')
    const [status, setStatus] = useState('')
    const [genres, setGenres] = useState([])
    const [file, setFile] = useState(null)
    const [description, setDescription] = useState('')

    const [showAlert, setShowAlert] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [showSuccess, setShowSuccess] = useState('')

    const [load, setLoad] = useState(true)

    useEffect(() => {
        async function fetchData() {   
            await fetchYears()
                .then(({data}) => manga.setYears(data))
            await fetchCountries()
                .then(({data}) => manga.setCountries(data))
            await fetchManga()
                .then(({data}) => manga.setManga(data.rows))
            setLoad(false)
        }

        fetchData()

    }, [])

    const addGenre = () => {
        setGenres(gnrs => [...gnrs, {name: '', id: Number(Date.now())}])
    }
    const removeGenre = (id) => {
        setGenres(() => genres.filter(item => item.id !== id))
    }

    const create = async () => {
        try {
            const formData = new FormData()
            formData.append('coverImg', file)
            formData.append('name', name)
            formData.append('status', status)
            formData.append('startedyear', startedyear)
            formData.append('description', description)
            formData.append('yearId', manga.selectedYear.id)
            formData.append('countryId', manga.selectedCountry.id)
            formData.append('genres', JSON.stringify(genres))

            await createManga(formData)
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
            <DestroyMangaModal />

            {   showAlert &&
                <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
                    <p>{alertMessage}</p>
                </Alert>
            }

            <hr />

            <p>Имя *</p>
            <Form.Control
                className='admin_input'
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            
            <hr />
            
            <p>Обложка *</p>
            <Form.Control
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className='admin_input'
                access='image/png, image/jpeg, image/jpg'
            />
            
            <hr />
            
            <div className='create_magna_years_container' >
                <Dropdown>
                    <Dropdown.Toggle>{manga.selectedYear.name ||'Годовой промежуток *'}</Dropdown.Toggle>
                    <Dropdown.Menu>
                        {
                            manga.years.map((year, i) =>
                                <Dropdown.Item
                                    onClick={() => manga.setSelectedYear(year)}
                                    key={i}
                                >
                                    {year.name}
                                </Dropdown.Item>
                            )
                        }
                    </Dropdown.Menu>
                </Dropdown>
                <p>и год* </p>
                <Form.Control
                    type="number"
                    placeholder='Введите год'
                    value={startedyear}
                    onChange={(e) => setStartedyear(Number(e.target.value))}
                />
            </div>
            
            <hr />
            
            <Dropdown>
                <Dropdown.Toggle>{manga.selectedCountry.name || 'Страна *'}</Dropdown.Toggle>
                <Dropdown.Menu>
                    {
                        manga.countries.map((country, i) =>
                            <Dropdown.Item
                                onClick={() => manga.setSelectedCountry(country)}
                                key={i}
                            >
                                {country.name}
                            </Dropdown.Item>
                        )
                    }
                </Dropdown.Menu>
            </Dropdown>
            
            <hr />
            
            <Dropdown>
                <Dropdown.Toggle>{status || 'Статус'}</Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setStatus('в работе')}>в работе</Dropdown.Item>
                    <Dropdown.Item onClick={() => setStatus('завершено')}>завершено</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>

            <hr />

            <p>Описание</p>
            <Form.Control
                as="textarea"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            <hr />
            
            <p>Жанры</p>
            <Button
                onClick={addGenre}
                className='mb-2'
            >
                Добавить жанр
            </Button>
            {
                genres.map((genre, i) =>
                    <div className='genres_input' key={genre.id}>
                        <Form.Control
                            onChange={(e) => genre.name = e.target.value}
                        />
                        <Button
                            variant='danger'
                            onClick={() => removeGenre(genre.id)}
                        > X </Button>
                    </div>
                )
            }

            <hr />

            {   showSuccess &&
                <Alert variant="success" onClose={() => setShowAlert(false)} dismissible>
                    <p>Манга успешно создана!</p>
                </Alert>
            }
            <div className="create_block">
                <Button
                    variant='success'
                    onClick={create}
                >
                    Создать мангу
                </Button>
            </div>
        </div>
    )
})

export default CreateManga
