import axios from "axios";
// для всех:
export const $host = axios.create({baseURL: process.env.REACT_APP_API_URL, responseType: 'json'})
// для авторизованых:
export const $authHost = axios.create({baseURL: process.env.REACT_APP_API_URL, responseType: 'json'})

function authInterceptor(config) {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`
    return config
}

$authHost.interceptors.request.use(authInterceptor)
