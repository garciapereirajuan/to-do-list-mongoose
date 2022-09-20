import { Form, Input, Button, DatePicker, Select } from 'antd'
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


const FormTask = ({ taskData, setTaskData, categories, task, newCategoryId, autoFocus, updateTask, addTask }) => {
    const disabledDate = current => {
        return current && current < moment().endOf('day');
    }

    let autoFocusSelect = false
    if (autoFocus === 'autoFocusSelectCategories') {
        autoFocusSelect = true
    }

    let valueSelectCategory = null

    // if (newCategoryId) { //le llega desde /categories
    //     taskData.category = newCategoryId
    // }

    if (taskData.category) {
        valueSelectCategory = getTitleCategory(categories, taskData.category)
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
                    onChange={(e, value) => setTaskData({
                        ...taskData,
                        dateDown: moment(value, 'DD-MM-YYYY HH:mm:ss').toISOString()
                    })}
                />
            </Form.Item>
            <Form.Item className='input-select-categories'>
                <Select
                    autoFocus={autoFocusSelect}
                    defaultOpen={autoFocusSelect}
                    disabled={categories ? false : true}
                    value={valueSelectCategory}
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