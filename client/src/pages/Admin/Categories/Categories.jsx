import React, { useState, useEffect } from 'react'
import CategoriesTree from '../../../components/Admin/Categories/CategoriesTree'
import useAuth from '../../../hooks/useAuth'
import { getAccessTokenApi } from '../../../api/auth'
import { indexCategoriesApi } from '../../../api/category'
import { indexTasksWithoutPaginationApi } from '../../../api/task'
import { Col, Row, Button, notification } from 'antd'
import Modal from '../../../components/Modal'
import AddEditForm from '../../../components/Admin/Categories/AddEditForm'

import './Categories.scss'

const Categories = () => {
    const [categories, setCategories] = useState([])
    const [reloadCategories, setReloadCategories] = useState(false)
    const [tasks, setTasks] = useState([])
    const [reloadTasks, setReloadTasks] = useState(false)
    const [isVisibleModal, setIsVisibleModal] = useState(false)
    const [modalTitle, setModalTitle] = useState('')
    const [modalContent, setModalContent] = useState(null)
    const { user } = useAuth()

    useEffect(() => {
        const token = getAccessTokenApi()

        user && indexCategoriesApi(token, user.id)
            .then(response => {
                if ((response?.code !== 200 && response?.code !== 404) || !response.code) {
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

    useEffect(() => {
        const token = getAccessTokenApi()

        user && indexTasksWithoutPaginationApi(token, false, user.id)
            .then(response => {
                if ((response?.code !== 200 && response?.code !== 404) || !response.code) {
                    // notification['error']({ message: 'Se produjo un error al cargar las tareas'})
                    console.log('Error al cargar las tareas: ' + JSON.stringify(response))
                    return
                }
                setTasks(response.tasks)
            })
            .catch(err => {
                console.log('Error al cargar las tareas: ' + JSON.stringify(err))
            })

        setReloadTasks(false)
    }, [reloadTasks, user])

    const addCategory = () => {
        setIsVisibleModal(true)
        setModalTitle('Crear categoría')
        setModalContent(
            <AddEditForm
                category={null}
                tasks={tasks}
                categories={categories}
                setReloadCategories={setReloadCategories}
                setReloadTasks={setReloadTasks}
                setIsVisibleModal={setIsVisibleModal}
            />
        )
    }

    const editCategory = () => {

    }

    return (
        <Row className='categories'>
            <Col md={6} />
            <Col md={12}>
                <div className='categories__header'>
                    <div className='categories__header-btn-new-category'>
                        <Button type='primary' onClick={addCategory}>Nueva categoría</Button>
                    </div>
                </div>
                <CategoriesTree categories={categories} setReloadCategories={setReloadCategories} />
            </Col>
            <Col md={6} />

            <Modal
                modalTitle={modalTitle}
                isVisibleModal={isVisibleModal}
                setIsVisibleModal={setIsVisibleModal}
                width='600px'
            >
                {modalContent}
            </Modal>
        </Row>
    )
}

export default Categories
