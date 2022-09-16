import React, { useState, useEffect } from 'react'
import { Form, Input, Select, Button, notification } from 'antd'
import useAuth from '../../../../hooks/useAuth'
import { getAccessTokenApi } from '../../../../api/auth'
import { createCategoryApi, updateCategoryApi } from '../../../../api/category'
import colors from '../../../../utils/colors'
import { updateCategoryAndTasks } from '../../../../utils/categoryAndTasksManager'
import { FontSizeOutlined, BgColorsOutlined, UnorderedListOutlined } from '@ant-design/icons'

import './AddEditForm.scss'

const AddEditForm = (props) => {
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
                const keys = category.tasks.map(item => {
                    return `${item._id}-${item.category ? item.category : 'no_category'}-${item.title}`
                })
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
            const usedColorsArray = categories.map(item => item.color).filter(Boolean)
            setUsedColors(usedColorsArray)
        }
    }, [categories])

    const addCategory = () => {
        const token = getAccessTokenApi()

        if (!categoryData.title) {
            notification['error']({
                message: 'Escribe el título de la categoría.'
            })
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
                    notification['info']({
                        message: 'Lo siento, debes recargar la página e intentarlo de nuevo.',
                        duration: 20,
                    })
                    return
                }
                if ((response?.code !== 200) || !response.code) {
                    notification['error']({ message: response.message })
                    console.log('Error al crear la categoría: ' + JSON.stringify(response))
                    return
                }

                notification['success']({ message: 'Categoría creada correctamente.' })
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
                notification['error']({ message: 'Se produjo un error al crear la categoría.' })
                console.log('Error al crear la categoría: ' + err)
            })
    }

    const editCategory = () => {
        const token = getAccessTokenApi()

        if (!categoryData.title) {
            notification['error']({ message: 'Escribe el título de la categoría.' })
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

            if (tasksArray.length === category.tasks.length
                && category.tasks.length === changes.length
            ) {
                console.log('Entra en false')
                return false
            } else {
                console.log('Entra en true')
                console.log('TasksArray', category.tasks)

                return true
            }
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

            // noRemove = category.tasks.filter(subitem => {
            //     return currentTasks.includes(subitem._id)
            // })

            category.tasks = [...noRemove]

            console.log(category.tasks)

            return remove
        }

        user && updateCategoryApi(token, category._id, data)
            .then(response => {
                if (/token/g.test(response.message)) {
                    notification['info']({
                        message: 'Lo siento, debes recargar la página e intentarlo de nuevo.',
                        duration: 20,
                    })
                    return
                }
                if ((response?.code !== 200 && response?.code !== 404) || !response.code) {
                    notification['error']({ message: response.message })
                    console.log('Error al crear la categoría: ' + JSON.stringify(response))
                    return
                }
                if (response?.code === 404) {
                    notification['error']({ message: response.message })
                    return
                }

                notification['success']({ message: 'Categoría actualizada correctamente.' })

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

const FormCategory = (props) => {
    const {
        category,
        categoryData,
        usedColors,
        setCategoryData,
        addCategory,
        editCategory,
        tasks,
        categories,
        tasksArray,
        setTasksArray
    } = props
    const { Option } = Select

    // const [allColors, setAllColors] = useState({})

    const optionTemplate = (color) => {
        const blockColor = usedColors.includes(color)

        return (
            <Option value={color} key={color}>
                <div style={{ backgroundColor: color }} className='add-edit-form-categories__div-color'>
                    <div className='add-edit-form-categories__div-color__description'>
                        {color}
                    </div>
                    <div
                        className='add-edit-form-categories__div-color__block-color'
                        style={{ display: blockColor ? 'flex !important' : 'none' }}
                    >
                        Usado
                    </div>
                </div>
            </Option>
        )
    }

    const getColors = () => {
        const colorOptionItem = [
            <Option value={'0'} key={'0'}>
                <div style={{ backgroundColor: '#fff' }} className='add-edit-form-categories__div-color'>
                    <div className='add-edit-form-categories__div-color__description'>
                        Ninguno
                    </div>
                </div>
            </Option>
        ]

        colors.forEach(item =>
            colorOptionItem.push(optionTemplate(item))
        )

        return colorOptionItem
    }


    const getCategoryById = (categoryId) => {
        const element = categories.filter(item => item._id === categoryId)
        return element[0]
    }

    const getTasks = () => {
        const filteredTasks = tasks.filter(task => !tasksArray.includes(task.title))

        return filteredTasks.map(item => {
            const category = item.category && getCategoryById(item.category)
            const borderColor = category?.color ? category.color : "rgb(66, 66, 66)"

            return (
                <Option key={`${item._id}-${item.category ? item.category : 'no_category'}-${item.title}`}>
                    {
                        !item.category
                            ? `${item.title}`
                            : (
                                <div className='add-edit-form-categories__select-tasks'>
                                    <span>{item.title}</span>
                                    <span
                                        className='add-edit-form-categories__select-tasks__category'
                                        style={{ borderColor: borderColor }}
                                    >
                                        {`(incluida en ${category.title})`}
                                    </span>
                                </div>
                            )
                    }
                </Option>
            )
        })
    }

    return (
        <Form className='add-edit-form-categories' onFinish={category ? editCategory : addCategory} >
            <Form.Item>
                <Input
                    prefix={<FontSizeOutlined />}
                    placeholder='Nombre de la categoría'
                    value={categoryData.title}
                    onChange={e => setCategoryData({ ...categoryData, title: e.target.value })}
                />
            </Form.Item>
            <Form.Item>
                <Select
                    value={categoryData.color}
                    onChange={e => setCategoryData({ ...categoryData, color: e })}
                    placeholder={
                        <>
                            <span style={{ fontSize: '18px', marginLeft: '-1px' }}>
                                <BgColorsOutlined />
                            </span>
                            <span style={{ marginLeft: '4px' }}>
                                Color de la categoría
                            </span>
                        </>
                    }
                >
                    {getColors().flat(1)}
                </Select>
            </Form.Item>
            <Form.Item>
                <Select
                    mode='multiple'
                    value={tasksArray}
                    onChange={setTasksArray}
                    placement='topRight'
                    placeholder={
                        <>
                            <span style={{ fontSize: '18px', marginLeft: '-1px' }}>
                                <UnorderedListOutlined />
                            </span>
                            <span style={{ position: 'relative', marginLeft: '4px', bottom: '2px' }}>
                                Agrega tareas a tu categoría
                            </span>
                        </>
                    }
                >
                    {getTasks()}
                </Select>
            </Form.Item>
            <Form.Item>
                <Button type='primary' htmlType='submit' className='btn-submit'>
                    {
                        !category
                            ? "Crear categoría"
                            : "Actualizar categoría"
                    }
                </Button>
            </Form.Item>
        </Form >
    )
}

export default AddEditForm
