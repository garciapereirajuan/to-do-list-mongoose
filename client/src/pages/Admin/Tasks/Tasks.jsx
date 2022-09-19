import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import queryString from 'query-string'
import useAuth from '../../../hooks/useAuth'
import Modal from '../../../components/Modal'
import TasksList from '../../../components/Admin/Tasks/TasksList'
import AddEditForm from '../../../components/Admin/Tasks/AddEditForm'
import Pagination from '../../../components/Admin/Pagination'
import TasksHeader from '../../../components/Admin/Tasks/TasksHeader'
import { Row, Col, Modal as ModalAntd, notification } from 'antd'
import { getAccessTokenApi, verifyExpireTokenInWeb } from '../../../api/auth'
import { deleteTaskApi, indexTasksApi, indexTasksWithoutPaginationApi, updateTaskApi } from '../../../api/task'
import { indexCategoriesApi } from '../../../api/category'
import { updateCategoryAndTasks } from '../../../utils/categoryAndTasksManager'

import './Tasks.scss'

const Tasks = ({ setExpireToken, editCategoryGeneral }) => {
    const [tasks, setTasks] = useState(null)
    const [tasksArray, setTasksArray] = useState([])
    const [reloadTasks, setReloadTasks] = useState(false)
    const [categories, setCategories] = useState(null)
    const [reloadCategories, setReloadCategories] = useState(false)
    const [isVisibleModal, setIsVisibleModal] = useState(false)
    const [modalTitle, setModalTitle] = useState('')
    const [modalContent, setModalContent] = useState(null)
    const [modalWidth, setModalWidth] = useState('500px')
    const [checked, setChecked] = useState(false)

    const { confirm } = ModalAntd
    const { user } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const { page = 1 } = queryString.parse(location.search)
    const limit = 6
    // const limit = (window.innerHeight / 110) - 1.5

    useEffect(() => {
        verifyExpireTokenInWeb(setExpireToken)
    }, [setExpireToken])

    useEffect(() => {
        getTasks()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, page, reloadTasks, checked])

    useEffect(() => {
        getCategories()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadCategories])

    useEffect(() => {
        getTasksWithoutPagination()

    }, [reloadTasks, user])

    const getTasks = () => {
        const token = getAccessTokenApi()

        // const alternateOrderDateDown = (tasks) => {
        //     const withDateDown = []
        //     const withoutDateDown = []

        //     tasks.docs.forEach(item => {
        //         if (item.dateDown) {
        //             console.log(item)
        //             withDateDown.push(item)
        //         }
        //         if (!item.dateDown) {
        //             console.log(item)
        //             withoutDateDown.push(item)
        //         }
        //     })

        //     tasks.docs = withDateDown.concat(withoutDateDown)
        //     setTasks(tasks)

        // }

        indexTasksApi(token, page, limit, checked, user.id)
            .then(response => {
                if ((response?.code !== 200 && response?.code !== 404) || !response.code) {
                    notification['error']({ message: 'Se produjo un error al cargar las tareas.' })
                    return
                }
                // if (JSON.stringify(response.sort) === '{"dateDown":"asc"}') {
                //     alternateOrderDateDown(response.tasks)
                //     return   
                // }
                // console.log(JSON.stringify(response.sort))
                setTasks(response.tasks)
                setReloadTasks(false)
            })
            .catch(err => {
                notification['error']({ message: 'Error en el servidor.' })
            })
    }

    const getCategories = () => {
        const token = getAccessTokenApi()

        indexCategoriesApi(token, user.id)
            .then(response => {
                if ((response?.code !== 200 && response?.code !== 404) || !response.code) {
                    notification['error']({ message: 'Se produjo un error al cargar las categorías.' })
                    return
                }

                setCategories(response.categories)
                setReloadCategories(false)
            })
            .catch(err => {
                notification['error']({ message: 'Error en el servidor.' })
            })
    }

    const getTasksWithoutPagination = () => {
        const token = getAccessTokenApi()

        user && indexTasksWithoutPaginationApi(token, user.id)
            .then(response => {
                if ((response?.code !== 200 && response?.code !== 404) || !response.code) {
                    // notification['error']({ message: 'Se produjo un error al cargar las tareas'})
                    console.log('Error al cargar las tareas: ' + JSON.stringify(response))
                    return
                }
                setTasksArray(response.tasks)
            })
            .catch(err => {
                console.log('Error al cargar las tareas: ' + JSON.stringify(err))
            })

        setReloadTasks(false)
    }

    const addTask = () => {
        setModalWidth('500px')
        verifyExpireTokenInWeb(setExpireToken)
        setIsVisibleModal(true)
        setModalTitle('Nueva tarea')
        setModalContent(
            <AddEditForm
                task={null}
                newOrder={tasks ? tasks.total : 0}
                categories={categories}
                setIsVisibleModal={setIsVisibleModal}
                setReloadTasks={setReloadTasks}
                setReloadCategories={setReloadCategories}
            />
        )
    }

    const editTask = (task) => {
        setModalWidth('500px')
        verifyExpireTokenInWeb(setExpireToken)
        setIsVisibleModal(true)
        setModalTitle('Actualizar tarea')
        setModalContent(
            <AddEditForm
                task={task}
                newOrder={null}
                categories={categories}
                setIsVisibleModal={setIsVisibleModal}
                setReloadTasks={setReloadTasks}
                setReloadCategories={setReloadCategories}
            />
        )
    }

    const deleteTask = (task) => {
        confirm({
            title: 'Eliminar tarea',
            content: `¿Quieres eliminar la tarea ${task.title}?`,
            okText: 'Eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk() {
                const token = getAccessTokenApi()

                const remove = () => {
                    deleteTaskApi(token, task._id)
                        .then(response => {
                            if (/token/g.test(response.message)) {
                                notification['info']({
                                    message: 'Lo siento, debes recargar la página e intentarlo de nuevo.',
                                    duration: 20,
                                })
                                return
                            }
                            if (response?.code !== 200 || !response.code) {
                                notification['error']({ message: 'Se produjo un error al eliminar.' })
                                return
                            }

                            notification['success']({ message: response.message })
                            setReloadTasks(true)
                        })
                        .catch(err => {
                            notification['error']({ message: 'Se produjo un error inesperado.' })
                        })
                }

                if (task.category) {
                    updateCategoryAndTasks(token, task._id, null, task.category, false, () => { })
                    remove()
                } else {
                    remove()
                }


            }
        })
    }

    const updateCheckTask = (e, task) => {
        const { checked } = e.target
        const token = getAccessTokenApi()

        updateTaskApi(token, task._id, { checked })
            .then(response => {
                if (/token/g.test(response.message)) {
                    notification['info']({
                        message: 'Lo siento, debes recargar la página e intentarlo de nuevo.',
                        duration: 20,
                    })
                    return
                }
                if (response?.code !== 200 || !response.code) {
                    notification['error']({ message: 'Se produjo un error al actualizar.' })
                    return
                }

                let message = checked
                    ? 'La tarea ha sido completada.'
                    : 'Marcaste la tarea como incompleta.'
                notification['success']({ message })

                setReloadTasks(true)
            })
    }

    const editCategory = (category) => {
        const categoryObj = categories.filter(item => item._id === category)[0]
        setModalWidth('700px')

        editCategoryGeneral(
            categoryObj, verifyExpireTokenInWeb, setExpireToken,
            setIsVisibleModal, setModalTitle, setModalContent,
            tasksArray, categories, setReloadCategories, setReloadTasks
        )
    }

    return (
        <Row className='tasks'>
            <Col sm={0} md={4} />
            <Col sm={24} md={16} >
                <TasksHeader
                    tasks={tasks}
                    addTask={addTask}
                    checked={checked}
                    setChecked={setChecked}
                    setReloadTasks={setReloadTasks}
                />
                <TasksList
                    tasks={tasks ? tasks : []}
                    editTask={editTask}
                    deleteTask={deleteTask}
                    updateCheckTask={updateCheckTask}
                    categories={categories}
                    editCategory={editCategory}
                />
            </Col>
            {
                tasks
                    ? tasks.docs.length !== 0
                    && <Pagination tasks={tasks} location={location} navigate={navigate} />
                    : null
            }
            <Modal
                modalTitle={modalTitle}
                isVisibleModal={isVisibleModal}
                setIsVisibleModal={setIsVisibleModal}
                width={modalWidth}
            >
                {modalContent}
            </Modal>
            <Col sm={0} md={4} />
        </Row>
    )
}

export default Tasks
