import React, { useEffect, useState } from 'react'
import { List, Button, Checkbox, Spin } from 'antd'
import { DeleteFilled, EditFilled, ArrowUpOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import NoDataLogo from '../../../../assets/img/png/no-data-logo-grey-2.png'
import moment from 'moment'
import 'moment/locale/es'

import './TasksList.scss'

const TasksList = ({ tasks, editTask, deleteTask, updateCheckTask, categories, chooseActionForCategory }) => {
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
                    chooseActionForCategory={chooseActionForCategory}
                    deleteTask={deleteTask}
                    updateCheckTask={updateCheckTask}
                    categories={categories}
                />
            )
        })

        setListItems(listItemsArray)
    }, [
        docs, editTask, deleteTask, updateCheckTask,
        categories, chooseActionForCategory
    ])

    if (tasks.total === 0) {
        return (
            <div className='tasks-list__item no-data'>
                <img src={NoDataLogo} alt='TO-DO Aquí no hay nada' />
            </div>
        )
    }

    if (listItems.length === 0) {
        return (
            <div className='tasks-list__item loading'>
                <Spin size="large" />
            </div>
        )
    }

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

const TaskItem = ({ task, editTask, chooseActionForCategory, deleteTask, updateCheckTask, categories }) => {
    const [checkedTask, setCheckedTask] = useState(task.checked)
    const [warningTime, setWarningTime] = useState(false)
    const [finishTime, setFinishTime] = useState(false)
    const [classes, setClasses] = useState('')

    useEffect(() => {
        setWarningTime(
            moment(task.dateDown).subtract(24, 'hours').format() < moment().format()
        )
        setFinishTime(moment(task.dateDown).format() < moment().format())
    }, [task])

    useEffect(() => {
        if (task.checked) {
            setClasses('check task')
            return
        }

        if (finishTime) {
            setClasses('finish-time task')
            return
        }

        if (warningTime) {
            setClasses('warning-time task')
            return
        }

        if (!warningTime) {
            setClasses('task')
            return
        }
    }, [finishTime, warningTime, task])

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

        if (title === '') {
            color = 'rgba(90,90,90)'
            title = 'Sin categoría'
            titleProp = 'Haz clic para crear o elegir una categoría'
            disabled = true
        }
    }

    const getButtons = () => {
        getCategoryById(task.category)

        const btnCategory = (
            < Button
                onClick={(e) => {
                    chooseActionForCategory(task)
                }}
                className={`task__btn-category ${disabled ? 'disabled' : 'not-disabled'}`}
                title={titleProp}
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
        if (task.checked && task.dateComplete) {
            return (
                <span className='tasks__description-date-down__date-complete'>
                    Completada: {moment(task.dateComplete).fromNow()}
                </span>
            )
        }

        if (!task.dateDown) {
            return (
                <span className='task__description-date-down__no-date'>
                    Sin fecha de finalización
                </span>
            )
        }

        if (finishTime) {
            return (
                <span className='task__description-date-down__date-down-not-ok'>
                    Finalizó {moment(task.dateDown).fromNow()}
                </span>
            )
        }

        if (warningTime) {
            return (
                <span className='task__description-date-down__date-down-warning'>
                    Finaliza {moment(task.dateDown).fromNow()}
                </span>
            )
        }

        if (!warningTime) {
            return (
                <span className='task__description-date-down__date-down-ok'>
                    Finaliza {moment(task.dateDown).fromNow()}
                </span>
            )
        }
    }

    return (
        <List.Item
            className={classes}
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
                title={<span title={task.title}>{task.title}</span>}
                description={
                    <>
                        <span className={`${classes}__description-date-up`}>
                            <ArrowUpOutlined />
                            Creada: {formatDate(task.dateUp)}
                        </span>
                        <span className={`${classes}__description-date-down`}>
                            {!task.checked && <ClockCircleOutlined />}
                            {task.checked && <CheckCircleOutlined />}
                            {getDescriptionDateDown()}
                        </span>

                    </>
                }
            />
        </List.Item >
    )
}

export default TasksList
