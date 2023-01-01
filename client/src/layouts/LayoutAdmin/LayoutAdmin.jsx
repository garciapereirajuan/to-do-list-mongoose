import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout, Modal as ModalAntd } from 'antd'
import { welcomeApi } from '../../api/welcome'
import { getAccessTokenApi } from '../../api/auth'
import { showUserApi } from '../../api/user'
import MenuTop from '../../components/Web/MenuTop'
import FooterSection from '../../components/FooterSection'
import Home from '../../pages/Home'
import Tasks from '../../pages/Admin/Tasks'
import Categories from '../../pages/Admin/Categories'
import useAuth from '../../hooks/useAuth'
import ToDoLogo from '../../assets/img/png/to-do-logo-orange.png'
import { LoadingOutlined } from '@ant-design/icons'

import './LayoutAdmin.scss'

const LayoutAdmin = () => {
    const [expireToken, setExpireToken] = useState(false)
    const [welcomeFinish, setWelcomeFinish] = useState(false)
    const [reloadAlert, setReloadAlert] = useState(true)
    const { user } = useAuth()
    const { Content } = Layout

    useEffect(() => {
        if (expireToken) {
            window.location.reload()
        }
    }, [expireToken, user])

    useEffect(() => {
        const token = getAccessTokenApi()

        user && showUserApi(token, user.id)
            .then(response => {
                if (!response?.user.initial) {
                    return
                }
                if (response?.code !== 200) {
                    // openNotification('error', 'Lo siento, se produjo un error, por favor recarga la página.', 30)
                    // openNotification('info', 'Si sigues viendo este cartel, ¿podrías comunicarmelo?. Muchas gracias 🙃', 30)
                    window.location.reload()
                    console.log('Error al encontrar el usuario', response)
                    return
                }
                const styleModal = {
                    letterSpacing: '2px'
                }

                const modal = ModalAntd.success({
                    title: <p style={styleModal}><strong>Cargando...</strong></p>,
                    centered: true,
                    duration: 0,
                    content: (
                        <>
                            <p>Creando tus nuevas Tareas y Categorías.</p>
                            <p>Este cartel se cerrará cuando todo esté listo.</p>
                            <p><LoadingOutlined /> Por favor, espera...</p>
                        </>
                    )
                })

                welcomeApi(token, user.id)
                    .then(response => {
                        if (response?.code === 200) {
                            setWelcomeFinish(true)
                            modal.update({
                                title: <p style={styleModal}><strong>¡Todo listo!</strong></p>,
                                content: (
                                    <>
                                        <p>Tus Tareas y Categorías de prueba han sido creadas.</p>
                                        <p>Hasta luego.</p>
                                    </>
                                )
                            })
                            setTimeout(() => modal.destroy(), 6500)

                            return
                        }
                        if (response?.code === 204) {
                            return
                        }
                        console.log('Error en Welcome')
                        return
                    })
                    .catch(err => console.log('Error en Welcome', err))

            })
            .catch(err => console.log('Error al comprobar la prop Initial del usuario.', err))
    }, [user])

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
                            welcomeFinish={welcomeFinish}
                            setWelcomeFinish={setWelcomeFinish}
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
                            welcomeFinish={welcomeFinish}
                            setWelcomeFinish={setWelcomeFinish}
                        />
                    } />
                </Routes>
            </Content>
            <FooterSection />
        </Layout>
    )
}

export default LayoutAdmin




