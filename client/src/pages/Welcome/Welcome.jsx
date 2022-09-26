import { useState } from 'react'
import useAuth from '../../hooks/useAuth'
import Modal from '../../components/Modal'
import LoginForm from '../../components/Web/Welcome/LoginForm'
import SignUpForm from '../../components/Web/Welcome/SignUpForm/SignUpForm'
import ToDoLogo from '../../assets/img/png/to-do-logo-orange.png'
import { Row, Col, Modal as ModalAntd } from 'antd'

import './Welcome.scss'
import { useEffect } from 'react'

const Welcome = ({ setExpireToken }) => {
    const [isVisibleModal, setIsVisibleModal] = useState(false)
    const { user, isLoading } = useAuth()

    useEffect(() => {
        isVisibleModal && ModalAntd.info({
            centered: true,
            title: 'Registro de usuario',
            autoFocusButton: 'ok',
            content: (
                <>
                    <p>Al ser una aplicación de prueba, podrás registrarte simplemente con un nombre de usuario. La contraseña se guarda encriptada y si la olvidas no habrá forma de recuperarla.</p>
                    <p>Hasta luego.</p>
                    {/* <p>Esta aplicación no requiere ningún tipo de información personal, y sólo almacena las Tareas y Categorías que generará el usuario, con el fin de darle el funcionamiento para lo que fue creada. </p> */}
                </>
            ),
            okText: 'De acuerdo',

        })
    })

    return (
        <Row className="welcome">
            <Col md={11} className='welcome__col col-login-form'>
                {
                    !user && !isLoading
                        ? <LoginForm setIsVisibleModal={setIsVisibleModal} />
                        : (<p style={{ color: 'white' }}>Otras apps...</p>)

                }
            </Col>
            <Col md={2} />
            <Col md={11} className='welcome__col col-img'>
                <div>
                    <img width={300} src={ToDoLogo} alt="Logo-to-do-list" />
                </div>
            </Col>
            <Modal
                classes='form-welcome'
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

export default Welcome