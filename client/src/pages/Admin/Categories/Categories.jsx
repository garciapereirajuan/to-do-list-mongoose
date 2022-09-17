import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import CategoriesTree from '../../../components/Admin/Categories/CategoriesTree'
import useAuth from '../../../hooks/useAuth'
import AddEditForm from '../../../components/Admin/Categories/AddEditForm'
import Modal from '../../../components/Modal'
import { Col, Row, Button, Modal as ModalAntd, notification } from 'antd'
import { indexCategoriesApi, deleteCategoryApi } from '../../../api/category'
import { indexTasksWithoutPaginationApi, deleteTaskApi } from '../../../api/task'
import { getAccessTokenApi, verifyExpireTokenInWeb } from '../../../api/auth'
import { updateCategoryAndTasks } from '../../../utils/categoryAndTasksManager'

import './Categories.scss'

const Categories = ({ setExpireToken, editCategoryGeneral }) => {
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

        user && indexTasksWithoutPaginationApi(token, user.id)
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
        editCategoryGeneral(
            category, verifyExpireTokenInWeb, setExpireToken,
            setIsVisibleModal, setModalTitle, setModalContent,
            tasks, categories, setReloadCategories, setReloadTasks
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

                // let i = 0
                // let tasks = category.tasks

                // const loopAsync = () => {
                //     console.log(tasks[i]._id)

                //     i++
                //     if (i === tasks.length) {
                //         console.log('Terminó', i)
                //     }

                //     console.log('Se repite', i < tasks.length)
                //     i < tasks.length && loopAsync()
                // }
                // console.log('Arranca', i)
                // loopAsync()

                // return

                const removeRelationOfCategoryAndTasks = (finish) => {
                    // acá se remueve sólo la relación entre estas
                    updateCategoryAndTasks(
                        token, category.tasks, null, category._id, false, finish
                    )
                }

                const removeCategory = (msg) => {
                    deleteCategoryApi(token, category._id)
                        .then(response => {
                            if (response?.code !== 200) {
                                notification['error']({ message: response.message })
                                return
                            }
                            notification['success']({ message: msg })
                            setReloadCategories(true)
                            setReloadTasks(true)
                            setIsVisibleModal(false)
                        })
                }

                const removeCategoryAndTasks = () => {
                    const tasks = category.tasks
                    let i = 0

                    const loopAsync = async () => {
                        await deleteTaskApi(token, tasks[i]._id)
                            .then(response => {
                                if (response?.code !== 200) {
                                    notification['error']({
                                        message: response.message
                                    })
                                    i = 100000
                                    return
                                }
                                // notification['success']({ message: response.message })
                                i++
                                if (i === tasks.length) {
                                    console.log('Terminó', i)
                                    removeCategory('La categoría y sus tareas fueron eliminadas.')
                                }
                            })

                        if (i > tasks.length) i = 10000
                        console.log('Se repite', i < tasks.length)
                        i < tasks.length && loopAsync()
                    }
                    console.log('Arranca', i)
                    loopAsync()
                }

                if (category.tasks.length !== 0) {
                    confirm({
                        title: 'Eliminando categoría...',
                        content: `Tu categoría tiene tareas... ¿También deseas eliminar esas tareas?`,
                        okText: 'Eliminarlas',
                        okType: 'danger',
                        cancelText: 'Conservarlas',
                        onOk() {
                            const finish = () => {
                                removeCategoryAndTasks()
                            }
                            removeRelationOfCategoryAndTasks(finish)
                        },
                        onCancel() {
                            const finish = () => {
                                removeCategory('La categoría ha sido eliminada. Se conservaron las tareas.')
                            }
                            removeRelationOfCategoryAndTasks(finish)
                        }
                    })
                } else {
                    removeCategory('La categoría ha sido eliminada.')
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
