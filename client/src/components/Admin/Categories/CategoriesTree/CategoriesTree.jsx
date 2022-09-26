import React, { useEffect, useState } from 'react'
import { Button, Spin, Tree } from 'antd'
import { openNotification } from '../../../../utils/openNotification'
import { EditFilled, DeleteFilled, CheckCircleFilled, FileAddFilled } from '@ant-design/icons'
import { getAccessTokenApi } from '../../../../api/auth'
import { positionCategoryAndTasksApi } from '../../../../api/categoryAndTasks'
import { updateCategoryAndTasks } from '../../../../utils/categoryAndTasksManager'
import NoDataLogo from '../../../../assets/img/png/no-data-logo-grey-2.png'

import './CategoriesTree.scss'

const { DirectoryTree } = Tree

const CategoriesTree = (props) => {
    const {
        categories, setReloadCategories, setReloadTasks,
        editCategory, deleteCategory, addTask, editTask
    } = props

    const [treeCategories, setTreeCategories] = useState([])
    const [position, setPosition] = useState(0)

    useEffect(() => {
        let treeCategoriesArray = []

        const style = (category) => ({
            boxShadow: `-2px 0px 4px .5px ${category.color ? category.color : 'rgb(66, 66, 66)'}`,
            border: `5px solid ${category.color ? category.color : 'rgb(66, 66, 66)'}`
        })
        const getStyles = {
            children: (category) => {
                return {
                    width: '98%',
                    position: 'relative',
                    left: '2%',
                    boxShadow: style(category).boxShadow,
                    borderLeft: style(category).border,
                    borderRight: style(category).border
                }
            },
            category: (category) => {
                return {
                    boxShadow: style(category).boxShadow,
                    borderLeft: style(category).border,
                    borderRight: style(category).border,
                }
            }
        }

        const getTitle = (item) => {
            if (item.checked) {
                return <span>{item.title} <CheckCircleFilled /></span>
            }

            return item.title
        }

        categories && categories.forEach(category => {
            let children = []

            category.tasks.forEach(item => {
                children.push({
                    title: getTitle(item),
                    key: `${category._id}-${item._id}`,
                    isLeaf: true,
                    style: getStyles.children(category)
                })
            })

            treeCategoriesArray.push({
                title: (
                    <span className='category-title'>
                        <div className='category-title__title'>
                            {category.title}
                        </div>
                        <div className='category-title__actions'>
                            <Button
                                type='primary'
                                title='Crear nueva tarea'
                                onClick={() => addTask(category)}
                            >
                                <FileAddFilled />
                            </Button>
                            <Button
                                type='primary'
                                title='Editar la categoría'
                                onClick={() => editCategory(category)}
                            >
                                <EditFilled />
                            </Button>
                            <Button
                                type='danger'
                                title='Eliminar la categoría'
                                onClick={() => deleteCategory(category)}
                            >
                                <DeleteFilled />
                            </Button>
                        </div>
                    </span>
                ),
                key: category._id,
                children: children,
                style: getStyles.category(category)
            })
        })

        setTreeCategories(treeCategoriesArray)

    }, [categories, editCategory, deleteCategory, addTask])

    const onDragEnter = (info) => {
        const pos = info.node.pos.split('-')
        setPosition(pos[2])
    }

    const onSelect = (keys, info) => {
        const pos = info.node.pos.split('-')
        const key = info.node.key.split('-')
        setPosition(pos[2])

        key.length === 2 && editTask(key[1])
    }

    const onDrop = (info) => {
        const token = getAccessTokenApi()

        const dragNode = info.dragNode.key.split('-')
        const node = info.node.key.split('-')
        const oldCategoryId = dragNode[0]
        const newCategoryId = node[0]
        const taskId = dragNode[1]

        if (taskId === '0') {
            openNotification('info', 'Sólo puedes mover las tareas. 😀')
            return
        }

        if (oldCategoryId === newCategoryId) {
            positionCategoryAndTasksApi(token, taskId, oldCategoryId, position)
                .then(response => {
                    if (response?.code !== 200 || !response.code) {
                        // openNotification('error', 'Se produjo un error al mover la tarea.')
                        return
                    }

                    // openNotification('success', response.message)
                    setReloadCategories(true)
                    setReloadTasks(true)
                })
                .catch(err => {
                    openNotification('error', 'Se produjo un error al mover la tarea.')
                })
            return
        }

        const finish = () => {
            setReloadCategories(true)
            setReloadTasks(true)
        }

        updateCategoryAndTasks(token, taskId, newCategoryId, oldCategoryId, true, finish)
    }

    if (!categories) {
        return (
            <div className='categories-tree no-data'>
                <img src={NoDataLogo} alt='TO-DO Aquí no hay nada' />
            </div>
        )
    }

    console.log(categories)

    if (categories?.length === 0) {
        return (
            <div className='categories-tree loading'>
                <Spin size="large" />
            </div>
        )
    }

    if (categories[0] === false) {
        return
    }

    return (
        <div className='categories-tree'>
            <DirectoryTree
                multiple
                draggable
                onDragEnter={onDragEnter}
                onSelect={onSelect}
                onDrop={onDrop}
                treeData={treeCategories}
            />
        </div>
    )
}

export default CategoriesTree
