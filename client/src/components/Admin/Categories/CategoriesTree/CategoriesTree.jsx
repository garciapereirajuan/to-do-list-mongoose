import React, { useEffect, useState } from 'react'
import { Button, Tree } from 'antd'
import { EditFilled } from '@ant-design/icons'

import './CategoriesTree.scss'

const { DirectoryTree } = Tree

const CategoriesTree = ({ categories }) => {
    const [treeCategories, setTreeCategories] = useState([])

    useEffect(() => {
        let treeCategoriesArray = []

        categories && categories.forEach(category => {
            let children = []

            category.tasks.forEach(item => {
                children.push({
                    title: item.title,
                    key: `${category.title}-${item.title}`,
                    isLeaf: true,
                })
            })

            treeCategoriesArray.push({
                title: (
                    <span className='category-title'>
                        {category.title}

                        <Button type='primary' onClick={() => console.log('Editar categoría')}>
                            <EditFilled />
                        </Button>

                    </span>
                ),
                key: category.title,
                children: children,
            })
        })

        setTreeCategories(treeCategoriesArray)

    }, [categories])

    const treeData = [
        {
            title: `Casa`,
            key: '0-0',
            children: [
                { title: 'Cortar el pasto', key: '0-0-0', isLeaf: true },
                { title: 'Limpiar el baño', key: '0-0-1', isLeaf: true },
            ],
        },
        {
            title: 'Trabajo',
            key: '0-1',
            children: [
                { title: 'Terminar el informe', key: '0-1-0', isLeaf: true },
                { title: 'Leer la documentación del lunes', key: '0-1-1', isLeaf: true },
            ],
        },
    ];

    const onExpand = (keys, info) => {
        console.log(keys, info)
    }


    return (
        <div className='categories-tree'>
            <DirectoryTree
                multiple

                // onSelect={}

                onExpand={onExpand}
                treeData={treeCategories}
            />
        </div>
    )
}

export default CategoriesTree
