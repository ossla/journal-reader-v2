import { NextFunction, Request, Response } from "express"
import fileUpload from "express-fileupload"
import * as fs from "fs"
import * as path from "path"

import { dataSource } from "../app-data-source"
import { Journal } from "../entities/journal.entity"
import processApiError from "../error/processApiError"
import { handleFilterData } from "./journalServices/filterJournals"
import { makeFolder, processGenres, processAuthors }
        from "./journalServices/journalCreation"
import { handleAddAuthor, handleAddGenre, 
        handleRemoveAuthor, handleRemoveGenre } 
        from "./journalServices/editGenresAuthors"
import { CustomFileType } from "../domain"


class journalController {
    async create(req: Request, res: Response, next: NextFunction) : Promise<void> {
        try {
            const {title, status, description} = req.body
            const year: number = req.body.year

            if (!title || !year || !status || !description) 
                throw new Error('нужно заполнить все обязательные поля')

            try {
                const coverImg: CustomFileType = req.files?.coverImg
                makeFolder(title, coverImg)
            } catch (e: unknown) {
                processApiError(404, e, next);
            }

            const journal = new Journal()
            journal.title = title
            journal.description = description
            journal.status = status
            journal.year = year

            // Жанры, как и авторы, будут приходить 
            // в формате json {genres: '["жанр 1", "жанр 2"]', ...}
            let genres: string | undefined = req.body.genres
            journal.genres = []
            if (genres) {
                journal.genres = await processGenres(genres)
            }
            let authors: string | undefined = req.body.authors
            journal.authors = []
            if (authors) { 
                journal.authors = await processAuthors(authors)
            }

            await dataSource.manager.save(journal)
            res.json(journal)

        } catch (error: unknown) {
            processApiError(404, error, next)
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) : Promise<void> {
        try { // journalId
            const journalId: string = req.body.journalId
            const journal: Journal | null = await dataSource.getRepository(Journal)
                                        .findOne({where: {id: journalId}})
            if (!journal) throw new Error('журнала с таким id не существует')
            const journalFolderName: string = journal.title.replace(/\s/g, '_')

            // удаление файлов
            const pathToJournal: string = path.join(__dirname, '..', '..', 'public', journalFolderName)
            fs.rmSync(pathToJournal, { recursive: true, force: true })
            if (fs.existsSync(pathToJournal)) {
                throw new Error("ошибка в удалении папки")
            }
            await dataSource.getRepository(Journal).delete({ id: journalId })

            res.json({message: 'deleted successfully'})

        } catch (error: unknown) {
            processApiError(404, error, next)
        }
    }


    async getOne(req: Request, res: Response, next: NextFunction) : Promise<void> {
        try {
            const journalId: string = req.params.journalId
            const journal: Journal | null = await dataSource.getRepository(Journal)
                                    .findOne({
                                            where: {id: journalId},
                                            relations: {genres: true, authors: true, chapters: true}
                                    })
            if (!journal) throw new Error('журнал не найден')

            res.json(journal)

        } catch (error: unknown) {
            processApiError(404, error, next)
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) : Promise<void> {
        try {
            const page: number = Number(req.query.page) || 1
            const limit: number = Number(req.query.limit) || 9
            const offset = limit * (page - 1)
            const journals: Journal[] = await dataSource.getRepository(Journal)
                                .find({
                                    relations: {genres: true, authors: true, chapters: true},
                                    skip: offset,
                                    take: limit
                                })
            res.json(journals)

        } catch (error: unknown) {
            processApiError(404, error, next)
        }
    }

    async getFilterData(req: Request, res: Response, next: NextFunction) : Promise<void> {
        handleFilterData(req, res, next)
    }

    async addGenre(req: Request, res: Response, next: NextFunction) : Promise<void> {
        handleAddGenre(req, res, next)
    }

    async removeGenre(req: Request, res: Response, next: NextFunction) : Promise<void> {
        handleRemoveGenre(req, res, next)
    }

    async addAuthor(req: Request, res: Response, next: NextFunction) : Promise<void> {
        handleAddAuthor(req, res, next)
    }

    async removeAuthor(req: Request, res: Response, next: NextFunction) : Promise<void> {
        handleRemoveAuthor(req, res, next)
    }
}

export default new journalController()
