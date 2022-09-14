import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { Row, Col, Button, Switch, Modal as ModalAntd, notification } from 'antd'
import { getAccessTokenApi } from '../../api/auth'
import { deleteTaskApi, indexTasksApi, updateTaskApi } from '../../api/task'
import { indexCategoriesApi } from '../../api/category'
import TasksList from '../../components/Admin/Tasks/TasksList'
import AddEditForm from '../../components/Admin/Tasks/AddEditForm'
import Pagination from '../../components/Admin/Pagination'
import queryString from 'query-string'
import Modal from '../../components/Modal'

const Tasks = () => {
    const [tasks, setTasks] = useState(null)
    const [reloadTasks, setReloadTasks] = useState(false)
    const [categories, setCategories] = useState(null)
    const [reloadCategories, setReloadCategories] = useState(false)
    const [isVisibleModal, setIsVisibleModal] = useState(false)
    const [modalTitle, setModalTitle] = useState('')
    const [modalContent, setModalContent] = useState(null)
    const [checked, setChecked] = useState(false)
    const { user } = useAuth()

    const { confirm } = ModalAntd

    const location = useLocation()
    const navigate = useNavigate()

    const { page = 1 } = queryString.parse(location.search)
    const limit = 6
    // const limit = (window.innerHeight / 110) - 1.5

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

                deleteTaskApi(token, task._id)
                    .then(response => {
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
        })
    }

    const updateCheckTask = (e, task) => {
        const { checked } = e.target
        const token = getAccessTokenApi()

        updateTaskApi(token, task._id, { checked })
            .then(response => {
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
                                    ? `Tareas completadas: ${tasks ? tasks.total : '0'}`
                                    : `Tareas incompletas: ${tasks ? tasks.total : '0'}`
                            }
                        </span>
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
