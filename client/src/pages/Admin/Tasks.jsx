import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { Row, Col, Button, Switch, Modal as ModalAntd, notification } from 'antd'
import { getAccessTokenApi } from '../../api/auth'
import { deleteTaskApi, indexTaskApi, updateTaskApi } from '../../api/task'
import TasksList from '../../components/Admin/Tasks/TasksList'
import AddEditForm from '../../components/Admin/Tasks/AddEditForm'
import Pagination from '../../components/Admin/Pagination'
import queryString from 'query-string'
import Modal from '../../components/Modal'

const Tasks = () => {
    const [tasks, setTasks] = useState(null)
    const [reloadTasks, setReloadTasks] = useState(false)
    const [isVisibleModal, setIsVisibleModal] = useState(false)
    const [modalTitle, setModalTitle] = useState('')
    const [modalContent, setModalContent] = useState(null)
    const [complete, setComplete] = useState(false)
    const { user } = useAuth()

    const { confirm } = ModalAntd

    const location = useLocation()
    const navigate = useNavigate()

    const { page = 1 } = queryString.parse(location.search)
    const limit = (window.innerHeight / 110) - 1.5

    useEffect(() => {
        getTasks()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [limit, page, reloadTasks, complete])

    const getTasks = () => {
        const token = getAccessTokenApi()

        indexTaskApi(token, page, limit, complete, user.id)
            .then(response => {
                if (response?.code !== 200) {
                    notification['warning']({ message: response.message })
                    return
                }
                if (!response.code) {
                    notification['error']({ message: 'Se produjo un error inesperado.' })
                    return
                }
                setTasks(response.tasks)
                setReloadTasks(false)
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
                newOrder={tasks.total}
                setIsVisibleModal={setIsVisibleModal}
                setReloadTasks={setReloadTasks}
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
                setIsVisibleModal={setIsVisibleModal}
                setReloadTasks={setReloadTasks}
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
                        if (response?.code !== 200) {
                            notification['error']({ message: response.message })
                            return
                        }
                        if (!response) {
                            notification['error']({ message: 'Se produjo un error inesperado.' })
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
                    notification['error']({ message: 'Se produjo un error interno, inténtalo más tarde.' })
                    return
                }

                let message = checked
                    ? 'La tarea ha sido completada.'
                    : 'Marcaste la tarea como incompleta.'
                notification['success']({ message })
                setReloadTasks()
            })

    }

    if (!tasks) {
        return null
    }

    return (
        <Row className='tasks-list'>
            <Col sm={0} md={4} />
            <Col sm={24} md={16} >
                <div className='tasks-list__header'>
                    <div className='tasks-list__header-switch'>
                        <Switch
                            defaultChecked={false}
                            onChange={e => setComplete(e)}
                        />
                        <span>
                            {
                                complete
                                    ? `Tareas completadas: ${tasks.total}`
                                    : `Tareas incompletas: ${tasks.total}`
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
                        tasks={tasks}
                        editTask={editTask}
                        deleteTask={deleteTask}
                        setReloadTasks={setReloadTasks}
                        getTasks={getTasks}
                        updateCheckTask={updateCheckTask}
                    />
                </div>
            </Col>
            {
                tasks.docs.length !== 0
                && <Pagination tasks={tasks} location={location} navigate={navigate} />
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
