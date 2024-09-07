import {$host, $authHost} from '.'
import jwt_decode from 'jwt-decode'

export async function registration(name, email, password) {
    const response = await $host.post(
        'api/user/registration',
        { name, email, password, role: "user" }
    )
    localStorage.setItem('token', response.data)
    return jwt_decode(response.data)
}

export async function login(email, password) {
    const response = await $host.post(
        'api/user/login',
        { email, password }
    )
    localStorage.setItem('token', response.data)
    return jwt_decode(response.data)
}

export async function check(email, password) {
    try {
        const response = await $authHost.get(
            'api/user/check'
        )
        localStorage.setItem('token', response.data)
        return jwt_decode(response.data)
    } catch (error) {
        console.log(error.message);
    }
}

export async function changePhoto(formData) {
    const response = await $authHost.post(
        'api/user/changephoto',
        formData
    )
    return response
}

export async function findOne(id) {
    const response = await $host.get(
        'api/user/findOne',
        {params: {id}}
    )
    return response
}
