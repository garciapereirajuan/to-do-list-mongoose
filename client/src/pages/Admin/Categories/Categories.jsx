import React, { useState, useEffect } from 'react'
import useAuth from '../../../hooks/useAuth'
import Modal from '../../../components/Modal'
import AddEditFormCategory from '../../../components/Admin/Shared/AddEditFormCategory'
import AddEditFormTask from '../../../components/Admin/Shared/AddEditFormTask'
import CategoriesTree from '../../../components/Admin/Categories/CategoriesTree'
import CategoriesHeader from '../../../components/Admin/Categories/CategoriesHeader'
import { Col, Row, Modal as ModalAntd } from 'antd'
import { openNotification } from '../../../utils/openNotification'
import { indexCategoriesApi, deleteCategoryApi } from '../../../api/category'
import { indexTasksWithoutPaginationApi } from '../../../api/task'
import { getAccessTokenApi, verifyExpireTokenInWeb } from '../../../api/auth'
import { updateCategoryAndTasks } from '../../../utils/categoryAndTasksManager'
import { deleteManyTasks } from '../../../utils/deleteManyRegisters'
import { Helmet } from 'react-helmet'

import './Categories.scss'

const Categories = ({ setExpireToken, editCategoryGeneral }) => {
    const [categories, setCategories] = useState([])
    const [reloadCategories, setReloadCategories] = useState(false)
    const [tasks, setTasks] = useState([])
    const [reloadTasks, setReloadTasks] = useState(false)
    const [isVisibleModal, setIsVisibleModal] = useState(false)
    const [modalTitle, setModalTitle] = useState('')
    const [modalContent, setModalContent] = useState(null)
    const [modalWidth, setModalWidth] = useState('700px')
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
                    //  openNotification('error', 'Se produjo un error al cargar las categorías.')
                    console.log('Se produjo un error al cargar las categorías.')
                    return
                }
                console.log(response.categories)
                if (!response.categories) {
                    setCategories(null)
                    return
                }
                setCategories(response.categories)
            })
            .catch(err => {
                openNotification('error', 'Se produjo un error al cargar las categorías.')
            })

        setReloadCategories(false)
    }, [reloadCategories, user])

    useEffect(() => {
        const token = getAccessTokenApi()

        user && indexTasksWithoutPaginationApi(token, user.id)
            .then(response => {
                if ((response?.code !== 200 && response?.code !== 404) || !response.code) {
                    //  openNotification('error', 'Se produjo un error al cargar las tareas.')
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
        setModalWidth('700px')
        verifyExpireTokenInWeb(setExpireToken)
        setIsVisibleModal(true)
        setModalTitle('Crear categoría')
        setModalContent(
            <AddEditFormCategory
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
        setModalWidth('700px')
        verifyExpireTokenInWeb(setExpireToken)
        setIsVisibleModal(true)
        setModalTitle('Editar categoría')
        setModalContent(
            <AddEditFormCategory
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
                                openNotification('error', response.message)
                                return
                            }
                            openNotification('success', msg)
                            setReloadCategories(true)
                            setReloadTasks(true)
                            setIsVisibleModal(false)
                        })
                }

                const removeCategoryAndTasks = (msg) => {
                    const tasks = category.tasks

                    deleteManyTasks(
                        tasks,
                        null,
                        removeCategory(msg)
                    )
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
                                removeCategoryAndTasks('La categoría y sus tareas fueron eliminadas.')
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
            }
        })
    }

    const addTask = (category) => {
        setModalWidth('500px')

        verifyExpireTokenInWeb(setExpireToken)
        setIsVisibleModal(true)
        setModalTitle(
            <span>
                Nueva tarea en {' '}
                <span style={{ color: '#888' }}>
                    {category.title}
                </span>
            </span>
        )
        setModalContent(
            <AddEditFormTask
                task={null}
                category={category._id}
                categories={categories}
                setIsVisibleModal={setIsVisibleModal}
                setReloadTasks={setReloadTasks}
                setReloadCategories={setReloadCategories}
            />
        )
    }

    const editTask = (taskId) => {
        const task = tasks.filter(item => item._id === taskId)[0]

        setModalWidth('500px')
        verifyExpireTokenInWeb(setExpireToken)
        setIsVisibleModal(true)
        setModalTitle('Actualizar tarea')
        setModalContent(
            <AddEditFormTask
                task={task}
                autoFocus={null}
                categories={categories}
                setIsVisibleModal={setIsVisibleModal}
                setReloadTasks={setReloadTasks}
                setReloadCategories={setReloadCategories}
            />
        )

    }

    return (
        <>
            <Helmet>
                <title>Categorías | To-Do List</title>
                <meta
                    name='description'
                    content='Categorías | Aplicación web To Do List | Juan García Pereira'
                    data-react-helmet='true'
                />
            </Helmet>
            <Row className='categories'>
                <Col xs={0} sm={1} md={5} lg={6} />
                <Col xs={24} sm={22} md={14} lg={12}>
                    <CategoriesHeader
                        addCategory={addCategory}
                    />
                    <CategoriesTree
                        categories={categories || null}
                        setReloadCategories={setReloadCategories}
                        setReloadTasks={setReloadTasks}
                        addCategory={addCategory}
                        editCategory={editCategory}
                        deleteCategory={deleteCategory}
                        addTask={addTask}
                        editTask={editTask}
                    />
                </Col>
                <Col xs={0} sm={1} md={5} lg={6} />
                <Modal
                    modalTitle={modalTitle}
                    isVisibleModal={isVisibleModal}
                    setIsVisibleModal={setIsVisibleModal}
                    width={modalWidth}
                >
                    {modalContent}
                </Modal>
            </Row>
        </>
    )
}

export default Categories
