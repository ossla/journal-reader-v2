import { Genre } from "../../entities/genre.entity"
import { Author } from "../../entities/author.entity"
import { dataSource } from "../../app-data-source"
import fileUpload from "express-fileupload"
import * as fs from "fs"
import * as path from "path"
import { CustomFileType } from "../../domain"


export async function processGenres(genres: string): Promise<Genre[]> {
    let genresArr: Array<Genre> = new Array<Genre>()
    if (typeof genres === 'string' && genres.length) {
        genres = JSON.parse(genres)

        for (let i = 0; i < genres.length; i++) {
            let genre: Genre | null = await dataSource.getRepository(Genre).findOneBy({name: genres[i]})
            if (genre) {
                genresArr.push(genre)
            } else {
                const newGenre = new Genre()
                newGenre.name = genres[i]
                await dataSource.manager.save(newGenre)
                genresArr.push(newGenre)
            }
        }
    }
    return genresArr
}

export async function processAuthors(authors: string): Promise<Author[]> {
    let authorsArr: Array<Author> = new Array<Author>()
    if (typeof authors === 'string' && authors.length) {
        authors = JSON.parse(authors)
        
        for (let i = 0; i < authors.length; i++) {
            let author: Author | null = await dataSource.getRepository(Author).findOneBy({name: authors[i]})
            if (author) {
                authorsArr.push(author)
            } else {
                const newAuthor = new Author()
                newAuthor.name = authors[i]
                await dataSource.manager.save(newAuthor)
                authorsArr.push(newAuthor)
            }
        }

    }
    return authorsArr
}

export async function makeFolder(title: string, coverImg: CustomFileType): Promise<void> {
    // создание папки
    const folderName: string = title.replace(/\s/g, '_')
    const pathToPublic: string = path.join(__dirname, "..", "..", "..", "public")
    if (!fs.existsSync(pathToPublic)) {
        fs.mkdirSync(pathToPublic)
    }
    const folderPath: string = path.join(pathToPublic, folderName)
    if (fs.existsSync(folderPath)) {
        throw new Error("Произведение с таким названием уже существует")
    }
    fs.mkdirSync(folderPath)

    // перемещение обложки журнала
    if (coverImg) {
        if (Array.isArray(coverImg)) {
            throw new Error("загрузите только 1 файл")
        }
        coverImg.mv(path.join(folderPath, "cover.jpg"))
    } else {
        throw new Error("загрузите обложку")
    }
}