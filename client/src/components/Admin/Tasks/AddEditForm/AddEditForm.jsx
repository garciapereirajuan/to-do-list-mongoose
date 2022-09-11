import React, { useState, useEffect } from 'react'
import { Form, Input, Button, DatePicker, Select, notification, message } from 'antd'
import { FontSizeOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { createTaskApi, updateTaskApi } from '../../../../api/task'
import { getAccessTokenApi } from '../../../../api/auth'
import useAuth from '../../../../hooks/useAuth'
import moment from 'moment'
import 'moment/locale/es'

import './AddEditForm.scss'

const AddEditForm = ({ task, newOrder, categories, setIsVisibleModal, setReloadTasks }) => {
    const [taskData, setTaskData] = useState({})
    const { user } = useAuth()
    const { Option } = Select

    useEffect(() => {
        if (task) {
            setTaskData(task)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [task])

    const addTask = () => {

        const { title, dateDown, dateUp, dateUpdate, category } = taskData

        if (!title) {
            notification['warning']({
                message: 'El título es requerido.'
            })
            return
        }

        const token = getAccessTokenApi()

        const data = {
            title: title,
            author: user.id,
            checked: false,
            dateUp: dateUp ? dateUp : new Date().toISOString(),
            dateDown: dateDown ? dateDown : null,
            dateUpdate: dateUpdate ? dateUpdate : new Date().toISOString(),
            order: parseInt(newOrder)
        }

        user && createTaskApi(token, data)
            .then(response => {
                if (response?.code !== 200) {
                    notification['error']({ message: response.message })
                    return
                }
                if (!response.code) {
                    notification['error']({ message: 'Se produjo un error inesperado.' })
                    return
                }
                notification['success']({ message: response.message })
                setIsVisibleModal(false)
                setReloadTasks(true)
                setTaskData({})
            })
            .catch(err => {
                notification['error']({ message: 'Se produjo un error inesperado.' })
            })
    }

    const updateTask = () => {
        const { title, dateDown, category } = taskData

        const token = getAccessTokenApi()

        task && updateTaskApi(token, task._id, taskData)
            .then(response => {
                if (response?.code !== 200) {
                    notification['error']({ message: response.message })
                }
                if (!response) {
                    notification['error']({ message: 'Se produjo un error inesperado.' })
                }

                notification['success']({ message: response.message })
                setIsVisibleModal(false)
                setReloadTasks(true)
                setTaskData({})
            })
            .catch(err => {
                notification['error']({ message: 'Se produjo un error inesperado.' })
            })
    }

    return (
        <Form onFinish={task ? updateTask : addTask}>
            <Form.Item>
                <Input
                    prefix={<FontSizeOutlined />}
                    placeholder='Nueva tarea'
                    value={taskData.title}
                    maxLength={70}
                    onChange={e => setTaskData({ ...taskData, title: e.target.value })}
                />
            </Form.Item>
            <Form.Item>
                <DatePicker
                    format="DD-MM-YYYY"
                    placeholder='Fecha de finalización (opcional)'
                    value={taskData.dateDown && moment(taskData.dateDown)}
                    onChange={(e, value) => setTaskData({
                        ...taskData,
                        dateDown: moment(value, 'DD-MM-YYYY HH:mm:ss').toISOString()
                    })}
                />
            </Form.Item>
            <Form.Item>
                <Select
                    placeholder={categories ? 'Selecciona una categoría (opcional)' : 'Selecciona una categoría (aún no tienes categorías)'}
                    disabled={categories ? false : true}
                    value={taskData.category}
                    onChange={e => setTaskData({ ...taskData, category: e })}
                >
                    <Option value='category-1'>Category 1</Option>
                    <Option value='category-2'>Category 2</Option>
                    <Option value='category-3'>Category 3</Option>
                </Select>
            </Form.Item>

            <Button type='primary' htmlType='submit' className='btn-submit'>
                {
                    task ? 'Actualizar tarea' : 'Nueva tarea'
                }
            </Button>
        </Form >
    )
}

export default AddEditForm
