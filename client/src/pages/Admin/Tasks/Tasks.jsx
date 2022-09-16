import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import { Row, Col, Button, Switch, Select, Modal as ModalAntd, notification } from 'antd'
import { getAccessTokenApi } from '../../../api/auth'
import { deleteTaskApi, indexTasksApi, updateTaskApi } from '../../../api/task'
import { indexCategoriesApi } from '../../../api/category'
import TasksList from '../../../components/Admin/Tasks/TasksList'
import AddEditForm from '../../../components/Admin/Tasks/AddEditForm'
import Pagination from '../../../components/Admin/Pagination'
import queryString from 'query-string'
import Modal from '../../../components/Modal'
import { verifyExpireTokenInWeb } from '../../../api/auth'
import { updateCategoryAndTasks } from '../../../utils/categoryAndTasksManager'

import './Tasks.scss'

const Tasks = ({ setExpireToken }) => {
    const [tasks, setTasks] = useState(null)
    const [reloadTasks, setReloadTasks] = useState(false)
    const [categories, setCategories] = useState(null)
    const [reloadCategories, setReloadCategories] = useState(false)
    const [isVisibleModal, setIsVisibleModal] = useState(false)
    const [modalTitle, setModalTitle] = useState('')
    const [modalContent, setModalContent] = useState(null)
    const [checked, setChecked] = useState(false)
    const { Option } = Select
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

    const getTasks = () => {
        const token = getAccessTokenApi()

        indexTasksApi(token, page, limit, checked, user.id)
            .then(response => {
                if ((response?.code !== 200 && response?.code !== 404) || !response.code) {
                    notification['error']({ message: 'Se produjo un error al cargar las tareas.' })
                    return
                }

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

    const addTask = () => {
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

                setReloadTasks()
            })
    }

    return (
        <Row className='tasks-list'>
            <Col sm={0} md={4} />
            <Col sm={24} md={16} >
                <div className='tasks-list__header'>
                    <div className='tasks-list__header-switch'>
                        <Switch
                            defaultChecked={false}
                            onChange={e => setChecked(e)}
                        />
                        <span>
                            {
                                checked
                                    ? `Hechas: ${tasks ? tasks.total : '0'}`
                                    : `Sin hacer: ${tasks ? tasks.total : '0'}`
                            }
                        </span>
                    </div>
                    <div className='tasks-list__header-select-order'>
                        <Select
                            placeholder='Ordenar por...'
                        >
                            <Option
                                value={'Por fecha de creación'}
                                key='date-up'>
                                Por fecha de creación
                            </Option>
                            <Option
                                value={'Por fecha de actualización'}
                                key='date-update'>
                                Por fecha de actualización
                            </Option>
                            <Option
                                value={'Por fecha de finalización'}
                                key='date-down'>
                                Por fecha de finalización
                            </Option>
                        </Select>
                    </div>
                    <div className='tasks-list__header-btn-new-task'>
                        <Button type='primary' onClick={addTask}>
                            Nueva tarea
                        </Button>
                    </div>
                </div>
                <div>
                    <TasksList
                        tasks={tasks ? tasks : []}
                        editTask={editTask}
                        deleteTask={deleteTask}
                        setReloadTasks={setReloadTasks}
                        getTasks={getTasks}
                        updateCheckTask={updateCheckTask}
                        categories={categories}
                    />
                </div>
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
            >
                {modalContent}
            </Modal>
            <Col sm={0} md={4} />
        </Row>
    )
}

export default Tasks
