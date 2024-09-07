import {makeAutoObservable} from 'mobx'


class mangaStore {
    constructor() {
        this._count = 0
        this._manga = []
        this._countries = []
        this._years = []
        this._genres = []
        this._selectedCountry = {}
        this._selectedYear = {}
        this._page = 1
        this._limit = 5
        makeAutoObservable(this)
    }

    setManga(manga) {
        this._manga = manga
    }
    
    setCountries(countries) {
        this._countries = countries
    }
    
    setYears(years) {
        this._years = years
    }
    
    setGenres(genres) {
        this._genres = genres
    }

    setSelectedCountry(country) {
        this._page = 1
        this._selectedCountry = country
    }
    
    setSelectedYear(year) {
        this._page = 1
        this._selectedYear = year
    }

    setPage(page) {
        this._page = page
    }

    setLimit(limit) {
        this._limit = limit
    }

    setCount(count) {
        this._count = count
    }
    
    get manga() {
        return this._manga
    }

    get countries() {
        return this._countries
    }

    get years() {
        return this._years
    }

    get genres() {
        return this._genres
    }

    get selectedCountry() {
        return this._selectedCountry
    }

    get selectedYear() {
        return this._selectedYear
    }

    get page() {
        return this._page
    }

    get limit() {
        return this._limit
    }

    get count() {
        return this._count
    }
}

export default mangaStore
