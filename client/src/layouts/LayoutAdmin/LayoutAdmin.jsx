import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import MenuTop from '../../components/Web/MenuTop'
import Home from '../../pages/Home'
import Tasks from '../../pages/Admin/Tasks'
import Categories from '../../pages/Admin/Categories'
import useAuth from '../../hooks/useAuth'

import './LayoutAdmin.scss'

const LayoutAdmin = () => {
    const { user, isLoading } = useAuth()
    const { Header, Content, Footer } = Layout

    return (
        <Layout className="layout-admin">
            <Header className="layout-admin__header">
                <MenuTop />
            </Header>
            <Content className="layout-admin__content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/tasks" element={user && <Tasks />} />
                    <Route path="/categories" element={user && <Categories />} />
                </Routes>
            </Content>
            <Footer className="layout-admin__footer">&#169; 2022 - JUAN G.P.</Footer>
        </Layout>
    )
}

export default LayoutAdmin




