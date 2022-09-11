import { useState } from 'react'
import LoginForm from '../../components/Web/Home/LoginForm'
import SignUpForm from '../../components/Web/Home/SignUpForm/SignUpForm'
import Modal from '../../components/Modal'
import ToDoLogo from '../../assets/img/png/to-do-logo.png'
import useAuth from '../../hooks/useAuth'

import './Home.scss'

const Home = () => {
    const [isVisibleModal, setIsVisibleModal] = useState(false)
    // const [modalTitle, setModalTitle] = useState('')
    // const [modalContent, setModalContent] = useState(null)
    const { user, isLoading } = useAuth()

    return (
        <div className="home">
            {
                !user && !isLoading
                    ? <LoginForm setIsVisibleModal={setIsVisibleModal} />
                    : (<p style={{ color: 'white' }}>Otras apps...</p>)

            }
            <img width={400} src={ToDoLogo} alt="Logo-to-do-list" />
            <Modal
                isVisibleModal={isVisibleModal}
                setIsVisibleModal={setIsVisibleModal}
                modalTitle='Nuevo usuario'
            >
                <SignUpForm
                    setIsVisibleModal={setIsVisibleModal}
                />
            </Modal>
        </div>
    )
}

export default Home