import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import queryString from 'query-string'
import useAuth from '../../../hooks/useAuth'
import Modal from '../../../components/Modal'
import TasksList from '../../../components/Admin/Tasks/TasksList'
import AddEditFormTask from '../../../components/Admin/Shared/AddEditFormTask'
import AddEditFormCategory from '../../../components/Admin/Shared/AddEditFormCategory'
import Pagination from '../../../components/Admin/Pagination'
import TasksHeader from '../../../components/Admin/Tasks/TasksHeader'
import { Row, Col, Button, Modal as ModalAntd } from 'antd'
import { openNotification } from '../../../utils/openNotification'
import { getAccessTokenApi, verifyExpireTokenInWeb } from '../../../api/auth'
import { deleteTaskApi, indexTasksApi, indexTasksWithoutPaginationApi, updateTaskApi } from '../../../api/task'
import { indexCategoriesApi } from '../../../api/category'
import { updateCategoryAndTasks } from '../../../utils/categoryAndTasksManager'
import { deleteManyTasks } from '../../../utils/deleteManyRegisters'

import './Tasks.scss'

const Tasks = ({ setExpireToken }) => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reloadTasks, user])

    const getTasks = () => {
        const token = getAccessTokenApi()

        indexTasksApi(token, page, limit, checked, user.id)
            .then(response => {
                if ((response?.code !== 200 && response?.code !== 404) || !response.code) {
                    openNotification('error', 'Se produjo un error al cargar las tareas.')
                    return
                }
                setTasks(response.tasks)
                setReloadTasks(false)
            })
            .catch(err => {
                openNotification('error', 'Error en el servidor.')
            })
    }

    const getCategories = () => {
        const token = getAccessTokenApi()

        indexCategoriesApi(token, user.id)
            .then(response => {
                if ((response?.code !== 200 && response?.code !== 404) || !response.code) {
                    openNotification('error', 'Se produjo un error al cargar las categorías.')
                    return
                }

                setCategories(response.categories)
                setReloadCategories(false)
            })
            .catch(err => {
                openNotification('error', 'Error en el servidor.')
            })
    }

    const getTasksWithoutPagination = () => {
        const token = getAccessTokenApi()

        user && indexTasksWithoutPaginationApi(token, user.id)
            .then(response => {
                if ((response?.code !== 200 && response?.code !== 404) || !response.code) {
                    // openNotification('error', 'Se produjo un error al cargar las tareas.')
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
            <AddEditFormTask
                task={null}
                categories={categories}
                setIsVisibleModal={setIsVisibleModal}
                setReloadTasks={setReloadTasks}
                setReloadCategories={setReloadCategories}
            />
        )
    }

    const editTask = (task, autoFocus) => {
        setModalWidth('500px')
        verifyExpireTokenInWeb(setExpireToken)
        setIsVisibleModal(true)
        setModalTitle('Actualizar tarea')
        setModalContent(
            <AddEditFormTask
                task={task}
                autoFocus={autoFocus ? autoFocus : null}
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
                                openNotification('info', 'Lo siento, debes recargar la página e intentarlo de nuevo.')
                                return
                            }
                            if (response?.code !== 200 || !response.code) {
                                openNotification('error', 'Se produjo un error al eliminar.')
                                return
                            }

                            openNotification('success', response.message)
                            setReloadTasks(true)
                        })
                        .catch(err => {
                            openNotification('error', 'Se produjo un error inesperado.')
                        })
                }

                if (task.category) {
                    updateCategoryAndTasks(
                        token,
                        task._id,
                        null,
                        task.category,
                        false,
                        () => { }
                    )
                    remove()
                } else {
                    remove()
                }
            }
        })
    }

    const updateCheckTask = (e, task) => {
        const { checked } = e.target
        const dateComplete = !checked ? null : new Date()
        const token = getAccessTokenApi()

        updateTaskApi(token, task._id, { checked, dateComplete })
            .then(response => {
                if (/token/g.test(response.message)) {
                    openNotification('info', 'Lo siento, debes recargar la página e intentarlo de nuevo.')
                    return
                }
                if (response?.code !== 200 || !response.code) {
                    openNotification('error', 'Se produjo un error al actualizar.')
                    return
                }

                let message = checked
                    ? 'La tarea ha sido completada.'
                    : 'Marcaste la tarea como incompleta.'
                openNotification('success', message)

                setReloadTasks(true)
            })
    }

    const chooseActionForCategory = (task) => {
        if (task.category) {
            editCategory(task.category)
            return
        }
        setModalWidth('500px')
        setIsVisibleModal(true)
        setModalTitle('Deseo...')
        setModalContent(
            <>
                <Button
                    type='primary'
                    className='btn-submit'
                    onClick={() => addCategory(task)}
                >
                    Crear una nueva categoría
                </Button>,
                <Button
                    type='primary'
                    className='btn-submit'
                    onClick={() => {
                        editTask(task, 'autoFocusSelectCategories')
                    }}
                >
                    Elegir una categoría existente
                </Button>
            </>
        )
    }

    const addCategory = (task) => {
        let taskDefault = `${task._id}-${task.category ? task.category : 'no_category'}-${task.title}`
        setModalWidth('700px')

        verifyExpireTokenInWeb(setExpireToken)
        setIsVisibleModal(true)
        setModalTitle('Crear categoría')
        setModalContent(
            <AddEditFormCategory
                category={null}
                tasks={tasksArray}
                taskDefault={taskDefault}
                categories={categories}
                setReloadCategories={setReloadCategories}
                setReloadTasks={setReloadTasks}
                setIsVisibleModal={setIsVisibleModal}
            />
        )
    }

    const editCategory = (category) => {
        const categoryObj = categories.filter(item => item._id === category)[0]
        setModalWidth('700px')

        verifyExpireTokenInWeb(setExpireToken)
        setIsVisibleModal(true)
        setModalTitle('Editar categoría')
        setModalContent(
            <AddEditFormCategory
                category={categoryObj}
                tasks={tasksArray}
                categories={categories}
                setReloadCategories={setReloadCategories}
                setReloadTasks={setReloadTasks}
                setIsVisibleModal={setIsVisibleModal}
            />
        )
    }

    const deleteAllTasks = (typeTasks) => {
        let array = []

        if (typeTasks === 'checked') {
            array = tasksArray.filter(item => item.checked)

            confirm({
                title: 'Eliminar las tareas completadas',
                content: '¿Quieres eliminar todas las tareas completadas?',
                okText: 'Eliminar',
                okType: 'danger',
                cancelText: 'Cancelar',
                onOk() {
                    const nextFunction = () => {
                        setReloadTasks(true)
                    }

                    deleteManyTasks(
                        array,
                        'Se eliminaron las tareas completadas.',
                        nextFunction
                    )
                }
            })
        }

        if (!typeTasks) {
            array = tasksArray

            confirm({
                title: 'Eliminar todas las tareas',
                content: '¿Quieres eliminar todas tus tareas?',
                okText: 'Eliminar',
                okType: 'danger',
                cancelText: 'Cancelar',
                onOk() {
                    confirm({
                        title: 'Confirma la eliminación',
                        content: 'Por favor, confirma una vez más que deseas eliminar todas tus tareas.',
                        okText: 'Eliminar todas',
                        okType: 'danger',
                        cancelText: 'Cancelar',
                        onOk() {
                            const nextFunction = () => {
                                setReloadTasks(true)
                            }

                            deleteManyTasks(
                                array,
                                'Se eliminaron todas tus tareas.',
                                nextFunction
                            )
                        }
                    })
                }
            })
        }
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
                    deleteAllTasks={deleteAllTasks}
                />
                <TasksList
                    tasks={tasks ? tasks : []}
                    editTask={editTask}
                    deleteTask={deleteTask}
                    updateCheckTask={updateCheckTask}
                    categories={categories}
                    chooseActionForCategory={chooseActionForCategory}
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
