import React, { useState, useEffect } from 'react'
import { Form, Input, Select, Button } from 'antd'
import { addCategoryAndTasksApi } from '../../../../api/categoryAndTasks'
import { FontSizeOutlined } from '@ant-design/icons'
import colors from '../../../../utils/colors'
import { BgColorsOutlined } from '@ant-design/icons'

import './AddEditForm.scss'

const AddEditForm = ({ category, tasks, setIsVisibleModal }) => {
    const [categoryData, setCategoryData] = useState({})


    const addCategory = () => { }
    const editCategory = () => { }



    return (
        <FormCategory
            categoryData={categoryData}
            setCategoryData={setCategoryData}
            addCategory={addCategory}
            editCategory={editCategory}
            tasks={tasks}
        />
    )
}

const FormCategory = ({ category, categoryData, setCategoryData, addCategory, editCategory }) => {
    const { Option } = Select

    const optionTemplate = (color) => {
        return (
            <Option value={color} key={color}>
                <div style={{ backgroundColor: color }} className='add-edit-form-categories__div-color'>
                    <span className='add-edit-form-categories__div-color__span'>
                        {color}
                    </span>
                </div>
            </Option>
        )
    }

    const getColors = () => {
        const colorOptionItem = []

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
                    // value={colors[1].macaron[3]}
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
        </Form >
    )
}

export default AddEditForm
