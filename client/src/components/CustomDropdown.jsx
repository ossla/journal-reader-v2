import React, { useEffect, useState } from 'react'
import { Dropdown } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { fetchChapters } from '../http/mangaAPI'

const CustomDropdown = ({mangaId}) => {

    const [chapters, setChapters] = useState([])

    useEffect(() => {
        try {
            fetchChapters(mangaId)
                .then(({data}) => setChapters(data.data))
        } catch (error) {
            alert(error.data.message)
        }
    }, [])
    
    if (typeof chapters === 'string') {
        return (
            <></>
        )
    }

    return (
        <Dropdown>
            <Dropdown.Toggle>
                Оглавление
            </Dropdown.Toggle>
            <Dropdown.Menu className='dropdownContent'>
            {
                chapters.map((item, i) => 
                    <Dropdown.Item key={i}>
                        <Link to={'/chapters/' + item.id}>
                            {item.numberch + ': ' + item.name}
                        </Link>
                    </Dropdown.Item>
                )
            }
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default CustomDropdown
