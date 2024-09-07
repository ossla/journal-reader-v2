import {makeAutoObservable} from 'mobx'

class userStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        this._role = ''
        this._burgerOpen = false
        makeAutoObservable(this)
    }

    setIsAuth(bool) {
        this._isAuth = bool
    }

    setUser(user) {
        this._user = user
    }

    setRole(role) {
        this._role = role
    }

    setBurgerOpen(bool) {
        this._burgerOpen = bool
    }

    get isAuth() {
        return this._isAuth
    }

    get user() {
        return this._user
    }

    get role() {
        return this._role
    }

    get burgerOpen() {
        return this._burgerOpen
    }
}

export default userStore
