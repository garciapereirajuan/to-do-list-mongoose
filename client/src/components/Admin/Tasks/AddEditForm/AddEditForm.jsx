import React, { useState, useEffect } from 'react'
import { Form, Input, Button, DatePicker, Select, notification, message } from 'antd'
import { FontSizeOutlined } from '@ant-design/icons'
import { getAccessTokenApi } from '../../../../api/auth'
import { createTaskApi, updateTaskApi } from '../../../../api/task'
import { updateCategoryAndTasks } from '../../../../utils/categoryAndTasksManager'
import useAuth from '../../../../hooks/useAuth'
import moment from 'moment'
import 'moment/locale/es'

import './AddEditForm.scss'

const AddEditForm = (props) => {
    const {
        task, newOrder, categories, setIsVisibleModal,
        setReloadTasks, setReloadCategories
    } = props

    const [taskData, setTaskData] = useState({})
    const [oldCategoryId, setOldCategoryId] = useState(null)
    const { user } = useAuth()

    useEffect(() => {
        if (task) {
            setTaskData(task)
            setOldCategoryId(task.category)
        }
        if (!task) {
            setTaskData({})
            setOldCategoryId(null)
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

        const data = {
            title: title,
            author: user.id,
            checked: false,
            dateUp: dateUp ? dateUp : new Date().toISOString(),
            dateDown: dateDown ? dateDown : null,
            dateUpdate: dateUpdate ? dateUpdate : new Date().toISOString(),
            category: category ? category : null,
            order: parseInt(newOrder)
        }

        const token = getAccessTokenApi()

        user && createTaskApi(token, data)
            .then(response => {
                if (/token/g.test(response.message)) {
                    notification['info']({
                        message: 'Lo siento, debes recargar la página e intentarlo de nuevo.',
                        duration: 20,
                    })
                    return
                }
                if (response?.code !== 200) {
                    notification['error']({ message: response.message })
                    return
                }
                if (!response.code) {
                    notification['error']({ message: 'Se produjo un error inesperado.' })
                    return
                }
                notification['success']({ message: response.message })

                const finish = () => {
                    setIsVisibleModal(false)
                    setReloadTasks(true)
                    setReloadCategories(true)
                    setTaskData({})
                }

                if (category) {
                    updateCategoryAndTasks(
                        token,
                        response.task._id,
                        category,
                        null,
                        true,
                        finish
                    )
                } else {
                    finish()
                }
            })
            .catch(err => {
                notification['error']({ message: 'Se produjo un error inesperado.' })
            })
    }

    const updateTask = () => {
        const token = getAccessTokenApi()

        let data = { ...taskData }

        let removeCategory = false

        if (data.category === '0' && !oldCategoryId) {
            data.category = null
        }

        if (data.category === '0' && oldCategoryId) {
            // no quiero que actualice la tarea con category: null
            // si no, que lo deje como estaba y que ese proceso lo haga
            // cuando llama a la func updateCategoryAndTasks (línea 156)...
            // para evitar errores en dicha función

            data.category = oldCategoryId
            removeCategory = true
        }

        console.log('Primero', oldCategoryId, data.category)

        task && updateTaskApi(token, task._id, data)
            .then(response => {
                if (/token/g.test(response.message)) {
                    notification['info']({
                        message: 'Lo siento, debes recargar la página e intentarlo de nuevo.',
                        duration: 20,
                    })
                    return
                }
                if (response?.code !== 200) {
                    notification['error']({ message: response.message })
                    return
                }
                if (!response) {
                    notification['error']({ message: 'Se produjo un error inesperado.' })
                    return
                }

                notification['success']({ message: response.message })

                if (removeCategory) {
                    data.category = null
                }

                const finish = () => {
                    setIsVisibleModal(false)
                    setReloadTasks(true)
                    setReloadCategories(true)
                    setOldCategoryId(null)
                    setTaskData({})
                }

                console.log('Segundo', oldCategoryId, data.category)

                if (oldCategoryId !== data.category) {
                    updateCategoryAndTasks(
                        token,
                        task._id,
                        data.category,
                        oldCategoryId,
                        true,
                        finish
                    )
                    return
                }

                finish()

            })
            .catch(err => {
                notification['error']({ message: 'Se produjo un error inesperado.' })
            })
    }

    return (
        <FormTask
            taskData={taskData}
            setTaskData={setTaskData}
            categories={categories}
            task={task}
            updateTask={updateTask}
            addTask={addTask}
        />
    )

}

const FormTask = ({ taskData, setTaskData, categories, task, updateTask, addTask }) => {
    const { Option } = Select

    const getOptions = () => {
        const categoriesOption = [
            <Option value={undefined} key={'0'}>Ninguna</Option>
        ]
        categories.forEach(category => {
            categoriesOption.push(
                <Option
                    value={category.title}
                    key={category.id}
                >
                    {category.title}
                </Option>
            )
        })
        return categoriesOption
    }

    const getTitleCategory = (category) => {
        let element = categories.filter(item => {
            return item._id === category
        })
        return element.length !== 0 ? element[0].title : category
    }

    const getCategoryByTitle = (category) => {
        const element = categories.filter(item => {
            return item.title === category
        })
        return element.length !== 0 ? element[0]._id : category
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
                    value={taskData.category && getTitleCategory(taskData.category)}
                    onChange={e => {
                        setTaskData({ ...taskData, category: getCategoryByTitle(e) })
                    }}
                >
                    {
                        categories
                            ? getOptions(categories)
                            : null
                    }
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
