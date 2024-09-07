import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { fetchOneChapter } from '../http/mangaAPI'
import ChapterNav from '../components/ChapterNav'

const Chapter = () => {

  // для url
  const [chapter, setChapter] = useState({})
  const [mangaName, setMangaName] = useState('')
  // загрузка
  const [load, setLoad] = useState(true)
  
  const { id } = useParams()

  useEffect(() => {
    async function fetchData() {
      await fetchOneChapter(id)
        .then(({ data }) => {
          setChapter(data)
          setMangaName(data.manganame)
        })
      setLoad(false)
    }

    try {

      fetchData()

    } catch (error) {
      alert(error.message)
    }

  }, [])

  if (load) {
    return (
      <img src="/loading.gif" alt="loading..." />
    )
  }

  const manga_name = mangaName.replace(/\s/g, '_')
  let pages = [];
  for (let i = 1; i <= chapter.size; i++) {
    pages.push(
      <div className='m_page_container' key={i}>
        <img
          src={`${process.env.REACT_APP_API_URL}${manga_name}/${chapter.numberch}/${i}.jpg`}
          className="m_one_page"
          alt={i}
        />
      </div>
    )
  }

  return (
    <div className='m_chapter'>
      <ChapterNav
        chapter={chapter}
      />

      {pages}

      <ChapterNav
        chapter={chapter}
      />
    </div>
  )
}

export default Chapter
