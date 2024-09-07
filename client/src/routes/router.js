import Admin from '../pages/Admin'
import Auth from '../pages/Auth'
import Chapter from '../pages/Chapter'
import Favorites from '../pages/Favorites'
import Catalog from '../pages/Catalog'
import Manga from '../pages/Manga'
import Profile from '../pages/Profile'

import * as paths from './paths'


export const authRoutes = [
    {
        path: paths.ADMIN_PATH,
        element: Admin
    },
    {
        path: paths.FAVORITES_PATH,
        element: Favorites
    },
    {
        path: paths.PROFILE_PATH + '/:id',
        element: Profile
    }
]

export const publicRoutes = [
    {
        path: paths.MAIN_PATH,
        element: Catalog
    },
    {
        path: paths.LOGIN_PATH,
        element: Auth
    },
    {
        path: paths.REGISTRATION_PATH,
        element: Auth
    },
    {
        path: paths.MANGA_PATH + '/:id',
        element: Manga
    },
    {
        path: paths.CHAPTER_PATH + '/:id',
        element: Chapter
    },
]