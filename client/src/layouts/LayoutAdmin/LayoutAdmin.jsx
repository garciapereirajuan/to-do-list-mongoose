import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import MenuTop from '../../components/Web/MenuTop'
import Home from '../../pages/Home'
import Tasks from '../../pages/Admin/Tasks'
import Categories from '../../pages/Admin/Categories'

import AddEditForm from '../../components/Admin/Categories/AddEditForm'
import useAuth from '../../hooks/useAuth'
import ToDoLogo from '../../assets/img/png/to-do-logo-orange.png'

import './LayoutAdmin.scss'

const LayoutAdmin = () => {
    const [expireToken, setExpireToken] = useState(false)
    const { user } = useAuth()
    const { Header, Content, Footer } = Layout

    const editCategoryGeneral = (
        category, verifyExpireTokenInWeb, setExpireToken,
        setIsVisibleModal, setModalTitle, setModalContent,
        tasks, categories, setReloadCategories, setReloadTasks
    ) => {
        console.log(category._id)
        verifyExpireTokenInWeb(setExpireToken)
        setIsVisibleModal(true)
        setModalTitle('Editar categoría')
        setModalContent(
            <AddEditForm
                category={category}
                tasks={tasks}
                categories={categories}
                setReloadCategories={setReloadCategories}
                setReloadTasks={setReloadTasks}
                setIsVisibleModal={setIsVisibleModal}
            />
        )
    }

    useEffect(() => {
        if (expireToken) {
            window.location.reload()
        }
    }, [expireToken, user])

    return (
        <Layout className="layout-admin">
            <Header className="layout-admin__header">
                <MenuTop />
            </Header>
            <Content className="layout-admin__content">
                <div className="layout-admin__content-img-left">
                    <img width={200} src={ToDoLogo} alt="Logo-to-do-list" />
                </div>
                <div className="layout-admin__content-img-right">
                    <img width={200} src={ToDoLogo} alt="Logo-to-do-list" />
                </div>
                <Routes>
                    <Route path="/" element={
                        <Home
                            setExpireToken={setExpireToken}
                        />
                    } />
                    <Route path="/tasks" element={
                        user && <Tasks
                            setExpireToken={setExpireToken}
                            editCategoryGeneral={editCategoryGeneral}
                        />
                    } />
                    <Route path="/categories" element={
                        user && <Categories
                            setExpireToken={setExpireToken}
                            editCategoryGeneral={editCategoryGeneral}
                        />
                    } />
                </Routes>
            </Content>
            <Footer className="layout-admin__footer">&#169; 2022 - JUAN G.P.</Footer>
        </Layout>
    )
}

export default LayoutAdmin




