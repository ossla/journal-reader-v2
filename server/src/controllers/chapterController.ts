import { NextFunction, Request, Response } from "express"
import * as fs from "fs"
import * as path from "path"

import { dataSource } from "../app-data-source"
import { Journal } from "../entities/journal.entity"
import { Chapter } from "../entities/chapter.entity"
import { CustomFileType, makeFolderName } from "../domain"
import processApiError from "../error/processApiError"


interface IChapterCreation {
    name: string
    size: number
    serial_number: number
}

class chapterController {
    async create(req: Request, res: Response, next: NextFunction) {
        // journalId, pages(files), chapterName
        try {
            // парсинг журнала
            const journalId: string | undefined = req.body.journalId
            if (!journalId) {
                throw new Error("не указано имя или id журнала")
            }
            const journal: Journal | null = await dataSource.getRepository(Journal)
                                            .findOne({
                                                relations: {chapters: true},
                                                where: {id: journalId}
                                            })
            if (!journal) {
                throw new Error('журнала с таким id не существует')
            }
            const journalFolderName: string = makeFolderName(journal.title)

            // парсинг порядкового номера главы
            const serialNumber: any = req.body.serialNumber || journal.number_of_chapters + 1
            if (isNaN(serialNumber)) {
                throw new Error('номер главы должен быть числом')
            }

            // получение файлов -> страниц главы
            const pages: CustomFileType = req.files?.pages
            if (!pages) throw new Error('нужно добавить страницы')

            // проверка путей
            const pathToPublic: string = path.join(__dirname, "..", "..", "public")
            if (!pathToPublic) {
                throw new Error("папка public не найдена") 
            }
            const pathToJournal: string = path.join(__dirname, "..", "..", "public", journalFolderName)
            if (!fs.existsSync(pathToJournal)) {
                throw new Error("папка журнала не найдена")
            }
            if (fs.existsSync(journalFolderName)) {
                throw new Error("глава с таким номером уже есть на сервере")
            }

            // добавление главы в базу
            let chapterName: string = req.body.chapterName || (serialNumber + "")
            chapterName = makeFolderName(chapterName)
            const size: number = Array.isArray(pages) ? pages.length : 1
            const rawChapter: IChapterCreation = {name: chapterName, size, serial_number: serialNumber}
            const chapter = await dataSource.getRepository(Chapter).create(rawChapter)

            // обновление полей journal
            ++journal.number_of_chapters
            journal.chapters.push(chapter)
            await dataSource.getRepository(Chapter).save(chapter)
            await dataSource.getRepository(Journal).save(journal)

            // создание папки главы
            const pathToChapter: string = path.join(pathToJournal, serialNumber + '')
            fs.mkdirSync(pathToChapter)
            // помещение страниц в папку
            if (!Array.isArray(pages)) {
                pages.mv(path.join(pathToChapter, '1.jpg'))
            } else {
                pages.forEach((page, index) => {
                    page.mv(path.join(pathToChapter, `${index + 1}.jpg`))
                })
            }

            res.json(chapter)

        } catch (error) {
            processApiError(404, error, next)
        }
    }

    async delete(req: Request, res: Response, next: NextFunction) {
        try { // chapterId, journalId
            // парсинг главы
            const chapterId: string = req.body.chapterId
            if (!chapterId) {
                throw new Error("передайте id главы")
            }
            const chapter: Chapter | null = await dataSource.getRepository(Chapter)
                                        .findOneBy({id: chapterId})
            if (!chapter) {
                throw new Error('главы с таким id не существует')
            }
            const chapterFolderName: string = chapter.serial_number + ''

            // парсинг журнала (в котором содержится глава)
            const journalId: string = req.body.journalId
            if (!journalId) {
                throw new Error("передайте id журнала")
            }
            const journal: Journal | null = await dataSource.getRepository(Journal)
                                    .findOne({relations: {chapters: true}, where: {id: journalId}})
            if (!journal) {
                throw new Error("журнала с таким id не существует")
            }
            const journalFolderName: string = journal.title.replace(/\s/g, '_')

            // удаление файлов
            const pathToChapter: string = path.join(__dirname, '..', '..', 'public', journalFolderName, chapterFolderName)
            if (!fs.existsSync(pathToChapter)) {
                throw new Error("глава не сохранена на сервере")
            }
            fs.rmSync(pathToChapter, { recursive: true, force: true })
            if (fs.existsSync(pathToChapter)) {
                throw new Error("ошибка в удалении папки/есть папка с одинаковым названием")
            }

            // удаление из бд
            await dataSource.getRepository(Chapter).delete({ id: chapter.id })
            journal.chapters = journal.chapters.filter(c => c.id === chapter.id)
            --journal.number_of_chapters
            await dataSource.getRepository(Journal).save(journal)

            res.json({message: 'deleted successfully'})
        } catch (error) {
            processApiError(404, error, next)
        }
    }
}

export default new chapterController()
