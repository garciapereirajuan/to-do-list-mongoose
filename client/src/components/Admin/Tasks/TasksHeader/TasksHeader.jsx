import React, { useState, useEffect } from 'react'
import { Row, Col, Switch, Button, Select } from 'antd'
import useAuth from '../../../../hooks/useAuth'
import { getAccessTokenApi } from '../../../../api/auth'
import { showUserApi, updateUserApi } from '../../../../api/user'
import { DeleteFilled, FileAddFilled } from '@ant-design/icons'

import './TasksHeader.scss'

const { Option } = Select

const sort = {
    'Por fecha de creación': { dateUp: 'desc' },
    'Por fecha de finalización': { orderByDateDown: 'asc' },
    'Por categorías': { category: 'desc' },
    'Por alfabeto': { title: 'asc' },
    '{"dateUp":"desc"}': 'Por fecha de creación',
    '{"orderByDateDown":"asc"}': 'Por fecha de finalización',
    '{"category":"desc"}': 'Por categorías',
    '{"title":"asc"}': 'Por alfabeto',
}

const TasksHeader = ({ tasks, addTask, checked, setChecked, setReloadTasks, deleteAllTasks
}) => {
    const [selectOrder, setSelectOrder] = useState('')
    const { user } = useAuth()

    useEffect(() => {
        const token = getAccessTokenApi()

        showUserApi(token, user.id)
            .then(response => {
                const userCurrent = response.user
                const sortUser = JSON.stringify(userCurrent.sort)

                setSelectOrder(sort[sortUser])
            })
    }, [user])

    useEffect(() => {
        const token = getAccessTokenApi()

        updateUserApi(token, user.id, { sort: sort[selectOrder] })
            .then(response => {
                setReloadTasks(true)
            })
    }, [selectOrder, user, setReloadTasks])

    return (
        <Row className='tasks-header'>
            <Col xs={24} sm={8} md={8} className='tasks-header__switch'>
                <Switch
                    defaultChecked={false}
                    onChange={e => setChecked(e)}
                />
                <span>
                    {
                        checked
                            ? `Hechas: ${tasks ? tasks.total : '0'}`
                            : `Sin hacer: ${tasks ? tasks.total : '0'}`
                    }
                </span>
            </Col>
            <Col xs={24} sm={8} md={8} className='tasks-header__select-order'>
                <Select
                    value={selectOrder}
                    placeholder='Ordenar por...'
                    onChange={(e) => setSelectOrder(e)}
                >
                    <Option
                        value={'Por alfabeto'}
                        key='Por alfabeto'>
                        Por alfabeto
                    </Option>
                    <Option
                        value={'Por categorías'}
                        key='Por categorías'>
                        Por categorías
                    </Option>
                    <Option
                        value={'Por fecha de creación'}
                        key='Por fecha de creación'>
                        Por fecha de creación
                    </Option>
                    <Option
                        value={'Por fecha de finalización'}
                        key='Por fecha de finalización'>
                        Por fecha de finalización
                    </Option>
                </Select>
            </Col>
            <Col xs={24} sm={8} md={8} className='tasks-header__btn'>
                <ButtonHeader
                    checked={checked}
                    addTask={addTask}
                    deleteAllTasks={deleteAllTasks}
                    tasks={tasks}
                />
            </Col>
        </Row>
    )
}

const ButtonHeader = ({ checked, addTask, deleteAllTasks, tasks }) => {
    const BtnClean = ({ type }) => (
        <Button type='danger' onClick={() => deleteAllTasks(type)}>
            <DeleteFilled />
            Limpiar
        </Button>
    )

    const btnAdd = (
        <Button type='primary' onClick={addTask}>
            <FileAddFilled />
            Nueva
        </Button>
    )

    if (!checked && tasks?.docs.length === 0) {
        return <> {btnAdd} </>
    }

    if (!checked && tasks?.docs.length !== 0) {
        return <> <BtnClean /> {btnAdd} </>
    }

    if (checked && tasks?.docs.length !== 0) {
        return <> <BtnClean type='checked' /> </>
    }
}

export default TasksHeader
