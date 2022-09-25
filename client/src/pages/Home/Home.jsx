import React from 'react'
import { Row, Col } from 'antd'
import ReactLogo from '../../assets/img/png/react-logo.png'
import NodeJSLogo from '../../assets/img/png/node-js-logo.png'
import MongoDBLogo from '../../assets/img/png/mongo-db-logo.png'
import ExpressLogo from '../../assets/img/png/express-logo-origin.png'

import './Home.scss'

const Home = () => {

    return (
        <Row className='home-admin'>
            <Col xs={1} sm={1} md={2} />
            <Col xs={22} sm={22} md={20} className='home-admin__content'>
                <Row gutter={24} className='home-admin__content__row'>
                    <Col>
                        <h2>Sobre esta App</h2>

                        <p>
                            Está construída con
                            {' '}<img src={ReactLogo} alt='React.js' width={42} /> React,
                            {' '}<img src={NodeJSLogo} alt='Node.js' width={45} /> Node,
                            {' '}<img src={ExpressLogo} alt='Express.js' width={36} /> Express,
                            {' '}<img src={MongoDBLogo} alt='MongoDB' width={45} /> MongoDB y Mongoose.
                        </p>
                        <p>La idea era hacerla más grande, con configuraciones para el usuario, cambio de contraseña, posibilidad de subir un ávatar, etc. Pero por una cuestión de tiempo, la termino acá.</p>
                        <p>La finalidad de esta aplicación web es demostrar mis conocimientos en backend y en frontend. Es mi primer aplicación hecha con el Stack MERN y con cualquier otro Stack.</p>
                        <p>Esto no quiere decir que estoy atado a este Stack, ni mucho menos. Me gusta y me resulta cada vez más cómodo a medida que lo voy usando, pero quiero seguir aprendiendo otras tecnologías en el futuro.</p>
                    </Col>
                    <div className='border'></div>
                </Row>
                <Row gutter={24} className='home-admin__content__row'>
                    <Col md={12}>
                        <Col md={24} className='home-admin__content__row-header'>
                            <h2>¿Qué características tiene?</h2>
                            <p>No muchas, pero las que tiene, funcionan:</p>
                        </Col>
                        <iframe width="560" height="315" src="https://youtube.com/embed/S3aQeCduwyY" title="TO-DO List 💻 Vista Previa 💻 React - Mongoose" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>

                    </Col>
                    <Col md={12}>
                        <Col md={24} className='home-admin__content__row-header'>
                            <h2>¿Cómo la construí?</h2>
                            <p>Muy "simple", lo explico en este video:</p>
                        </Col>
                        <iframe width="560" height="315" src="https://www.youtube.com/embed/G6HxEfz_Pz0" title="TO-DO List 💻 React - Mongoose" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen ></iframe>
                    </Col>
                </Row>
            </Col >
            <Col xs={1} sm={1} md={2} />
        </Row >
    )
}

export default Home
