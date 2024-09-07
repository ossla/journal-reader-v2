import React, { useContext, useEffect, useState } from 'react'
import { Context } from '..'
import { fetchFavorites } from '../http/mangaAPI'
import { Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom' 
import { MANGA_PATH } from '../routes/paths'

export default function Favorites() {

  const { user } = useContext(Context)
  
  const [manga, setManga] = useState([])
  
  const [load, setLoad] = useState(true)

  useEffect(() => {
    try {
      fetchFavorites(user.user.id)
        .then(({data}) => {
          if (data) {
            setManga(data)
            setLoad(false)
          }
        })
    } catch (error) {
      alert(error.message)
    }
  }, [])

  if (load) {
    return (
      <img src="/loading.gif" alt="loading..." />
    )
  }

  return (
    <div className='favorites_container'>
    <Row>
      { !manga.length ?
        <Col sm={8} md={8} className='favorites_block'>
          <h2>Ничего не найдено!</h2>
        </Col>
        
        :

        manga.map((item, i) => {
          const name = item.name.replace(/\s/g, '_')
          const imgPath = `${process.env.REACT_APP_API_URL}${name}/cover.jpg`
          return (
            
            <Col
              md={4} sm={12} lg={4}
              key={item.id}
              className='favorites_block favorites_col'
            >
              <Link
                to={MANGA_PATH + '/' + item.mangaId}
                onClick={() => console.log(item.mangaId)}
                className='favorites_name'
              >
                {item.name}
              </Link>
              <img
                src={imgPath}
                alt={name}
                className='customImage'  
              />
            </Col>

          )}
        )
      }
    </Row>
    </div>
  )
}
