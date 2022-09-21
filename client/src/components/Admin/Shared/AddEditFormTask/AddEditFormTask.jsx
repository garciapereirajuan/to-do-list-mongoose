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
        task, category, autoFocus, categories, setIsVisibleModal,
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

    const getCorrectDateTime = (dateDown, timeDateDown, data) => {
        if (!dateDown) {
            data.timeDateDown = null
            data.orderByDateDown = moment().add(10, 'years')
            return
        }

        if (dateDown && !timeDateDown) {
            data.timeDateDown = moment('09:00', 'HH:mm').toISOString()
        }

        if (dateDown) {
            const time = timeDateDown ? timeDateDown : data.timeDateDown

            data.dateDown = moment(moment(dateDown).toISOString())
                .add(moment(time).format('HH:mm')).toISOString()

            data.timeDateDown = data.dateDown
            data.orderByDateDown = data.dateDown
        }
    }

    const addTask = () => {
        const { title, dateDown, timeDateDown, dateUp, dateUpdate, category } = taskData

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
            timeDateDown: null,
            dateUpdate: dateUpdate ? dateUpdate : new Date().toISOString(),
            dateComplete: null,
            category: category ? category : null,
            // orderByDateDown: dateDown ? dateDown : moment().add(10, 'years')
        }

        getCorrectDateTime(dateDown, timeDateDown, data)

        console.log('data', data)
        console.log('moment(data.timeDateDown)', moment(data.timeDateDown))
        console.log('moment(data.dateDown)', moment(data.dateDown))
        // return

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
        const { dateDown, timeDateDown } = taskData
        let removeCategory = false

        let data = {
            ...taskData,
            title: getTitleCapitalize(taskData.title),
            // orderByDateDown: taskData.dateDown ? taskData.dateDown : moment().add(10, 'years'),
            dateUpdate: new Date().toISOString(),
            dateDown: dateDown ? dateDown : null,
            timeDateDown: timeDateDown ? timeDateDown : null,
        }

        if ((dateDown !== timeDateDown) || !dateDown) {
            const dateDownFormat = data.dateDown
                ? moment(
                    `${moment(data.dateDown).format('DD-MM-YYYY')} 00:00:00`,
                    'DD-MM-YYYY HH:mm:ss'
                )
                : null
            // console.log(dateDownFormat)
            // data.dateDown = dateDownFormat
            // console.log(timeDateDown._isValid)
            getCorrectDateTime(dateDownFormat, timeDateDown, data)
        }

        // console.log('moment(data.dateDown)', moment(moment(data.dateDown, 'DD-MM-YYYY').toISOString()))
        // console.log('moment(data.timeDateDown)', moment(moment(data.timeDateDown).toISOString()))

        // data.dateDown = moment(moment(dateDown).toISOString())
        //     .add(moment(timeDateDown).format('HH:mm')).toISOString()

        // data.timeDateDown = data.dateDown

        console.log(data)
        // return

        // console.log('moment(data.timeDateDown)', moment(data.timeDateDown))
        // console.log('moment(data.dateDown)', moment(data.dateDown))
        // return

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
            category={category}
            autoFocus={autoFocus}
            updateTask={updateTask}
            addTask={addTask}
        />
    )

}

export default AddEditFormTask
