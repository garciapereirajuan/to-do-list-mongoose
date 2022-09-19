import React, { useState, useEffect } from 'react'
import FormCategory from '../FormCategory'
import useAuth from '../../../../hooks/useAuth'
import { openNotification } from '../../../../utils/openNotification'
import { getAccessTokenApi } from '../../../../api/auth'
import { createCategoryApi, updateCategoryApi } from '../../../../api/category'
import { updateCategoryAndTasks } from '../../../../utils/categoryAndTasksManager'

import './AddEditForm.scss'

export const AddEditForm = (props) => {
    const {
        category, tasks, categories, setIsVisibleModal,
        setReloadCategories, setReloadTasks
    } = props

    const [categoryData, setCategoryData] = useState({})
    const [tasksArray, setTasksArray] = useState([])
    const [usedColors, setUsedColors] = useState([])
    const { user } = useAuth()

    useEffect(() => {
        if (category) {
            setCategoryData(category)
            if (category.tasks) {
                const keys = category.tasks.map(item => (
                    `${item._id}-${item.category ? item.category : 'no_category'}-${item.title}`
                ))
                setTasksArray(keys)
            }
        }
        if (!category) {
            setCategoryData({})
            setTasksArray([])
        }
    }, [category])

    useEffect(() => {
        if (categories) {
            const usedColorsArray = categories
                .map(item => item.color)
                .filter(Boolean)

            setUsedColors(usedColorsArray)
        }
    }, [categories])

    const addCategory = () => {
        const token = getAccessTokenApi()

        if (!categoryData.title) {
            openNotification('error', 'Escribe el título de la categoría.')
            return
        }

        const data = user && {
            title: categoryData.title,
            color: categoryData.color,
            dateUp: categoryData.dateUp ? categoryData.dateUp : new Date(),
            dateUpdate: new Date(),
            author: user.id,
        }

        user && createCategoryApi(token, data)
            .then(response => {
                if (/token/g.test(response.message)) {
                    openNotification('info', 'Lo siento, debes recargar la página e intentarlo de nuevo.')
                    return
                }
                if ((response?.code !== 200) || !response.code) {
                    openNotification('error', response.message)
                    console.log('Error al crear la categoría: ' + JSON.stringify(response))
                    return
                }

                openNotification('success', 'Categoría creada correctamente.')
                const newCategoryId = response.category._id

                const tasks = [...tasksArray]

                const finish = () => {
                    setReloadTasks(true)
                    setReloadCategories(true)
                    setIsVisibleModal(false)
                    setCategoryData({})
                    setTasksArray([])
                }

                if (tasks.length !== 0) {
                    updateCategoryAndTasks(token, tasks, newCategoryId, null, false, finish)
                } else {
                    finish()
                }
            })
            .catch(err => {
                openNotification('error', 'Se produjo un error al crear la categoría.')
                console.log('Error al crear la categoría: ' + err)
            })
    }

    const editCategory = () => {
        const token = getAccessTokenApi()

        if (!categoryData.title) {
            openNotification('error', 'Escribe el título de la categoría.')
        }

        let data = user && {
            _id: categoryData._id,
            title: categoryData.title,
            color: categoryData.color,
            dateUp: categoryData.dateUp ? categoryData.dateUp : new Date(),
            dateUpdate: new Date(),
            author: user.id,
        }

        let verifyNewTasks = () => {
            let changes = []

            if (tasksArray.length === 0) {
                return false
            }

            tasksArray.forEach(item => {
                item = item.split('-')[0]
                category.tasks.forEach(subitem => {
                    if (item === subitem._id) {
                        changes.push(subitem._id)
                    } else {
                        changes.push(false)
                    }
                })
            })

            changes = changes.filter(Boolean)

            return !(tasksArray.length === category.tasks.length
                && category.tasks.length === changes.length)
        }

        let verifyOldTasks = () => {
            if (category.tasks.length === 0) {
                return []
            }

            let currentTasks = tasksArray.map(item => item.split('-')[0])
            let remove = []
            let noRemove = []

            category.tasks.forEach(subitem => {
                if (!currentTasks.includes(subitem._id)) {
                    remove.push(subitem)
                }
                if (currentTasks.includes(subitem._id))
                    noRemove.push(subitem)
            })

            category.tasks = [...noRemove]
            return remove
        }

        user && updateCategoryApi(token, category._id, data)
            .then(response => {
                if (/token/g.test(response.message)) {
                    openNotification('info', 'Lo siento, debes recargar la página e intentarlo de nuevo.')
                    return
                }
                if ((response?.code !== 200 && response?.code !== 404) || !response.code) {
                    openNotification('error', response.message)
                    console.log('Error al crear la categoría: ' + JSON.stringify(response))
                    return
                }
                if (response?.code === 404) {
                    openNotification('error', response.message)
                    return
                }

                openNotification('success', 'Categoría actualizada correctamente.')

                const finish = () => {
                    setReloadTasks(true)
                    setReloadCategories(true)
                    setIsVisibleModal(false)
                    setCategoryData({})
                    setTasksArray([])
                }

                const oldTasks = verifyOldTasks()

                if (oldTasks.length !== 0) {
                    const oldCategoryId = category._id
                    const tasks = oldTasks
                    updateCategoryAndTasks(token, tasks, null, oldCategoryId, false, finish)
                }

                if (verifyNewTasks()) {
                    const newCategoryId = category._id
                    const tasks = [...tasksArray]

                    updateCategoryAndTasks(token, tasks, newCategoryId, null, false, finish)
                    return
                }

                finish()
            })
    }

    return (
        <FormCategory
            category={category}
            categoryData={categoryData}
            usedColors={usedColors}
            setCategoryData={setCategoryData}
            addCategory={addCategory}
            editCategory={editCategory}
            tasks={tasks}
            categories={categories}
            tasksArray={tasksArray}
            setTasksArray={setTasksArray}
        />
    )
}

export default AddEditForm
