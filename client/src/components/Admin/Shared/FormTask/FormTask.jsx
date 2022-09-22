import { useState, useEffect } from 'react'
import { Form, Input, Button, DatePicker, TimePicker, Select } from 'antd'
import { FontSizeOutlined, UnorderedListOutlined } from '@ant-design/icons'
import moment from 'moment'

import './FormTask.scss'

const { Option } = Select

const getOptions = (categories) => {
    const categoriesOption = [
        //da problemas de key
        <Option value={undefined} key={'0'}>Ninguna</Option>
    ]
    categories.forEach(category => {
        categoriesOption.push(
            <Option
                value={category.title}
                key={category.id}
            >
                {category.title}
            </Option>
        )
    })
    return categoriesOption
}

const getTitleCategory = (categories, category) => {
    let element = categories.filter(item => {
        return item._id === category
    })
    return element.length !== 0 ? element[0].title : category
}

const getCategoryByTitle = (categories, category) => {
    const element = categories.filter(item => {
        return item.title === category
    })
    return element.length !== 0 ? element[0]._id : category
}

const placeholderSelect = (categories) => (
    <>
        <span style={{ fontSize: '18px', marginLeft: '-1px' }}>
            <UnorderedListOutlined />
        </span>
        <span style={{ position: 'relative', marginLeft: '4px', bottom: '2px' }}>
            {
                categories
                    ? 'Selecciona una categoría (opcional)'
                    : 'Selecciona una categoría (aún no tienes categorías)'
            }
        </span>
    </>
)


const FormTask = ({ taskData, setTaskData, categories, task, category, autoFocus, updateTask, addTask }) => {
    const [checkDate, setCheckDate] = useState(false)

    useEffect(() => {
        setCheckDate(taskData.dateDown ? true : false)
    }, [checkDate, taskData])

    const disabledDate = current => {
        return current && current < moment().endOf('day');
    }

    let autoFocusSelect = false
    if (autoFocus === 'autoFocusSelectCategories') {
        autoFocusSelect = true
    }

    let valueSelectCategory = null

    if (taskData.category) {
        valueSelectCategory = getTitleCategory(categories, taskData.category)
    }

    if (category) {
        valueSelectCategory = getTitleCategory(categories, category)
        taskData.category = category
    }

    return (
        <Form className='form-task' onFinish={task ? updateTask : addTask}>
            <Form.Item>
                <Input
                    autoFocus={!autoFocusSelect}
                    prefix={<FontSizeOutlined />}
                    placeholder='Nueva tarea'
                    value={taskData.title}
                    maxLength={70}
                    onChange={e => setTaskData({ ...taskData, title: e.target.value })}
                />
            </Form.Item>
            <Form.Item>
                <DatePicker
                    format="DD-MM-YYYY"
                    // showTime={{ defaultValue: moment('09:00', 'HH:mm') }}
                    disabledDate={disabledDate}
                    placeholder='Fecha de finalización (opcional)'
                    value={taskData.dateDown && moment(taskData.dateDown)}
                    onChange={(e, value) => {
                        setTaskData({
                            ...taskData,
                            dateDown: moment(value, 'DD-MM-YYYY HH:mm:ss').toISOString()
                        })
                        // console.log(moment(moment(value, 'DD-MM-YYYY HH:mm:ss').toISOString()).add(moment().format('HH:mm')))
                        // console.log(moment(value, 'DD-MM-YYYY HH:mm:ss').toISOString())
                    }
                    }
                />
            </Form.Item>
            <Form.Item>
                <TimePicker
                    format='HH:mm'
                    disabled={!checkDate}
                    placeholder={`Horario de finalización (${!checkDate ? 'debes elegir la fecha' : 'por defecto: 09:00'})`}
                    value={(taskData.timeDateDown && checkDate) && moment(taskData.timeDateDown)}
                    onChange={(e) => {
                        console.log(e)
                        setTaskData({
                            ...taskData,
                            timeDateDown: moment(e || '09:00', 'HH:mm')
                        })
                    }}
                />
            </Form.Item>
            <Form.Item>
                <Select
                    autoFocus={autoFocusSelect}
                    defaultOpen={autoFocusSelect}
                    disabled={category ? true : categories ? false : true}
                    value={category ? `Crearás una tarea en ${valueSelectCategory.toUpperCase()}` : valueSelectCategory}
                    onChange={e => {
                        setTaskData({ ...taskData, category: getCategoryByTitle(categories, e) })
                    }}
                    placeholder={placeholderSelect(categories)}
                >
                    {
                        categories
                            ? getOptions(categories)
                            : null
                    }
                </Select>
            </Form.Item>

            <Button type='primary' htmlType='submit' className='btn-submit'>
                {
                    task ? 'Actualizar tarea' : 'Nueva tarea'
                }
            </Button>
        </Form >
    )
}

export default FormTask