import { $authHost, $host } from ".";

// country
export const createCountry = async (name) => {
    const response = await $authHost.post(
        'api/country',
        {name}
    )
    return response
}

export const fetchCountries = async () =>{
    const response = await $host.get('api/country')
    return response
}

export const fetchOneCountry = async (id) => {
    const response = await $host.get('api/country/' + id)
    return response
}

export const destroyCountry = async (id) => {
    await $authHost.post(
        'api/country/destroy',
        {id}
    )
}

// year
export const createYear = async (name) => {
    const response = await $authHost.post(
        'api/year',
        {name}
    )
    return response
}

export const fetchYears = async () => {
    const response = await $host.get('api/year')
    return response
}

export const fetchOneYear = async (id) => {
    const response = await $host.get('api/year/' + id)
    return response
}

export const destroyYear = async (id) => {
    await $authHost.post(
        'api/year/destroy',
        { id }
    )
}

// manga
export const createManga = async (formData) => {
    const response = await $authHost.post(
        'api/manga',
        formData
    )
    return response
}

export const fetchManga = async (countryId, yearId, page, limit) => {
    const response = await $host.get(
        'api/manga',
        {params: {countryId, yearId, page, limit}}
    )
    return response
}

export const fetchOneManga = async (id) => {

    const response = await $host.get(
        'api/manga/' + id
    )
    return response
}

export const destroyManga = async (id) => {
    await $authHost.post(
        'api/manga/destroy',
        {id}
    )
}

// chapter
export const createChapter = async (formData) => {
    const response = await $authHost.post(
        'api/chapter',
        formData
    )
    return response
}

export const fetchChapters = async (mangaId) => {

    const response = await $host.get(
        'api/chapter',
        {params: {mangaId}}
    )
    return response
}

export const fetchOneChapter = async (id) => {

    const response = await $host.get(
        'api/chapter/' + id,
    )
    return response
}

export const destroyChapter = async (id) => {
    await $authHost.post(
        'api/chapter/destroy',
        {id}
    )
}

// rating
export const createRate = async (userId, mangaId, rate) => {

    const response = await $authHost.post(
        'api/rating',
        {userId, mangaId, rate}
    )
    return response
}

export const changeRate = async (userId, mangaId, rate) => {

    const response = await $authHost.post(
        'api/rating/change',
        {userId, mangaId, rate}
    )
    return response
}

export const fetchRates = async (mangaId) => {

    const response = await $host.get(
        'api/rating',
        {params: {mangaId}}
    )
    return response
}

// favorites
export const createFavorite = async (userId, mangaId) => {

    const response = await $authHost.post(
        'api/favorite',
        {userId, mangaId}
    )
    return response
}

export const destroyFavorite = async (userId, mangaId) => {

    const response = await $authHost.post(
        'api/favorite/destroy',
        {userId, mangaId}
    )
    return response
}

export const fetchOneFavorite = async (userId, mangaId) => {

    const response = await $host.get(
        'api/favorite/one',
        {params: {userId, mangaId}}
    )
    return response
}

export const fetchFavorites = async (userId) => {

    const response = await $host.get(
        'api/favorite',
        {params: {userId}}
    )
    return response
}
