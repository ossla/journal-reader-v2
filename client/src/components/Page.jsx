import React, { useContext } from 'react'
import { Pagination } from 'react-bootstrap'
import { observer } from 'mobx-react-lite'
import { Context } from '..'

const Page = observer(() => {

    const { manga } = useContext(Context)

    const pages = Math.ceil(manga.count / manga.limit)

    let items = []
    for (let number = 1; number <= pages; number++) {
        items.push(
            <Pagination.Item
                key={number}
                active={number === manga.page}
                onClick={() => manga.setPage(number)}
            >
                {number}
            </Pagination.Item>
        )
    }

    return (
        items.length <= 1 ?
        <div></div>
        :
        <div className='pagination'>
            <Pagination>{items}</Pagination>
        </div>
    )
})

export default Page