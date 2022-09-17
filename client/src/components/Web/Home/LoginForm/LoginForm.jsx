import { useState, useEffect } from 'react'
import { Form, Input, Button, notification } from 'antd'
import { UserOutlined, LockFilled } from '@ant-design/icons'
import { loginUserApi } from '../../../../api/user'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../../../utils/constants'

import "./LoginForm.scss"

const LoginForm = ({ setIsVisibleModal }) => {
    const [userData, setUserData] = useState({})

    useEffect(() => {
        setUserData({
            username: '',
            password: '',
        })
    }, [setUserData])

    const login = () => {
        const { username, password } = userData

        if (!username || !password) {
            notification['error']({ message: 'Todos los campos son obligatorios' })
            return
        }

        loginUserApi(userData)
            .then(response => {
                if (response?.code === 200) {
                    let accessToken = response.tokens.accessToken
                    let refreshToken = response.tokens.refreshToken

                    localStorage.setItem(ACCESS_TOKEN, accessToken)
                    localStorage.setItem(REFRESH_TOKEN, refreshToken)

                    notification['success']({ message: '¡Hola ' + userData.username + '!' })
                    window.location.href = '/tasks'
                    return
                }
                if (response.message) {
                    notification['error']({
                        message: response.message
                    })
                    return
                }
                notification['error']({
                    message: 'Se produjo un problema al iniciar sesión.'
                })
            })
            .catch(err => {
                notification['error']({
                    message: 'Se produjo un problema al iniciar sesión.'
                })
                console.log('Problema al iniciar sesión: ' + err)
            })


    }

    return (
        <div className="login-form-div">
            <div className="login-form-div__header">
                <h3>Inicia sesión</h3>
                <h4>Crea y organiza tus tareas</h4>
            </div>
            <Form className="login-form" onFinish={login}>
                <Form.Item>
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Nombre de usuario"
                        value={userData.username}
                        onChange={e => setUserData({ ...userData, username: e.target.value })}
                    />
                </Form.Item>
                <Form.Item>
                    <Input
                        prefix={<LockFilled />}
                        placeholder="Contraseña"
                        type="password"
                        value={userData.password}
                        onChange={e => setUserData({ ...userData, password: e.target.value })}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" className='btn-submit'>
                        Ingresar
                    </Button>
                </Form.Item>
                <div className='login-form__parraf'>
                    ¿No tienes cuenta? Crea una
                </div>
                <Form.Item>
                    <Button type="default" onClick={() => setIsVisibleModal(true)} className='btn-register'>
                        Registrarme
                    </Button>
                </Form.Item>
            </Form>
        </div >
    )
}

export default LoginForm