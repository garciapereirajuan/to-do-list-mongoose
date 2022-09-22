import { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import Modal from '../../components/Modal'
import LoginForm from '../../components/Web/Home/LoginForm'
import SignUpForm from '../../components/Web/Home/SignUpForm/SignUpForm'
import ToDoLogo from '../../assets/img/png/to-do-logo-orange.png'
import { Row, Col } from 'antd'

import './Home.scss'

const Home = ({ setExpireToken }) => {
    const [isVisibleModal, setIsVisibleModal] = useState(false)
    const { user, isLoading } = useAuth()

    return (
        <Row className="home">
            <Col md={16} className='home__col col-login-form'>
                {
                    !user && !isLoading
                        ? <LoginForm setIsVisibleModal={setIsVisibleModal} />
                        : (<p style={{ color: 'white' }}>Otras apps...</p>)

                }
            </Col>
            <Col md={8} className='home__col col-img'>
                <img width={300} src={ToDoLogo} alt="Logo-to-do-list" />
            </Col>
            <Modal
                isVisibleModal={isVisibleModal}
                setIsVisibleModal={setIsVisibleModal}
                modalTitle='Nuevo usuario'
            >
                <SignUpForm
                    setIsVisibleModal={setIsVisibleModal}
                />
            </Modal>
        </Row >
    )
}

export default Home