import React, { useEffect, useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { changePhoto, findOne } from '../http/userAPI'
import { useParams } from 'react-router-dom'
import { Context } from '..'

const Profile = observer(() => {

  const { user } = useContext(Context)
  const { id } = useParams()

  const [file, setFile] = useState(null)
  const [person, setPerson] = useState(null)
  const isMe = user.user.id + '' === id
  const [load, setLoad] = useState(true)
  const [photo, setPhoto] = useState('/empty_user_photo.png')

  useEffect(() => {
    findOne(id)
      .then(({data}) => {
        setPerson(data)
        if (data.photo !== 'none') {
          setPhoto(process.env.REACT_APP_API_URL + '/' + data.photo)
        }
        setLoad(false)
      })
  }, [])

  const ChangePhoto = async () => {
    try {
      let formData = new FormData()
      formData.append('id', id)
      formData.append('photo', file)
      
      await changePhoto(formData)
        .then()

      window.location.reload()
    } catch (error) {
      alert(error.response.data.message)
    }
  } 

  if (load) {
    return (
      <img src="/loading.gif" alt="loading..." />
    )
  }

  if (!load && person === null) {
    return (
      <div>что-то пошло не так \:</div>
    )
  }

  return (
    <div className='profile_container'>
      <div className="profile_body">
        <div className='profile_photo_container'>
          <img src={photo} alt="photo" className='profile_photo' />
          { isMe &&
          <>
          <label htmlFor="file-upload" className="profile_button">
            Изменить фото...
          </label>
          <input
            type="file"
            id='file-upload'
            onChange={(e) => setFile(e.target.files[0])}
            access='image/png, image/jpeg, image/jpg'
          />
          {
            file !== null &&
            <div className="chosen_file">
              <p className='profile_upload_file_name'>{file.name + ''}</p>
              <button onClick={ChangePhoto}>Изменить</button>
            </div>

          }
          </>
          }
        </div>
        <div className='profile_text'>
          {/* имя юзера */}
          <p className='profile_user_name'>{person.name}</p>
          {/* почта */}
          { isMe ?
          <p className='profile_user_email'>{person.email}</p>
          :
          <p className='profile_user_email'>{person.email[0] + person.email.replace(/.+?(?=@)/g, '...')}</p>
          }
          {/* его статус */}
          <p>Статус пользователя: {person.role}</p>
          {/* дата регистрации */}
          <p>Зарегистрирован от: {person.createdAt.split('').splice(0, 10)}</p>
        </div>
      </div>
    </div>
  )
})
export default Profile