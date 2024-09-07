import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import mangaStore from './store/mangaStore'
import userStore from './store/userStore'
import './styles/index.css'
import './styles/manga.css'
import './styles/admin.css'
import './styles/user.css'

export const Context = React.createContext(null)

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <Context.Provider
    value={
      {
        user: new userStore(),
        manga: new mangaStore()
      }
    }
  >
    <App />
  </Context.Provider>
)