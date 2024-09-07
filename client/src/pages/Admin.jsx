import React, { useState } from 'react'
import CreateManga from '../components/adminComponents/CreateManga'
import CreateChapter from '../components/adminComponents/CreateChapter'
import CreateYear from '../components/adminComponents/CreateYear'
import CreateCountry from '../components/adminComponents/CreateCountry'

export default function Admin() {

  const [isMangaOpen, setIsMangaOpen] = useState(false)
  const [isChapterOpen, setChapterOpen] = useState(false)
  const [isYearOpen, setIsYearOpen] = useState(false)
  const [isCountryOpen, setIsCountryOpen] = useState(false)

  const styleMangaButton = isMangaOpen ? ' block_opened' : ''
  const styleChapterButton = isChapterOpen ? ' block_opened' : ''
  const styleYearButton = isYearOpen ? ' block_opened' : ''
  const styleCountryButton = isCountryOpen ? ' block_opened' : ''

  return (
    <div className='admin_container'>

      <p className='admin_header'>Админ панель</p>

      <div className='creator_block'>
        <p
          className='creator_button'
          onClick={() => setIsMangaOpen(!isMangaOpen)}
        >
          Манга
          <span className={'button_animation_1' + styleMangaButton}></span>
          <span className='button_animation_2'></span>
        </p>

        { isMangaOpen &&
          <CreateManga />
        }
      </div>

      <div className='creator_block'>
        <p
          className='creator_button'
          onClick={() => setChapterOpen(!isChapterOpen)}
        >
          Глава
          <span className={'button_animation_1' + styleChapterButton}></span>
          <span className='button_animation_2'></span>
        </p>

        { isChapterOpen &&
          <CreateChapter />
        }
      </div>

      <div className='creator_block'>
        <p
          className='creator_button'
          onClick={() => setIsYearOpen(!isYearOpen)}
        >
          Годовой промежуток
          <span className={'button_animation_1' + styleYearButton}></span>
          <span className='button_animation_2'></span>
        </p>

        { isYearOpen &&
          <CreateYear />
        }
      </div>

      <div className='creator_block'>
        <p
          className='creator_button'
          onClick={() => setIsCountryOpen(!isCountryOpen)}
        >
          Страна
          <span className={'button_animation_1' + styleCountryButton}></span>
          <span className='button_animation_2'></span>
        </p>

        { isCountryOpen &&
          <CreateCountry />
        }
      </div>
    </div>
  )
}
