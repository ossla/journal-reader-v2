import React, { useContext, useEffect, useState } from 'react'
import { Context } from '.'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { authRoutes, publicRoutes } from './routes/router'
import { observer } from 'mobx-react-lite'
import NavBar from './components/NavBar'
import { check } from './http/userAPI'
import Catalog from './pages/Catalog'

const App = observer(() => {

  const { user } = useContext(Context)

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    check().then(data => {
      if (data) {
        user.setUser(data)
        user.setIsAuth(true)
        user.setRole(data.role)
      }
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div>
        <img src='loading.gif' alt='loading...' />
      </div>
    )
  }

  return (
    <Router>

      <NavBar />
      <div style={{height: '80px'}}></div>
      <Routes>
        { user.isAuth && authRoutes.map((route, index) => 
            <Route path={route.path} element={<route.element />} key={index}/>
        )}
        { publicRoutes.map((route, index) => 
            <Route path={route.path} element={<route.element />} key={index}/>
        )}

        <Route path="*" element={<Catalog />}/>
      </Routes>
    </ Router>
  )
})

export default App
