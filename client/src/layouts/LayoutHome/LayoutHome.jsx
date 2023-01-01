import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Layout, Modal as ModalAntd } from 'antd'
import Welcome from '../../pages/Welcome'
import Home from '../../pages/Home'
import MenuTop from '../../components/Web/MenuTop'
import FooterSection from '../../components/FooterSection'

import './LayoutHome.scss'

const LayoutHome = () => {
    const [blocked, setBlocked] = useState(false)
    const { Content } = Layout

    useEffect(() => {
        if (window.innerWidth <= 890) {
            setBlocked(true)

            ModalAntd.info({
                title: 'Lo siento...',
                content: (
                    <>
                        <p>Esta página aún no está lista para Smartphones o Tablets pequeñas. Por el momento sólo puedes acceder desde una pantalla más grande. Sin embargo, puedes seguir mirando la página de inicio. <p>Hasta luego.</p></p>
                        <p style={{ fontSize: '10px' }}>Subida el 27 de Septiembre de 2022.</p>

                    </>
                ),
                centered: true,
            })
        }
    }, [])

    return (
        <Layout className="layout-home">
            <MenuTop blocked={blocked} />
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