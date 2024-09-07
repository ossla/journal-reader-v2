import React, { useEffect, useContext, useState } from 'react'
import { createRate, fetchRates } from '../http/mangaAPI'
import { Context } from '..'
import { observer } from 'mobx-react-lite'
import { ReactComponent as StarSvg } from '../icons/star-svgrepo-com.svg'

const RatingComponent = observer(({mangaId}) => {

    const { user } = useContext(Context)

    // Для подсчета среднего рейтинга
    const [average, setAverage] = useState(0)

    const [rating, setRating] = useState(0)
    const [hover, setHover] = useState(0)

    useEffect(() => {

        fetchRates(mangaId)
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

    const create = async (rate) => {
        try {
            setRating(rate)
            await createRate(user.user.id, mangaId, rate)
        } catch (error) {
            alert(error.response.data.message)
        }
    }

    return(
        <div>
            <div className="rating">
            <span>{average}</span>
            { user.isAuth ?
            <div className="stars_container">
                {
                    [...Array(5)].map((star, index) => {
                        index += 1;
                        
                        return (
                        <div
                            type="button"
                            key={index}
                            className={index <= (hover || rating) ? "on star_block" : "star_block"}
                            onClick={() => create(index)}
                            onMouseEnter={() => setHover(index)}
                            onMouseLeave={() => setHover(rating)}
                        >
                            <StarSvg className='star' />
                        </div>
                        );
                    })
                }
            </div>
            :
            <StarSvg className='star mx-2'/>
            }
            </div>
        </div>
    )
})

export default RatingComponent
