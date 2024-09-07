import React, { useContext, useState } from 'react'
import {  } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { Context } from '..'
import { ReactComponent as HeartSvg} from '../icons/heart-svgrepo-com.svg'
import { ADMIN_PATH, FAVORITES_PATH, LOGIN_PATH, PROFILE_PATH, MAIN_PATH } from '../routes/paths'
import '../styles/nav.css'

export default function NavBar() {

  const { user } = useContext(Context)

  const [isBurgerActive, setIsBurgerActive] = useState(false)
  const styleWithBurger = isBurgerActive ? "navBurgerActive" : null

  const navigator = useNavigate()

  // Выйти
  const logOut = () => {
    user.setUser({})
    user.setIsAuth(false)
    localStorage.removeItem('token')
    navigator(LOGIN_PATH)
  }

  return (
    <div className="navBar">
      <div className="navContainer">
        <div className="navBody">

          <div className="navLogo">
            <Link to={MAIN_PATH} onClick={() => setIsBurgerActive(false)}>
              Главная
            </Link>
          </div>

          <div
            className={"navBurger " + styleWithBurger}
            onClick={() => setIsBurgerActive(!isBurgerActive)}
          >
            <span></span>
          </div>

          {
            user.isAuth ?
                <div className={"navMenu " + styleWithBurger}>
                  {
                    user.user.role === 'ADMIN' &&
                    <Link 
                      to={ADMIN_PATH}
                      className="navText"
                      onClick={() => setIsBurgerActive(false)}
                    >
                      Админ панель
                    </Link>
                  }
                  <Link
                    to={FAVORITES_PATH}
                    onClick={() => setIsBurgerActive(false)}
                  >
                    <HeartSvg className="navIconHeart"/>
                  </Link>
                  <Link
                    to={LOGIN_PATH}
                    className="navText"
                    onClick={() => { logOut(); setIsBurgerActive(false) }}
                  >
                    Выйти
                  </Link>
                  <Link 
                    to={PROFILE_PATH + "/" + user.user.id}
                    className="navText"
                    onClick={() => setIsBurgerActive(false)}
                  >
                    Профиль
                  </Link>
                </div>
                :
                <div className={"navMenu " + styleWithBurger}>
                  <Link to={LOGIN_PATH} 
                    className="navText"
                    onClick={() => setIsBurgerActive(false)}
                  >
                    Войти
                  </Link>
                </div>
          }
        </div>
      </div>
    </div>
)}
