import React from 'react'
import { Pagination as PaginationAntd } from 'antd'

import './Pagination.scss'

const Pagination = ({ tasks, location, navigate }) => {
    const currentPage = parseInt(tasks.page)

    const onChangePage = (newPage) => {
        navigate(`${location.pathname}?page=${newPage}`)
    }

    return (
        <PaginationAntd
            defaultCurrent={currentPage}
            total={tasks.total}
            pageSize={tasks.limit}
            onChange={e => onChangePage(e)}
            className='pagination'
        />

    )
}
export default Pagination
