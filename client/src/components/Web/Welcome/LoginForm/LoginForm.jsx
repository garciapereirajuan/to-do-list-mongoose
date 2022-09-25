import { useState, useEffect } from 'react'
import { Form, Input, Button, Modal as ModalAntd } from 'antd'
import { openNotification } from '../../../../utils/openNotification'
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
            openNotification('error', 'Todos los campos son obligatorios.')
            return
        }

        loginUserApi(userData)
            .then(response => {
                if (response?.code !== 200 && response?.code !== 404) {
                    openNotification('error', 'Se produjo un error al iniciar sesión.')
                    return
                }
                if (response?.code === 404) {
                    openNotification('error', response.message)
                    return
                }
                if (response?.code === 200) {
                    let accessToken = response.tokens.accessToken
                    let refreshToken = response.tokens.refreshToken

                    localStorage.setItem(ACCESS_TOKEN, accessToken)
                    localStorage.setItem(REFRESH_TOKEN, refreshToken)

                    const welcome = () => {
                        openNotification('success', '¡Hola ' + userData.username + '!')
                    }

                    if (response.tokens.initial) {
                        ModalAntd.info({
                            title: `¡Hola ${userData.username}!`,
                            content: <p>Creé algunas tareas predefinidas para cada nuevo usuario. De está forma podrás ver como funciona esta aplicación más rápidamente.</p>,
                            okText: 'De acuerdo',
                            onOk() {
                                welcome()
                                window.location.href = '/tasks?init=true'
                                return
                            },
                            onCancel() {
                                welcome()
                                window.location.href = '/tasks?init=true'
                                return
                            }
                        })
                    }

                    if (!response.tokens.initial) {
                        welcome()
                        window.location.href = '/tasks'
                        return
                    }
                }
                // openNotification('error', 'Se produjo un problema al iniciar sesión.')
            })
            .catch(err => {
                openNotification('error', 'Se produjo un problema al iniciar sesión.')
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