import { Link } from 'react-router-dom'
import { Menu, Button } from 'antd'
import useAuth from '../../../hooks/useAuth'
import { logout } from '../../../api/auth'

import './MenuTop.scss'
import { PoweroffOutlined } from '@ant-design/icons'

const MenuTop = () => {
    const { user, isLoading } = useAuth()

    const logoutUser = () => {
        logout()
        window.location.href = '/'
    }

    return (
        <Menu
            className="menu-top"
            mode="horizontal"
            defaultSelectedKeys={[window.location.pathname]}
        >
            {
                !user && !isLoading
                    ? (
                        <Menu.Item key="/">
                            <Link to="/">
                                Inicia sesión
                            </Link>
                        </Menu.Item>
                    )
                    : (
                        <>
                            <Menu.Item key="/">
                                <Link to="/">
                                    Inicio
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/tasks">
                                <Link to="/tasks">Tareas</Link>
                            </Menu.Item>
                            <Menu.Item key="/categories">
                                <Link to="/categories">Categorías</Link>
                            </Menu.Item>
                            <Menu.Item key="power-off" className='menu-top__right'>
                                <Button onClick={() => logoutUser()}>
                                    <PoweroffOutlined />
                                </Button>
                            </Menu.Item>
                        </>
                    )
            }
        </Menu>
    )
}

export default MenuTop