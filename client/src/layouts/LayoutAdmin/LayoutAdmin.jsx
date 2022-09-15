import React, { useState, useEffect } from 'react'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../utils/constants'
import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import MenuTop from '../../components/Web/MenuTop'
import Home from '../../pages/Home'
import Tasks from '../../pages/Admin/Tasks'
import Categories from '../../pages/Admin/Categories'
import useAuth from '../../hooks/useAuth'
import { willExpireToken } from '../../api/auth'

import './LayoutAdmin.scss'

const LayoutAdmin = () => {
    const [expireToken, setExpireToken] = useState(false)
    const { user, isLoading } = useAuth()
    const { Header, Content, Footer } = Layout

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
                <Routes>
                    <Route path="/" element={
                        <Home
                            setExpireToken={setExpireToken}
                        />
                    } />
                    <Route path="/tasks" element={
                        user && <Tasks
                            setExpireToken={setExpireToken}

                        />
                    } />
                    <Route path="/categories" element={
                        user && <Categories
                            setExpireToken={setExpireToken}

                        />
                    } />
                </Routes>
            </Content>
            <Footer className="layout-admin__footer">&#169; 2022 - JUAN G.P.</Footer>
        </Layout>
    )
}

export default LayoutAdmin




