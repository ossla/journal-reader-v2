import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import { Row, Col } from 'react-bootstrap'
import { Context } from '..'
import FilterBar from '../components/FilterBar'
import MangaItem from '../components/MangaItem'
import Page from '../components/Page'
import { fetchCountries, fetchManga, fetchYears } from '../http/mangaAPI'

const Catalog = observer(() => {

  const { manga } = useContext(Context)

  useEffect(() => {
    fetchManga(null, null, manga.page, manga.limit)
      .then(({data}) => {
        manga.setManga(data.rows)
        manga.setCount(data.count)
      })
    fetchCountries()
      .then(({data}) => manga.setCountries(data))
    fetchYears()
      .then(({data}) => manga.setYears(data))
  }, [])

  useEffect(() => {
    fetchManga(manga.selectedCountry.id, manga.selectedYear.id, manga.page, manga.limit)
      .then(({data}) => {
        manga.setManga(data.rows)
        manga.setCount(data.count)
      })
  }, [manga.page, manga.selectedCountry, manga.selectedYear])

  return (
    <div className='catalog'>
      <Row>
        <Col md={3} sm={12}>
          <FilterBar />
        </Col>

        <Col md={9} sm={12}>
          <Row className='customRow'>
            {
              manga.manga.map((manga, i) => 
                <MangaItem
                  manga={manga}
                  key={i}
                />
              )
            }
          </Row>
        </Col>
      </Row>
      <Page />
    </div>
  )
})

export default Catalog