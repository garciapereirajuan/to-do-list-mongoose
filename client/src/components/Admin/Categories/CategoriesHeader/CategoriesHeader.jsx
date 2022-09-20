import React from 'react'
import { Button } from 'antd'

const CategoriesHeader = ({ addCategory }) => {
    return (
        <div className='categories__header'>
            <div className='categories__header-btn-new-category'>
                <Button type='primary' onClick={addCategory}>Nueva categoría</Button>
            </div>
        </div>
    )
}

export default CategoriesHeader
