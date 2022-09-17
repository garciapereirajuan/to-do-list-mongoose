import React, { useEffect, useState } from 'react'
import { List, Button, Checkbox } from 'antd'
import { DeleteFilled, EditFilled, ArrowUpOutlined, ClockCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
import 'moment/locale/es'

import './TasksList.scss'

const TasksList = ({ tasks, editTask, deleteTask, updateCheckTask, categories }) => {
    const [listItems, setListItems] = useState([])
    const [titleCategory, setTitleCategory] = useState(null)
    const [titlePropCategory, setTitlePropCategory] = useState('')
    const { docs } = tasks

    useEffect(() => {
        const listItemsArray = []

        docs && docs.forEach(task => {
            listItemsArray.push(
                <TaskItem
                    key={task._id}
                    task={task}
                    editTask={editTask}
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

const TaskItem = ({ task, editTask, deleteTask, updateCheckTask, categories }) => {
    const [checked, setChecked] = useState(task.checked)

    const formatDate = (dateTask) => {
        let date = moment(dateTask).format('MMMM Do YYYY').split(' ')
        let day = date[1].replace(/[^0-9]/g, '')
        let month = date[0].split('')
        let letter = month[0].toUpperCase()
        month.shift()
        month.unshift(letter)
        month = month.join('')
        let year = date[2]

        return `${day} de ${month} de ${year}`
    }

    const getCategoryById = (categoryId) => {
        let title = categories && categories.map(item => {
            if (item._id === categoryId) {
                console.log(item.title)
                return item.title
            }
        })

        return title[0]
    }

    return (
        <List.Item
            className='task'
            key={task._id}
            actions={[
                <Button type='primary' onClick={() => editTask(task)}>
                    <EditFilled />
                </Button>,
                <Button type='danger' onClick={() => deleteTask(task)}>
                    <DeleteFilled />
                </Button>
            ]}
        >
            <Checkbox
                checked={checked}
                onChange={(e) => {
                    setChecked(e.target.checked)
                    setTimeout(() => { updateCheckTask(e, task) }, 500)
                }}
            />
            <List.Item.Meta
                title={task.title}
                description={
                    <>
                        <span className='description-date-up'>
                            <ArrowUpOutlined />
                            Creada el {formatDate(task.dateUp)}
                        </span>
                        <span className='description-date-down'>
                            <ClockCircleOutlined />
                            {
                                task.dateDown
                                    ? `Finaliza ${moment(task.dateDown).fromNow()}`
                                    : (<span className='no-date'>
                                        Sin fecha de finalización
                                    </span>)
                            }
                        </span>
                    </>
                }
            />
            {
                <Button>
                    {
                        getCategoryById(task.category)
                    }
                </Button>
            }
        </List.Item>
    )
}

export default TasksList
