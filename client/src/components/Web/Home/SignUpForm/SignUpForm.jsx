import { useState, useEffect } from 'react'
import { Form, Input, Button, Checkbox, notification } from 'antd'
import { UserOutlined, LockFilled } from '@ant-design/icons'
import { createUserApi } from '../../../../api/user'
import formClassManager from '../../../../utils/formClassManager'
import { minLength } from '../../../../utils/validationsForm'

import "./SignUpForm.scss"

const SignUpForm = ({ setIsVisibleModal }) => {
    const [userData, setUserData] = useState({})
    const [inputsValid, setInputsValid] = useState({
        username: false,
        password: false,
        repeatPassword: false,
        privacyPolicy: false,
    })

    useEffect(() => {
        setUserData({
            username: '',
            privacyPolicy: false,
        })
    }, [setUserData])

    const changeForm = (e) => {
        const { name, value, checked } = e.target

        if (name === 'privacyPolicy') {
            setUserData(userData => ({ ...userData, privacyPolicy: checked }))
            return
        }
        setUserData(userData => ({ ...userData, [name]: value }))
    }

    const inputValidation = (e) => {
        const { name, value, checked } = e.target

        if (name === 'username') {
            setInputsValid({ ...inputsValid, [name]: minLength(e.target, 4) })
        }
        if (name === 'password') {
            setInputsValid({ ...inputsValid, [name]: minLength(e.target, 6) })
        }
        if (name === 'privacyPolicy') {
            setInputsValid({ ...inputsValid, [name]: checked })
        }

        if (name === 'repeatPassword') {
            setInputsValid({ ...inputsValid, [name]: minLength(e.target, 6) })

            if (inputsValid.repeatPassword) {
                formClassManager('all', 'input', 'remove', null)
                formClassManager('all', 'wrapper', 'remove', null)

                if (value !== userData.password) {
                    formClassManager(name, 'input', 'add', 'error-input')
                    formClassManager(name, 'wrapper', 'add', 'error-wrapper')
                } else {
                    formClassManager(name, 'input', 'add', 'success-input')
                    formClassManager(name, 'wrapper', 'add', 'success-wrapper')
                }
            }
        }

        // PARA EL FUTURO
        // validationEmail se encuentra en utils/validationEmail.js

        // if (name === 'email') {
        //     setInputsValid({ ...inputsValid, [name]: validationEmail(e.target) })
        // }
    }

    const signUp = () => {
        const { password, repeatPassword, privacyPolicy } = userData

        if (!inputsValid.username) {
            notification['error']({ message: 'El nombre de usuario debe tener 4 o más caracteres.' })
            return
        }
        if (!inputsValid.password) {
            notification['error']({ message: 'La contraseña debe tener 6 o más caracteres.' })
            return
        }
        if (password !== repeatPassword) {
            notification['error']({ message: 'Las contraseñas deben coincidir.' })
            return
        }
        if (!privacyPolicy) {
            notification['error']({ message: 'Debes aceptar la política de privacidad.' })
            return
        }

        createUserApi(userData)
            .then(response => {
                let status = response.code === 200 ? 'success' : 'error'
                notification[status]({ message: response.message })

                if (response.code === 200) {
                    setIsVisibleModal(false)
                    setUserData({})
                }
            })
            .catch(err => {
                notification['error']({ message: 'Error interno, intenta más tarde' })
            })
    }

    return (
        <div className="sign-up-form-div">
            <Form className="sign-up-form" onChange={changeForm} onFinish={signUp}>
                <Form.Item className='username'>
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Nombre de usuario"
                        name="username"
                        value={userData.username}
                        onChange={inputValidation}
                    />
                </Form.Item>
                <Form.Item className='password'>
                    <Input
                        prefix={<LockFilled />}
                        placeholder="Contraseña"
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={inputValidation}
                    />
                </Form.Item>
                <Form.Item className='repeatPassword'>
                    <Input
                        prefix={<LockFilled />}
                        placeholder="Repetir contraseña"
                        type="password"
                        name="repeatPassword"
                        value={userData.repeatPassword}
                        onChange={inputValidation}
                    />
                </Form.Item>
                <Form.Item className='privacyPolicy'>
                    <Checkbox
                        name='privacyPolicy'
                        checked={userData.privacyPolicy}
                        onChange={inputValidation}
                    >
                        He leído y acepto la política de privacidad
                    </Checkbox>
                </Form.Item>
                <Form.Item className='submit'>
                    <Button type="primary" htmlType="submit" className='btn-submit'>
                        Registrarse
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default SignUpForm