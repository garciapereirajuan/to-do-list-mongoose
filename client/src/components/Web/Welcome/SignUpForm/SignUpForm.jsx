import { useState, useEffect } from 'react'
import { Form, Input, Button, Checkbox } from 'antd'
import { openNotification } from '../../../../utils/openNotification'
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

        if (name === 'username') {
            setUserData(userData => ({ ...userData, username: transformUsername(value) }))
            return
        }
        if (name === 'privacyPolicy') {
            setUserData(userData => ({ ...userData, privacyPolicy: checked }))
            return
        }
        if (name === 'password' || name === 'repeatPassword') {
            setUserData(userData => ({ ...userData, [name]: transformPassword(value) }))
            return
        }
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
            formClassManager('repeatPassword', 'input', 'remove', null)
            formClassManager('repeatPassword', 'wrapper', 'remove', null)

            if (value !== userData.password) {
                formClassManager('repeatPassword', 'input', 'add', 'error-input')
                formClassManager('repeatPassword', 'wrapper', 'add', 'error-wrapper')
                console.log(userData.repeatPassword, userData.password)
            } else if (minLength(e.target, 6)) {
                formClassManager('repeatPassword', 'input', 'add', 'success-input')
                formClassManager('repeatPassword', 'wrapper', 'add', 'success-wrapper')
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
            openNotification('error', 'El nombre de usuario debe tener 4 o más caracteres.')
            return
        }
        if (!inputsValid.password) {
            openNotification('error', 'La contraseña debe tener 6 o más caracteres.')
            return
        }
        if (password !== repeatPassword) {
            openNotification('error', 'Las contraseñas deben coincidir.')
            return
        }
        if (!privacyPolicy) {
            openNotification('error', 'Debes aceptar la política de privacidad.')
            return
        }

        createUserApi(userData)
            .then(response => {
                let status = response.code === 200 ? 'success' : 'error'
                openNotification(status, response.message)
                if (response.code !== 200) {
                    return
                }

                if (response.code === 200) {
                    setIsVisibleModal(false)
                    setUserData({})
                }
            })
            .catch(err => {
                openNotification('error', 'Error interno, intenta más tarde')
            })
    }

    return (
        <div className="sign-up-form-div">
            <Form className="sign-up-form" onChange={changeForm} onFinish={signUp}>
                <Form.Item className='username'>
                    <Input
                        prefix={<UserOutlined />}
                        placeholder="Nombre de usuario (4 caracteres o más)"
                        name="username"
                        value={userData.username}
                        onChange={inputValidation}
                    />
                </Form.Item>
                <Form.Item className='password'>
                    <Input
                        prefix={<LockFilled />}
                        placeholder="Contraseña (6 caracteres o más)"
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

const transformPassword = text => {
    let textPassword = text.replace(/[' ']/g, '')
    return textPassword
}

const transformUsername = text => {
    let textUsername = text.replace(/[^0-9A-Za-z-]/g, '-').replace(/-+/g, '-')

    if (/[' ']/g.test(text)) {
        openNotification('info', 'Los espacios no se permiten, pero puedes reemplazarlos por guiones (-).')
        return textUsername
    }
    if (/[^0-9A-Za-z-]/g.test(text)) {
        openNotification('info', 'Sólo se permiten letras, números y guiones (-).')
        return textUsername
    }
    return textUsername
}

export default SignUpForm