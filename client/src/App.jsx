import { useEffect } from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import useAuth from './hooks/useAuth'
import LayoutHome from './layouts/LayoutHome'
import LayoutAdmin from './layouts/LayoutAdmin'

import 'antd/dist/antd.min.css'
import './App.scss'

function App() {
  const { user, isLoading } = useAuth()

  console.log(user, isLoading)

  if (!user && !isLoading) {
    return (
      <div className="App">
        <Router>
          <LayoutHome />
        </Router>
      </div>
    )
  }

  return (
    <div className="App">
      <Router>
        <LayoutAdmin />
      </Router>
    </div>
  )
}

export default App
