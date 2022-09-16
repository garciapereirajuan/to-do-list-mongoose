import React, { useState, useEffect } from 'react'
import CategoriesTree from '../../../components/Admin/Categories/CategoriesTree'
import useAuth from '../../../hooks/useAuth'
import { getAccessTokenApi } from '../../../api/auth'
import { indexCategoriesApi } from '../../../api/category'
import { indexTasksWithoutPaginationApi } from '../../../api/task'
import { Col, Row, Button, Modal as ModalAntd, notification } from 'antd'
import Modal from '../../../components/Modal'
import AddEditForm from '../../../components/Admin/Categories/AddEditForm'
import { verifyExpireTokenInWeb } from '../../../api/auth'
import { updateCategoryAndTasks } from '../../../utils/categoryAndTasksManager'

import './Categories.scss'

const Categories = ({ setExpireToken }) => {
    const [categories, setCategories] = useState([])
    const [reloadCategories, setReloadCategories] = useState(false)
    const [tasks, setTasks] = useState([])
    const [reloadTasks, setReloadTasks] = useState(false)
    const [isVisibleModal, setIsVisibleModal] = useState(false)
    const [modalTitle, setModalTitle] = useState('')
    const [modalContent, setModalContent] = useState(null)
    const { user } = useAuth()
    const { confirm } = ModalAntd

    useEffect(() => {
        verifyExpireTokenInWeb(setExpireToken)
    }, [setExpireToken])

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
        verifyExpireTokenInWeb(setExpireToken)
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

    const editCategory = (category) => {
        verifyExpireTokenInWeb(setExpireToken)
        setIsVisibleModal(true)
        setModalTitle('Editar categoría')
        setModalContent(
            <AddEditForm
                category={category}
                tasks={tasks}
                categories={categories}
                setReloadCategories={setReloadCategories}
                setReloadTasks={setReloadTasks}
                setIsVisibleModal={setIsVisibleModal}
            />
        )
    }

    const deleteCategory = (category) => {
        confirm({
            title: 'Eliminar categoría',
            content: `¿Quieres eliminar la categoría ${category.title}?`,
            okText: 'Eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                const token = getAccessTokenApi()

                const removeCategoryAndTasks = () => {
                    // acá se remueve sólo la relación entre estas
                    updateCategoryAndTasks(token, category.tasks, null, category._id, false, () => { })
                }

                const removeCategory = () => {

                }

                const removeTasks = () => {

                }

                if (category.tasks.length !== 0) {
                    confirm({
                        title: 'Eliminando categoría...',
                        content: `Tu categoría tiene tareas... ¿También deseas eliminar esas tareas?`,
                        okText: 'Si',
                        okType: 'danger',
                        cancelText: 'No',
                        onOk() {

                        },
                        onCancel() {

                        }
                    })
                }

                // deleteTaskApi(token, task._id)
                //     .then(response => {
                //         if (/token/g.test(response.message)) {
                //             notification['info']({
                //                 message: 'Lo siento, debes recargar la página e intentarlo de nuevo.',
                //                 duration: 20,
                //             })
                //             return
                //         }
                //         if (response?.code !== 200 || !response.code) {
                //             notification['error']({ message: 'Se produjo un error al eliminar.' })
                //             return
                //         }

                //         notification['success']({ message: response.message })
                //         setReloadTasks(true)
                //     })
                //     .catch(err => {
                //         notification['error']({ message: 'Se produjo un error inesperado.' })
                //     })
            }
        })
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
                <CategoriesTree
                    categories={categories}
                    setReloadCategories={setReloadCategories}
                    setReloadTasks={setReloadTasks}
                    editCategory={editCategory}
                    deleteCategory={deleteCategory}
                />
            </Col>
            <Col md={6} />

            <Modal
                modalTitle={modalTitle}
                isVisibleModal={isVisibleModal}
                setIsVisibleModal={setIsVisibleModal}
                width='700px'
            >
                {modalContent}
            </Modal>
        </Row>
    )
}

export default Categories
