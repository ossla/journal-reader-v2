import React, { useContext, useEffect, useState } from 'react'
import { observer } from 'mobx-react-lite'
import { fetchOneManga, fetchOneCountry, createFavorite, destroyFavorite, fetchOneFavorite } from '../http/mangaAPI'
import { check } from '../http/userAPI'
import { useParams } from 'react-router-dom'
import { ReactComponent as HeartSvg} from '../icons/add_favorites.svg'
import { Context } from '..'
// import { Button } from 'react-bootstrap'
import CustomDropdown from '../components/CustomDropdown'
import Content from '../components/Content'
import RatingComponent from '../components/RatingComponent'

const Manga = observer(() => {

  const { user } = useContext(Context)

  const {id} = useParams()
  const [manga, setManga] = useState({})

  const [country, setCountry] = useState('')
  const [description, setDescription] = useState('')
  const [show, setShow] = useState(false)

  const [liked, setLiked] = useState(false)

  const [load, setLoad] = useState(true)

  useEffect(() => {
    async function fetchData() {

      let countryId, mangaId;

      await fetchOneManga(id)
        .then(({data}) => {
          if (data) {
            setManga(data)
            mangaId = data.id
            
            if (data.description.split(' ').length > 20) {
              setDescription(data.description.split(' ').splice(0, 20).join(' ') + '...')
            } else {
              setDescription(data.description)
              setShow('small')
            }

            countryId = data.countryId
          }
        })

      await fetchOneCountry(countryId)
        .then(({data}) => setCountry(data.name))

      await check()
        .then((data) => {
          user.setUser(data)
          setLoad(false)
        })

      if (user.isAuth) {
        await fetchOneFavorite(user.user.id, mangaId)
          .then(({data}) => {
            if (data.data === 'YES') setLiked(true)
          })
      }
    }
    fetchData()

  }, [])


  const like = async () => {
    try {
      if (!liked) {
        await createFavorite(user.user.id, manga.id)
        setLiked(true)
      }
      if (liked) {
        await destroyFavorite(user.user.id, manga.id)
        setLiked(false)
      }
    } catch (error) {
      alert(error.message)
    }
  }

  const expand = () => {
    if (!show) {
      setDescription(manga.description)
    } else {
      setDescription(manga.description.split(' ').splice(0, 20).join(' ') + '...')
    }
    setShow(!show)
  }

  if (load) {
    return (
      <img src="loading.gif" alt="loading..."/>
    )
  }

  const isActive = liked ? 'active' : ''

  const coverSrc = process.env.REACT_APP_API_URL + manga.name.replace(/\s/g, '_') + '/cover.jpg'

  return (
    <div className="mangaContainer">
      <div className='mangaPage'>
        <div md={4} sm={12}>
          {/* Обложка */}
          <div className='coverContainer'>
            <img src={coverSrc} alt="cover" className='cover'/>
          </div>
          <div className='belongsToImgContainer'>
            <div className='belongsToImg'>
              {/* добавить в избранное */}
              <HeartSvg
                className={'like ' + isActive}
                onClick={like}
              />

              {/* оглавление с dropdown меню */}
              <CustomDropdown mangaId={manga.id}/>
            </div>
          </div>
        </div>
        <div md={6} sm={12} className='aboutManga'>
          {/* имя манги */}
          <p className='title'>{manga.name}</p>
          
          {/* рейтинг */}
          <RatingComponent mangaId={manga.id}/>

          {/* страна, статус, год */}
          <p>Информация о манге</p>
          <div className='info'>
            <p className='info_text'>Год:</p>
            <p>{manga.startedyear || '-'}</p>

            <p className='info_text'>Страна:</p>
            <p>{country || '-'}</p>

            <p className='info_text'>Статус:</p>
            <p>{manga.status || '-'}</p>
          </div>
          
          {/* описание */}
          <div className='description'>
            <p>Описание:</p>
            {description}
            <a
              onClick={show === 'fuck' ? undefined : expand}
              className='expand'
            >
            {show === 'small' ? '' : show ? 'Свернуть' : 'Развернуть'}
            </a>
          </div>
          
          {/* Оглавление (список глав, не dropdown): */}
          <Content />
        </div>
      </div>
    </div>
  )
})

export default Manga
