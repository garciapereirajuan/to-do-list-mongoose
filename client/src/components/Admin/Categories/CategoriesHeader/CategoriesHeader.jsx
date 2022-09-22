import React from 'react'
import { Button } from 'antd'
import { FolderAddFilled } from '@ant-design/icons'

import './CategoriesHeader.scss'

const CategoriesHeader = ({ addCategory, deleteAllCategories, categoriesLength }) => {
    return (
        <div className='categories-header'>
            <ButtonHeader
                addCategory={addCategory}
                deleteAllCategories={deleteAllCategories}
                categoriesLength={categoriesLength}
            />
        </div>
    )
}

const ButtonHeader = ({ categoriesLength, addCategory, deleteAllCategories }) => {
    const btnNew = (
        <div className='categories-header-btn'>
            <Button type='primary' onClick={addCategory}>
                <FolderAddFilled />
                Nueva
            </Button>
        </div>
    )

    return btnNew

    // PARA EL FUTURO

    // const btnClean = (
    //     <div className='categories-header-btn'>
    //         <Button type='danger' onClick={deleteAllCategories}>
    //             <DeleteFilled />
    //             Limpiar
    //         </Button>
    //     </div>
    // )

    // if (categoriesLength) {
    //     return <>{btnClean} {btnNew}</>
    // }

    // if (!categoriesLength) {
    //     return <>{btnNew}</>
    // }
}

export default CategoriesHeader
