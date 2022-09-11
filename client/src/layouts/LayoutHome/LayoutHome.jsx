import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout, notification } from 'antd'
import Home from '../../pages/Home'
import MenuTop from '../../components/Web/MenuTop'
import FooterSection from '../../components/FooterSection'
import useAuth from '../../hooks/useAuth'

import './LayoutHome.scss'

const LayoutHome = () => {
    const { user, isLoading } = useAuth()
    const { Header, Content } = Layout
    const { pathname } = window.location

    if (!user && !isLoading && pathname !== '/') {
        window.location.href = '/'
    }

    return (
        <Layout className="layout-home">
            <Header className="layout-home__header">
                <MenuTop />
            </Header>
            <Content className="layout-home__content">
                <Routes>
                    <Route path="/" element={<Home />} />
                </Routes>
            </Content>
            <FooterSection />
        </Layout>
    )
}

export default LayoutHome