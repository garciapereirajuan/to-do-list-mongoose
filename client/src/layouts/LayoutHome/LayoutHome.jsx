import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import Welcome from '../../pages/Welcome'
import Home from '../../pages/Home'
import MenuTop from '../../components/Web/MenuTop'
import FooterSection from '../../components/FooterSection'

import './LayoutHome.scss'

const LayoutHome = () => {
    const { Content } = Layout

    return (
        <Layout className="layout-home">
            <MenuTop />
            <Content className="layout-home__content">
                <div className='layout-home__content-background'></div>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Welcome />} />
                    <Route path="*" element={<Welcome />} />
                </Routes>
            </Content>
            <FooterSection />
        </Layout>
    )
}

export default LayoutHome