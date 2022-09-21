import React from 'react'
import { Button } from 'antd'
import { FolderAddFilled, DeleteFilled } from '@ant-design/icons'

import './CategoriesHeader.scss'

const CategoriesHeader = ({ addCategory, categoriesLength }) => {
    return (
        <div className='categories-header'>
            <ButtonHeader
                addCategory={addCategory}
                categoriesLength={categoriesLength}
            />
        </div>
    )
}

const ButtonHeader = (categoriesLength, addCategory, deleteCategory) => {
    const btnNew = (
        <div className='categories-header-btn'>
            <Button type='primary' onClick={addCategory}>
                <FolderAddFilled />
                Nueva
            </Button>
        </div>
    )

    const btnClean = (
        <div className='categories-header-btn'>
            <Button type='danger' onClick={deleteCategory}>
                <DeleteFilled />
                Limpiar
            </Button>
        </div>
    )

    if (categoriesLength) {
        return <>{btnClean} {btnNew}</>
    }

    if (!categoriesLength) {
        return <>{btnNew}</>
    }
}

export default CategoriesHeader
