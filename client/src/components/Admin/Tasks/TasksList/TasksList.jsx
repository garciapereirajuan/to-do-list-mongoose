import React, { useEffect, useState } from 'react'
import { List, Button, Checkbox } from 'antd'
import DragSortableList from 'react-drag-sortable'
import { DeleteOutlined, EditOutlined, ArrowUpOutlined, ClockCircleOutlined, ConsoleSqlOutlined } from '@ant-design/icons'
import useAuth from '../../../../hooks/useAuth'
import { getAccessTokenApi } from '../../../../api/auth'
import { updateTaskApi } from '../../../../api/task'
import { updateUserApi } from '../../../../api/user'
import moment from 'moment'
import 'moment/locale/es'

import './TasksList.scss'

const TasksList = ({ tasks, editTask, deleteTask, getTasks, updateCheckTask }) => {
    const [listItems, setListItems] = useState([])
    const { user } = useAuth()

    const { docs } = tasks

    useEffect(() => {
        const listItemsArray = []

        docs && docs.forEach(task => {
            listItemsArray.push({
                content: (
                    <TaskItem
                        task={task}
                        editTask={editTask}
                        deleteTask={deleteTask}
                        updateCheckTask={updateCheckTask}
                    />
                )
            })
        })

        setListItems(listItemsArray)
    }, [docs, editTask, deleteTask, updateCheckTask])

    const onSort = (sortedList, dropEvent) => {
        const token = getAccessTokenApi()

        sortedList.forEach(item => {
            const taskId = item.content.props.task._id
            const order = item.rank

            updateTaskApi(token, taskId, { order })
                .then(response => {
                    if (response?.code !== 200 || !response.code) {
                        console.log('Hubo un error con el drag.', response)
                        return
                    }
                    if (order === 0) { //para que se ejecute una sola vez
                        updateSort()

                        // cree una función que renderice las tareas
                        // porque si usaba setReloadTasks me las renderizaba
                        // dos veces seguidas
                        getTasks()
                    }
                })
                .catch(err => console.log('Error: ' + err))
        })

        const updateSort = () => {
            updateUserApi(token, user.id, { sort: { order: 'asc' } })
                .then(response => {
                    if (response?.code !== 200 || !response.code) {
                        console.log('No se pudo actualizar el orden de petición.')
                        return
                    }
                })
                .catch(err => console.log('Error: ' + err))
        }
    }

    return (
        <div className='tasks-list__item'>
            <DragSortableList items={listItems} onSort={onSort} dropBackTransitionDuration={0.3} type='vertical' />
        </div>
    )
}

const TaskItem = ({ task, editTask, deleteTask, updateCheckTask }) => {

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

    return (
        <List.Item
            className='task'
            actions={[
                <Button type='primary' onClick={() => editTask(task)}>
                    <EditOutlined />
                </Button>,
                <Button type='danger' onClick={() => deleteTask(task)}>
                    <DeleteOutlined />
                </Button>
            ]}
        >
            <Checkbox
                checked={task.checked}
                onChange={(e) => updateCheckTask(e, task)}
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
                                    : <span className='no-date'>Sin fecha de finalización</span>
                            }
                        </span>
                    </>
                }
            />
        </List.Item>
    )
}

export default TasksList