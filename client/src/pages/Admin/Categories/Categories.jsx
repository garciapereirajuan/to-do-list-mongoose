import React, { useState, useEffect } from 'react'
import CategoriesTree from '../../../components/Admin/Categories/CategoriesTree'
import useAuth from '../../../hooks/useAuth'
import { getAccessTokenApi } from '../../../api/auth'
import { indexCategoriesApi } from '../../../api/category'
import { Col, Row, Button, notification } from 'antd'

import './Categories.scss'

const Categories = () => {
    const [categories, setCategories] = useState([])
    const [reloadCategories, setReloadCategories] = useState(false)
    const { user } = useAuth()

    useEffect(() => {
        const token = getAccessTokenApi()

        user && indexCategoriesApi(token, user.id)
            .then(response => {
                if (response?.code !== 200) {
                    notification['error']({ message: response.message })
                    return
                }
                if (!response.code) {
                    notification['error']({ message: 'Se produjo un error al cargar las categorías.' })
                    return
                }
                setCategories(response.categories)
            })
            .catch(err => {
                notification['error']({ message: 'Se produjo un error al cargar las categorías.' })
            })

        setReloadCategories(false)
    }, [reloadCategories, user])

    return (
        <Row className='categories'>
            <Col md={6} />
            <Col md={12}>
                <div className='categories__header'>
                    <div className='categories__header-btn-new-category'>
                        <Button type='primary'>Nueva categoría</Button>
                    </div>
                </div>
                <CategoriesTree categories={categories} setReloadCategories={setReloadCategories} />
            </Col>
            <Col md={6} />
        </Row>
    )
}

export default Categories
