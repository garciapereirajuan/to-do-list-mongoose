import React, { useState, useEffect } from 'react'
import { Form, Input, Select, Button, notification } from 'antd'
import useAuth from '../../../../hooks/useAuth'
import { getAccessTokenApi } from '../../../../api/auth'
import { addCategoryAndTasksApi } from '../../../../api/categoryAndTasks'
import { createCategoryApi } from '../../../../api/category'
import colors from '../../../../utils/colors'
import { updateCategoryAndTasks } from '../../../../utils/categoryAndTasksManager'
import { FontSizeOutlined, BgColorsOutlined, UnorderedListOutlined } from '@ant-design/icons'

import './AddEditForm.scss'

const AddEditForm = ({ category, tasks, categories, setIsVisibleModal, setReloadCategories, setReloadTasks }) => {
    const [categoryData, setCategoryData] = useState({})
    const [tasksArray, setTasksArray] = useState([])
    const { user } = useAuth()

    useEffect(() => {
        if (!category) {
            setCategoryData({})
        }
    }, [category])

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
                if ((response?.code !== 200 && response?.code !== 404) || !response.code) {
                    notification['error']({ message: response.message })
                    console.log('Error al crear la categoría: ' + JSON.stringify(response))
                    return
                }

                const newCategoryId = response.category._id
                const tasks = [...tasksArray]

                const finish = () => {
                    setReloadTasks(true)
                    setReloadCategories(true)
                    setIsVisibleModal(false)
                    setCategoryData({})
                }

                updateCategoryAndTasks(
                    token, tasks, newCategoryId, null, finish)
            })
            .catch(err => {
                notification['error']({ message: 'Se produjo un error al crear la categoría.' })
                console.log('Error al crear la categoría: ' + err)
            })
    }
    const editCategory = () => { }

    return (
        <FormCategory
            categoryData={categoryData}
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
        setCategoryData,
        addCategory,
        editCategory,
        tasks,
        categories,
        tasksArray,
        setTasksArray
    } = props
    const { Option } = Select

    const optionTemplate = (color) => {
        return (
            <Option value={color} key={color}>
                <div style={{ backgroundColor: color }} className='add-edit-form-categories__div-color'>
                    <div className='add-edit-form-categories__div-color__description'>
                        {color}
                    </div>
                </div>
            </Option>
        )
    }

    const getColors = () => {
        const colorOptionItem = [
            <Option value={undefined} key={'0'}>
                <div style={{ backgroundColor: '#fff' }} className='add-edit-form-categories__div-color'>
                    <div className='add-edit-form-categories__div-color__description'>
                        Ninguno
                    </div>
                </div>
            </Option>
        ]

        return colors.map(item => {
            if (item.autumn) {
                item.autumn.map(color => (
                    colorOptionItem.push(optionTemplate(color)
                    )))
            }
            if (item.macaron) {
                item.macaron.map(color => (
                    colorOptionItem.push(optionTemplate(color)
                    )))
            }
            if (item.contrastingOrange)
                item.contrastingOrange.forEach(color => (
                    colorOptionItem.push(optionTemplate(color)
                    )))

            return colorOptionItem;
        })
    }

    const getCategoryById = (categoryId) => {
        const element = categories.filter(item => item._id === categoryId)
        return element[0]
    }

    const getTasks = () => {
        const filteredTasks = tasks.filter(task => !tasksArray.includes(task.title))

        return filteredTasks.map(item => {
            const category = item.category && getCategoryById(item.category)
            const borderColor = category?.color ? category.color : '#dddddd'

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
                    value={categoryData.color !== '0' ? categoryData.color : null}
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
                    Crear categoría
                </Button>
            </Form.Item>
        </Form >
    )
}

export default AddEditForm
