import React, { useState, useEffect } from 'react'
import { Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { MANGA_PATH } from '../routes/paths'
import { observer } from 'mobx-react-lite'
import { ReactComponent as StarSvg } from '../icons/star-outline.svg'
import { fetchOneCountry, fetchRates } from '../http/mangaAPI'


const MangaItem = observer(({manga}) => {

  const [country, setCountry] = useState('')
  const [average, setAverage] = useState(0)

  useEffect(() => {
    fetchOneCountry(manga.countryId)
      .then(({data}) => setCountry(data.name))
    fetchRates(manga.id)
      .then(({data}) => {
        if (data && data.length >= 1) {
            let S = 0;
            data.forEach(item => {
                S += item.rate
            })
            const num = (S / data.length).toFixed(1)
            setAverage(num)
        }
      })
  }, [])


  let description = manga.description
  if (description.split(' ').length > 50) {
    description = description.split(' ').splice(0, 20).join(' ') + '...'
  }


  const coverSrc = process.env.REACT_APP_API_URL + manga.name.replace(/\s/g, '_') + '/cover.jpg'


  return (
    <Col md={12} className='customCol'>
      <div className='mangaItem'>
        <Link to={ MANGA_PATH + '/' + manga.id }>
          <img
            src={coverSrc}
            className='customImage' alt={manga.name}
          />
        </Link>

        <div className='mangaInfo'>
          <Link to={ MANGA_PATH + '/' + manga.id } className='mangaLink'>
            <p className="mangaTitle">{manga.name}</p>
          </Link>
          <div className="mangaRating">
            <p className='ratingText'>{average}</p>
            <StarSvg className='starSvg'/>
          </div>
          <div className="info">
            <p className='info_text'>Год:</p>
            <p>{manga.startedyear || '-'}</p>

            <p className='info_text'>Страна:</p>
            <p>{country || '-'}</p>

            <p className='info_text'>Статус:</p>
            <p>{manga.status || '-'}</p>
          </div>
          <p className='mangaDescription'>{description}</p>
          </div>
      </div>
    </Col>
  )
})

export default MangaItem
