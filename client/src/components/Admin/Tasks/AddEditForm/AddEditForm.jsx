import React, { useState, useEffect } from 'react'
import FormTask from '../FormTask'
import { notification } from 'antd'
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

    const getTitleCapitalize = (title) => {
        let titleTask = []
        let titleArray = title.split('')
        let letter = title[0].toUpperCase()
        let rest = titleArray.splice(1)
        titleTask.push(letter)
        titleTask.push(rest)
        return titleTask.flat().join('')
    }

    const addTask = () => {
        const { title, dateDown, dateUp, dateUpdate, category } = taskData

        if (!title) {
            notification['warning']({ message: 'El título es requerido.' })
            return
        }

        const data = {
            title: getTitleCapitalize(title),
            author: user.id,
            checked: false,
            dateUp: dateUp ? dateUp : new Date().toISOString(),
            dateDown: dateDown ? dateDown : false,
            dateUpdate: dateUpdate ? dateUpdate : new Date().toISOString(),
            category: category ? category : null,
            orderByDateDown: dateDown ? dateDown : moment().add(10, 'years')
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
                    notification['error']({ message: 'Se produjo un error al crear la tarea.' })
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
                notification['error']({ message: 'Se produjo un error al crear la tarea.' })
            })
    }

    const updateTask = () => {
        const token = getAccessTokenApi()
        let removeCategory = false
        let data = {
            ...taskData,
            title: getTitleCapitalize(taskData.title),
            orderByDateDown: taskData.dateDown ? taskData.dateDown : moment().add(10, 'years'),
            dateUpdate: new Date().toISOString()
        }

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

        console.log(task)
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
                    notification['error']({ message: 'Se produjo un error al actualizar la tarea.' })
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

                if (oldCategoryId !== data.category) {
                    updateCategoryAndTasks(
                        token,
                        task._id,
                        data.category,
                        oldCategoryId,
                        true,
                        finish
                    )
                }
                finish()
            })
            .catch(err => {
                notification['error']({ message: 'Se produjo un error al actualizar la tarea.' })
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

export default AddEditForm
