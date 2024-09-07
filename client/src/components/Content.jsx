import React, { useEffect, useState } from 'react'
import { fetchChapters } from '../http/mangaAPI'
import { CHAPTER_PATH } from '../routes/paths'
import { Link, useParams } from 'react-router-dom'

export default function Content() {

    const { id } = useParams()

    const [chapters, setChapters] = useState([])

    useEffect(() => {
        try {
            fetchChapters(id)
                .then(({data}) => {
                    setChapters(data.data)
                })
        } catch (error) {
            alert(error.message)
        }
    }, [])

    if (typeof chapters === 'string') {
        return (
            <h1 className='m-4'>
                {chapters}
            </h1>
        )
    }


    return (
        <>
            <div className='chapters_border'></div>
        {
            chapters.map((item, index) => {
                let i = index + 1

                return (

                    <Link
                        to={CHAPTER_PATH + '/' + item.id}
                        key={index}
                        className='chapters_content'
                    >
                        <p>{i}</p>
                        <p>{item.name}</p>
                    </Link>

                )
            })
        }

        </>
    )
}
