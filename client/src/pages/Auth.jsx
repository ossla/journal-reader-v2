import React, { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite';
import { Form, Button } from 'react-bootstrap';
import { registration, login } from '../http/userAPI'
import { Context } from '..';
import { Alert } from 'react-bootstrap';
import { LOGIN_PATH, REGISTRATION_PATH } from '../routes/paths';
import { ReactComponent as InfoSvg} from '../icons/information.svg';

const Auth = observer(() => {

  const { user } = useContext(Context)

  const [visiblePassword, setVisiblePassword] = useState(false)
  const [nickName, setNickName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [showMessage, setShowMessage] = useState('')

  const navigator = useNavigate()

  const location = useLocation()
  const islogin = location.pathname === LOGIN_PATH

  const click = async() => {
    try {
      let data;
      if (islogin) {
        data = await login(email, password)
      }
      else {
        data = await registration(nickName, email, password)
      }
      user.setUser(data)
      user.setRole(data.role)
      user.setIsAuth(true)
      navigator('/')

    } catch (error) {
      setShow(true)
      setShowMessage(error.response.data.message)
    }
  }

  return (
    <div className="formContainer">
      <Form className="form">

        <p className="formTitle">{islogin ? 'Авторизация' : 'Регистрация'}</p>

        { show &&
          <Alert key='danger' variant='danger' onClose={() => setShow(false)} dismissible>
            {showMessage}
          </Alert>
        }

        {!islogin && 
        <Form.Group className='formElement'>
          <Form.Label>Никнейм</Form.Label>
          <Form.Control
            type='text'
            value={nickName}
            onChange={(e) => setNickName(e.target.value)}
            className="formControl"
          />
          {/* info_sign class in the admin.css */}
          <p className='info_text'>
            <InfoSvg className='info_sign'/>
            Это имя будет отображаться в сети
          </p>
        </Form.Group>
        }
        
        <Form.Group className='formElement'>
          <Form.Label>Email почта</Form.Label>
          <Form.Control
            type='email'
            placeholder="Ваша почта..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="formControl"
          /> 
        </Form.Group>

        <Form.Group className='formElement'>
          <Form.Label>Пароль</Form.Label>
          <div className="formPassword">
            <Form.Control
              type={visiblePassword ? 'text' : 'password'}
              placeholder="Ваш пароль..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="formControl"
            />
            {visiblePassword ?
            // закрыть
            <img className='formEye' alt='visible' src="icons/opeye.png" onClick={() => setVisiblePassword(false)}/>
            :
            // открыть
            <img className='formEye' alt='visible' src="icons/cleye.png" onClick={() => setVisiblePassword(true)}/>
            }
          </div>
        </Form.Group>

        <div className="formNavigate">
          {islogin ?
          <div>Ещё нет аккаунта? <span
              onClick={() => {navigator(REGISTRATION_PATH); setShow(false)}}
            >
                Зарегестрироваться
            </span>
          </div>
          :
          <div>Уже есть аккаунт? <span 
              onClick={() => {navigator(LOGIN_PATH); setShow(false)}}
            > 
              Авторизоваться
            </span>
          </div>
          }
          <Button
            variant='outline-success'
            className='ml-2'
            onClick={click}
          >
            {islogin ? 'Войти' : 'Зарегистрироваться'}
          </Button>
        </div>

      </Form>
    </div>
  )
})

export default Auth
