import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchChapters } from '../http/mangaAPI'
import { CHAPTER_PATH } from '../routes/paths'
import CustomDropdown from './CustomDropdown'


export default function ChapterNav({chapter}) {

    const [chapters, setChapters] = useState([])
    const [load, setLoad] = useState(true)
    const isfirst = chapter.numberch === 1
    const [islast, setIsLast] = useState(false)

    useEffect(() => {
        fetchChapters(chapter.mangaId)
            .then(({data}) => {
                setChapters(data.data);
                setIsLast(data.data.length === chapter.numberch)
                setLoad(false);
            })
        }, [])

    const navigator = useNavigate()

    const click = (number_chapter) => {
        let id;
        for (let i = 0; i < chapters.length; i ++) {
            if (chapters[i].numberch === number_chapter) {
                id = chapters[i].id
                break
            }
        }
        navigator(CHAPTER_PATH + '/' + id)
        window.location.reload()
    }

    if (load) return (
        <div>
            <img src="loading.gif" alt="loading..." />
        </div>
    )

    return (
        <div className='chapterNav'>
            {!isfirst ?
            <div
                onClick={() => click(chapter.numberch - 1)}
                className='chapterNavButton Prev'
            >
                <span className='prevTriangle'></span>
                <p className='chapterNavText'>Предыдущая</p>
            </div>
            :
            <div></div>
            }
        
            <div className="chapterNavContent">
                <CustomDropdown
                    mangaId={chapter.mangaId}
                />
            </div>

            {!islast ?
            <div
                onClick={() => click(chapter.numberch + 1)}
                className='chapterNavButton Next'
            >
                <p className='chapterNavText'>Следующая</p>
                <span className='nextTriangle'></span>
            </div>
            :
            <div></div>
            }
        </div>
    )
}
