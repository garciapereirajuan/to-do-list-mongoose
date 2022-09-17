import React, { useState, useEffect } from 'react'
import { Switch, Button, Select } from 'antd'
import useAuth from '../../../../hooks/useAuth'
import { getAccessTokenApi } from '../../../../api/auth'
import { showUserApi, updateUserApi } from '../../../../api/user'

import './TasksHeader.scss'

const { Option } = Select

const TasksHeader = ({ tasks, addTask, checked, setChecked, setReloadTasks }) => {
    const [selectOrder, setSelectOrder] = useState('')
    const { user } = useAuth()

    const sort = {
        'Por fecha de creación': { dateUp: 'desc' },
        'Por fecha de actualización': { dateUpdate: 'desc' },
        'Por fecha de finalización': { dateDown: 'desc' },
        'Por categorías': { category: 'desc' },
        'Por alfabeto': { title: 'asc' },
        '{"dateUp":"desc"}': 'Por fecha de creación',
        '{"dateUpdate":"desc"}': 'Por fecha de actualización',
        '{"dateDown":"desc"}': 'Por fecha de finalización',
        '{"category":"desc"}': 'Por categorías',
        '{"title":"asc"}': 'Por alfabeto',
    }

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

        // console.log(sort[selectOrder])

        updateUserApi(token, user.id, { sort: sort[selectOrder] })
            .then(response => {
                setReloadTasks(true)
            })


    }, [selectOrder, user])

    return (
        <div className='tasks-header'>
            <div className='tasks-header__switch'>
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
            </div>
            <div className='tasks-header__select-order'>
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
                        value={'Por fecha de actualización'}
                        key='Por fecha de actualización'>
                        Por fecha de actualización
                    </Option>
                    <Option
                        value={'Por fecha de finalización'}
                        key='Por fecha de finalización'>
                        Por fecha de finalización
                    </Option>
                </Select>
            </div>
            <div className='tasks-header__btn-new-task'>
                <Button type='primary' onClick={addTask}>
                    Nueva tarea
                </Button>
            </div>
        </div>
    )
}

export default TasksHeader
