import { Request, Response, NextFunction } from "express"
import processApiError from "../../error/processApiError"
import { Genre } from "../../entities/genre.entity"
import { Author } from "../../entities/author.entity"
import { Journal } from "../../entities/journal.entity"
import { dataSource } from "../../app-data-source"

async function findJournal(id: string): Promise<Journal | null> {
    return await dataSource.getRepository(Journal)
                            .findOne({relations: {genres: true, authors: true}
                                , where: { id }
                            })
}

export async function handleAddGenre(req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
        const genreName: string | undefined = req.body.genreName
        if (!genreName) {
            throw new Error("не указано имя жанра (\"genreName\")")
        }
        let genre: Genre | null = await dataSource.getRepository(Genre).findOneBy({name: genreName})
        if (!genre) {
            genre = await dataSource.getRepository(Genre).create({ name: genreName })
            await dataSource.getRepository(Genre).save(genre)
        }

        const journalId: string | undefined = req.body.journalId
        if (!journalId) {
            throw new Error("не указан id журнала (\"journalId\")")
        }
        const journal: Journal | null = await findJournal(journalId)
        if (!journal) {
            throw new Error("журнал не найден")
        }
        if (journal.genres.find(g => g.id === genre.id)) {
            throw new Error("этот жанр уже есть у журнала")
        }
        journal.genres.push(genre)

        await dataSource.getRepository(Journal).save(journal)
        res.json(journal)

    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}

export async function handleRemoveGenre(req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
        const genreName: string | undefined = req.body.genreName
        if (!genreName) {
            throw new Error("не указано имя жанра (\"genreName\")")
        }
        const genre: Genre | null = await dataSource.getRepository(Genre).findOneBy({name: genreName})
        if (!genre) {
            throw new Error("жанр не найден")
        }

        const journalId: string | undefined = req.body.journalId
        if (!journalId) {
            throw new Error("не указан id журнала (\"journalId\")")
        }
        const journal: Journal | null = await findJournal(journalId)
        if (!journal) {
            throw new Error("журнал не найден")
        }
        const filteredGenres: Genre[] | undefined = journal.genres?.filter(g => {
            return g.id !== genre.id
        })
        if (Array.isArray(filteredGenres)) {
            if (filteredGenres.length === journal.genres.length) {
                throw new Error("жанра у журнала не было")
            }
            journal.genres = filteredGenres;
            dataSource.getRepository(Journal).save(journal)
        }
        res.json(journal)

    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}

export async function handleAddAuthor(req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
        const authorName: string | undefined = req.body.authorName
        if (!authorName) {
            throw new Error("не указано имя автора (\"authorName\")")
        }
        let author: Author | null = await dataSource.getRepository(Author).findOneBy({ name: authorName})
        if (!author) {
            author = await dataSource.getRepository(Author).create({ name: authorName })
            await dataSource.getRepository(Author).save(author)
        }

        const journalId: string | undefined = req.body.journalId
        if (!journalId) {
            throw new Error("не указан id журнала (\"journalId\")")
        }
        const journal: Journal | null = await findJournal(journalId)
        if (!journal) {
            throw new Error("журнал не найден")
        }
        if (journal.authors.find(a => a.id === author.id)) {
            throw new Error("этот автор уже есть у журнала")
        }
        journal.authors.push(author)
        await dataSource.getRepository(Journal).save(journal)

        res.json(journal)

    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}

export async function handleRemoveAuthor(req: Request, res: Response, next: NextFunction) : Promise<void> {
    try {
        const authorName: string | undefined = req.body.authorName
        if (!authorName) {
            throw new Error("не указано имя автора (\"authorName\")")
        }
        const author: Author | null = await dataSource.getRepository(Author).findOneBy({ name: authorName })
        if (!author) {
            throw new Error("автор не найден")
        }

        const journalId: string | undefined = req.body.journalId
        if (!journalId) {
            throw new Error("не указан id журнала (\"journalId\")")
        }
        const journal: Journal | null = await findJournal(journalId)
        if (!journal) {
            throw new Error("журнал не найден")
        }
        const filteredAuthors: Genre[] | undefined = journal.authors?.filter(a => {
            return a.id !== author.id
        })
        if (Array.isArray(filteredAuthors)) {
            if (filteredAuthors.length === journal.authors.length) {
                throw new Error("автора у журнала не было")
            }
            journal.authors = filteredAuthors;
            dataSource.getRepository(Journal).save(journal)
        }
        res.json(journal)

    } catch (error: unknown) {
        processApiError(404, error, next)
    }
}