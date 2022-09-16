import React, { useEffect, useState } from 'react'
import { Button, message, notification, Tree } from 'antd'
import { EditFilled, DeleteFilled } from '@ant-design/icons'
import { getAccessTokenApi } from '../../../../api/auth'
import { positionCategoryAndTasksApi } from '../../../../api/categoryAndTasks'
import { updateCategoryAndTasks } from '../../../../utils/categoryAndTasksManager'

import './CategoriesTree.scss'
import { relativeTimeRounding } from 'moment/moment'

const { DirectoryTree } = Tree

const CategoriesTree = ({ categories, setReloadCategories, setReloadTasks, editCategory, deleteCategory }) => {
    const [treeCategories, setTreeCategories] = useState([])
    const [position, setPosition] = useState(0)

    useEffect(() => {
        let treeCategoriesArray = []

        categories && categories.forEach(category => {
            let children = []

            category.tasks.forEach(item => {
                children.push({
                    title: item.title,
                    key: `${category._id}-${item._id}`,
                    isLeaf: true,
                    style: {
                        width: '98%',
                        position: 'relative',
                        left: '2%',
                        boxShadow: `-2px 0px 4px .5px ${category.color ? category.color : 'rgb(66, 66, 66)'}`,
                        borderLeft: `5px solid ${category.color ? category.color : 'rgb(66, 66, 66)'}`,
                        borderRight: `5px solid ${category.color ? category.color : 'rgb(66, 66, 66)'}`,
                    }
                })
            })

            treeCategoriesArray.push({
                title: (
                    <span className='category-title'>
                        {category.title}
                        <div>
                            <Button type='primary' onClick={() => editCategory(category)}>
                                <EditFilled />
                            </Button>
                            <Button type='danger' onClick={() => deleteCategory(category)}>
                                <DeleteFilled />
                            </Button>
                        </div>
                    </span>
                ),
                key: category._id,
                children: children,
                style: {
                    // borderTop: `2px solid ${category.color || 'transparent'}`,
                    boxShadow: `-2px 0px 4px .5px ${category.color ? category.color : 'rgb(66, 66, 66)'}`,
                    borderLeft: `5px solid ${category.color ? category.color : 'rgb(66, 66, 66)'}`,
                    borderRight: `5px solid ${category.color ? category.color : 'rgb(66, 66, 66)'}`,
                    // boxShadow: `2px 5px 10px 1px 2px ${category.color || 'transparent'}`
                }
            })
        })

        setTreeCategories(treeCategoriesArray)

    }, [categories, editCategory])

    const onExpand = (keys, info) => {
        // console.log(keys, info)
    }

    const onDragEnter = (info) => {
        const pos = info.node.pos.split('-')
        setPosition(pos[2])
        // console.log(info)
    }

    const onSelect = (keys, info) => {
        const pos = info.node.pos.split('-')
        setPosition(pos[2])
        // console.log(keys, info)
    }

    const onDrop = (info) => {
        const token = getAccessTokenApi()

        const dragNode = info.dragNode.key.split('-')
        const node = info.node.key.split('-')

        const oldCategoryId = dragNode[0]
        const newCategoryId = node[0]
        const taskId = dragNode[1]

        if (oldCategoryId === newCategoryId) {
            console.log(taskId, position)
            positionCategoryAndTasksApi(token, taskId, oldCategoryId, position)
                .then(response => {
                    if (response?.code !== 200 || !response.code) {
                        // notification['error']({ message: 'Se produjo un error al mover la tarea.' })
                        return
                    }

                    // notification['success']({ message: response.message })
                    setReloadCategories(true)
                    setReloadTasks(true)
                })
                .catch(err => {
                    notification['error']({ message: 'Se produjo un error al mover la tarea.' })
                })
            return
        }

        const finish = () => {
            setReloadCategories(true)
            setReloadTasks(true)
        }

        updateCategoryAndTasks(token, taskId, newCategoryId, oldCategoryId, true, finish)

        // removeCategoryAndTasksApi(token, taskId, oldCategoryId)
        //     .then(response => {
        //         if (response?.code !== 200 || !response.code) {
        //             notification['error']({
        //                 message: response.message
        //             })
        //             return
        //         }

        //         addCategoryAndTasksApi(token, taskId, newCategoryId)
        //             .then(response => {
        //                 if (response?.code !== 200 || !response.code) {
        //                     notification['error']({
        //                         message: response.message
        //                     })
        //                     return
        //                 }

        //                 // notification['success']({ message: response.message })
        //                 setReloadCategories(true)
        //             })
        //             .catch(err => {
        //                 notification['error']({ message: 'Se produjo un error. Intenta más tarde.' })
        //             })
        //     })
        //     .catch(err => {
        //         notification['error']({ message: 'Se produjo un error. Intenta más tarde.' })
        //     })



        // console.log('position', position)
        // console.log(info)

    }

    return (
        <div className='categories-tree'>
            <DirectoryTree
                multiple
                draggable
                onDragEnter={onDragEnter}
                onSelect={onSelect}
                onDrop={onDrop}
                onExpand={onExpand}
                treeData={treeCategories}
            />
        </div>
    )
}

export default CategoriesTree
