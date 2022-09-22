import { BrowserRouter as Router } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import useAuth from './hooks/useAuth'
import LayoutHome from './layouts/LayoutHome'
import LayoutAdmin from './layouts/LayoutAdmin'
import esES from 'antd/es/locale/es_ES';

import './App.scss'

function App() {
  const { user, isLoading } = useAuth()

  if (!user && !isLoading) {
    return (
      <div className="App">
        <ConfigProvider locale={esES}>
          <Router>
            <LayoutHome />
          </Router>
        </ConfigProvider>
      </div>
    )
  }

  return (
    <div className="App">
      <ConfigProvider locale={esES}>
        <Router>
          <LayoutAdmin />
        </Router>
      </ConfigProvider>
    </div>
  )
}

export default App
