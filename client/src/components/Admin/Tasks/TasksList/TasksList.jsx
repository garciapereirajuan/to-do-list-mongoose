import React, { useEffect, useState } from 'react'
import { List, Button, Checkbox } from 'antd'
import { DeleteFilled, EditFilled, ArrowUpOutlined, ClockCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
import 'moment/locale/es'

import './TasksList.scss'

const TasksList = ({ tasks, editTask, deleteTask, updateCheckTask, categories, editCategory }) => {
    const [listItems, setListItems] = useState([])
    const { docs } = tasks

    useEffect(() => {
        const listItemsArray = []

        docs && docs.forEach(task => {
            listItemsArray.push(
                <TaskItem
                    key={task._id}
                    task={task}
                    editTask={editTask}
                    editCategory={editCategory}
                    deleteTask={deleteTask}
                    updateCheckTask={updateCheckTask}
                    categories={categories}
                />
            )
        })

        setListItems(listItemsArray)
    }, [docs, editTask, deleteTask, updateCheckTask, categories])

    return (
        <div className='tasks-list__item'>
            <List className='List'>
                {
                    listItems.map(task => task)
                }
            </List>
        </div>
    )
}

const TaskItem = ({ task, editTask, editCategory, deleteTask, updateCheckTask, categories }) => {
    const [checkedTask, setCheckedTask] = useState(task.checked)

    // const formatDate = (dateTask) => {
    //     let date = moment(dateTask).format('MMMM Do YYYY').split(' ')
    //     let day = date[1].replace(/[^0-9]/g, '')
    //     let month = date[0].split('')
    //     let letter = month[0].toUpperCase()
    //     month.shift()
    //     month.unshift(letter)
    //     month = month.join('')
    //     let year = date[2]

    //     return `${day} de ${month} de ${year}`
    // }

    const formatDate = (dateTask) => {
        return moment(dateTask).calendar()
    }

    const getStyles = (color) => ({
        boxShadow: `
            -2px 0px 4px .5px rgba(0,0,0,.5), 
            -2px 0px 4px .5px ${color ? color : 'rgb(66, 66, 66)'}
        `,
        border: `1px solid ${color ? color : 'rgb(66, 66, 66)'}`
    })

    let title = ''
    let titleProp = ''
    let color = null
    let disabled = false

    const getCategoryById = (categoryId) => {
        if (categories) {
            categories.forEach(item => {
                if (item._id === categoryId) {
                    title = item.title
                    titleProp = item.title
                    color = item.color
                }
            })
        }

        if (title.length > 18) {
            title = title.split('').splice(0, 18).join('') + '...'
        }

        if (title === '') {
            color = 'rgba(90,90,90)'
            title = 'Sin categoría'
            titleProp = 'Sin categoría'
            disabled = true
        }

        // return { title, color }
    }

    const getButtons = () => {
        getCategoryById(task.category)

        const btnCategory = (
            < Button
                onClick={(e) => editCategory(task.category)}
                className='task__btn-category'
                title={titleProp}
                disabled={disabled}
                style={{
                    background: 'rgba(61,61,61)',
                    borderColor: color ? color : 'rgba(200,200,200)',
                    boxShadow: getStyles(color).boxShadow,
                    color: disabled && 'rgba(255,255,255,.5)'
                }}
            >
                {title}
            </Button>
        )
        const btnDelete = (
            <Button type='danger' onClick={() => deleteTask(task)}>
                <DeleteFilled />
            </Button>
        )
        const btnEdit = (
            <Button type='primary' onClick={() => editTask(task)}>
                <EditFilled />
            </Button>
        )

        if (task.checked) {
            return ([
                btnCategory,
                btnDelete
            ])
        }

        return ([
            btnCategory,
            btnEdit,
            btnDelete
        ])
    }

    const getDescriptionDateDown = () => {
        if (!task.dateDown) {
            return (
                <span className='task__description-date-down__no-date'>
                    Sin fecha de finalización
                </span>
            )
        }

        if (moment(task.dateDown).add(1, 'days').format() > moment().format()) {
            return (
                <span className='task__description-date-down__date-down-ok'>
                    Finaliza {moment(task.dateDown).fromNow()}
                </span>
            )

        } else {
            return (
                <span className='task__description-date-down__date-down-not-ok'>
                    Finalizada {moment(task.dateDown).fromNow()}
                </span>
            )
        }
        // if (task.dateDown < moment())

    }

    return (
        <List.Item
            className='task'
            key={task._id}
            actions={getButtons()}
        >
            <Checkbox
                checked={checkedTask}
                onChange={(e) => {
                    setCheckedTask(e.target.checked)
                    setTimeout(() => { updateCheckTask(e, task) }, 500)
                }}
            />
            <List.Item.Meta
                title={task.title}
                description={
                    <>
                        <span className='task__description-date-up'>
                            <ArrowUpOutlined />
                            Creada: {formatDate(task.dateUp)}
                        </span>
                        <span className='task__description-date-down'>
                            <ClockCircleOutlined />
                            {getDescriptionDateDown()}
                        </span>

                    </>
                }
            />
        </List.Item >
    )
}

export default TasksList
