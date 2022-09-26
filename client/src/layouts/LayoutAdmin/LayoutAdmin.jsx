import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout } from 'antd'
import MenuTop from '../../components/Web/MenuTop'
import FooterSection from '../../components/FooterSection'
import Home from '../../pages/Home'
import Tasks from '../../pages/Admin/Tasks'
import Categories from '../../pages/Admin/Categories'
import useAuth from '../../hooks/useAuth'
import ToDoLogo from '../../assets/img/png/to-do-logo-orange.png'

import './LayoutAdmin.scss'

const LayoutAdmin = () => {
    const [expireToken, setExpireToken] = useState(false)
    const [reloadAlert, setReloadAlert] = useState(true)
    const { user } = useAuth()
    const { Header, Content, Footer } = Layout

    useEffect(() => {
        if (expireToken) {
            window.location.reload()
        }
    }, [expireToken, user])

    return (
        <Layout className="layout-admin">
            <MenuTop />
            <Content className="layout-admin__content">
                <div className='layout-home__content-background'></div>
                <div className="layout-admin__content-img-left">
                    <div>
                        <img width={200} src={ToDoLogo} alt="Logo-to-do-list" />
                    </div>
                </div>
                <div className="layout-admin__content-img-right">
                    <div>
                        <img width={200} src={ToDoLogo} alt="Logo-to-do-list" />
                    </div>
                </div>
                <Routes>
                    <Route path="/" element={
                        <Home
                            setExpireToken={setExpireToken}
                        />
                    } />
                    <Route path="/tasks" element={
                        user && <Tasks
                            reloadAlert={reloadAlert}
                            setReloadAlert={setReloadAlert}
                            setExpireToken={setExpireToken}
                        />
                    } />
                    <Route path="/categories" element={
                        user && <Categories
                            setExpireToken={setExpireToken}
                        />
                    } />
                    <Route path="*" element={
                        user && <Tasks
                            reloadAlert={reloadAlert}
                            setReloadAlert={setReloadAlert}
                            setExpireToken={setExpireToken}
                        />
                    } />
                </Routes>
            </Content>
            <FooterSection />
        </Layout>
    )
}

export default LayoutAdmin




