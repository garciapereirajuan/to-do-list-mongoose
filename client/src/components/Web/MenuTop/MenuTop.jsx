import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { Menu, Button } from 'antd'
import useAuth from '../../../hooks/useAuth'
import { logout } from '../../../api/auth'

import './MenuTop.scss'
import { PoweroffOutlined } from '@ant-design/icons'

const MenuTop = ({ blocked }) => {
    const { user, isLoading } = useAuth()
    const location = useLocation()

    const logoutUser = () => {
        logout()
        window.location.href = '/'
    }

    if (blocked) {
        return (
            <Menu
                className="menu-top"
                mode="horizontal"
                defaultSelectedKeys={[location.pathname]}
            >
                <Menu.Item key="/">
                    <Link to="/">
                        Inicio
                    </Link>
                </Menu.Item>
            </Menu>
        )
    }

    return (
        <Menu
            className="menu-top"
            mode="horizontal"
            defaultSelectedKeys={[location.pathname]}
        >
            {
                !user && !isLoading
                    ? (
                        <>
                            <Menu.Item key="/">
                                <Link to="/">
                                    Inicio
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="/login">
                                <Link to="/login">
                                    Inicia sesión
                                </Link>
                            </Menu.Item>
                        </>
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
                            <Menu.Item
                                key="power-off"
                                className='menu-top__right'
                                onClick={() => logoutUser()}
                            >
                                <div title='Cerrar sesión' >
                                    <PoweroffOutlined />
                                </div>
                            </Menu.Item>
                        </>
                    )
            }
        </Menu>
    )
}

export default MenuTop