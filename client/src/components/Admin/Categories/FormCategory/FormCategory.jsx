import { Form, Input, Select, Button } from 'antd'
import colors from '../../../../utils/colors'
import { FontSizeOutlined, BgColorsOutlined, UnorderedListOutlined } from '@ant-design/icons'

import './FormCategory.scss'

const FormCategory = (props) => {
    const {
        category, categoryData, usedColors, setCategoryData, addCategory,
        editCategory, tasks, categories, tasksArray, setTasksArray
    } = props

    const { Option } = Select

    const optionTemplate = (color) => {
        const blockColor = usedColors.includes(color)

        return (
            <Option value={color} key={color} disabled={blockColor}>
                <div style={{ backgroundColor: color }} className='form-category__div-color'>
                    <div className='form-category__div-color__description'>
                        {color}
                    </div>
                    <div
                        className='form-category__div-color__block-color'
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
                <div style={{ backgroundColor: '#fff' }} className='form-category__div-color'>
                    <div className='form-category__div-color__description'>
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
                                <div className='form-category__select-tasks'>
                                    <span>{item.title}</span>
                                    <span
                                        className='form-category__select-tasks__category'
                                        style={{ borderColor: borderColor }}
                                    >
                                        {`${category.title}`}
                                    </span>
                                </div>
                            )
                    }
                </Option>
            )
        })
    }

    return (
        <Form className='form-category' onFinish={category ? editCategory : addCategory} >
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

export default FormCategory