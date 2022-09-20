import React, { useState, useEffect } from 'react'
import FormTask from '../FormTask'
import { openNotification } from '../../../../utils/openNotification'
import { getAccessTokenApi } from '../../../../api/auth'
import { createTaskApi, updateTaskApi } from '../../../../api/task'
import { updateCategoryAndTasks } from '../../../../utils/categoryAndTasksManager'
import useAuth from '../../../../hooks/useAuth'
import moment from 'moment'
import 'moment/locale/es'

import './AddEditFormTask.scss'

const AddEditFormTask = (props) => {
    const {
        task, autoFocus, categories, setIsVisibleModal,
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
            openNotification('warning', 'El título es requerido.')
            return
        }

        const data = {
            title: getTitleCapitalize(title),
            author: user.id,
            checked: false,
            dateUp: dateUp ? dateUp : new Date().toISOString(),
            dateDown: dateDown ? dateDown : null,
            dateUpdate: dateUpdate ? dateUpdate : new Date().toISOString(),
            category: category ? category : null,
            orderByDateDown: dateDown ? dateDown : moment().add(10, 'years')
        }

        const token = getAccessTokenApi()

        user && createTaskApi(token, data)
            .then(response => {
                if (/token/g.test(response.message)) {
                    openNotification('info', 'Lo siento, debes recargar la página e intentarlo de nuevo.')
                    return
                }
                if (response?.code !== 200) {
                    openNotification('error', response.message)
                    return
                }
                if (!response.code) {
                    openNotification('error', 'Se produjo un error al crear la tarea.')
                    return
                }

                openNotification('success', response.message)

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
                openNotification('error', 'Se produjo un error al crear la tarea.')
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
                    openNotification('info', 'Lo siento, debes recargar la página e intentarlo de nuevo.')
                    return
                }
                if (response?.code !== 200) {
                    openNotification('error', response.message)
                    return
                }
                if (!response) {
                    openNotification('error', 'Se produjo un error al actualizar la tarea.')
                    return
                }

                openNotification('success', response.message)

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
                openNotification('error', 'Se produjo un error al actualizar la tarea.')
            })
    }

    return (
        <FormTask
            taskData={taskData}
            setTaskData={setTaskData}
            categories={categories}
            task={task}
            autoFocus={autoFocus}
            updateTask={updateTask}
            addTask={addTask}
        />
    )

}

export default AddEditFormTask
