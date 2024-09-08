"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const app_data_source_1 = require("../app-data-source");
const journal_entity_1 = require("../entities/journal.entity");
const chapter_entity_1 = require("../entities/chapter.entity");
const domain_1 = require("../domain");
const processApiError_1 = __importDefault(require("../error/processApiError"));
class chapterController {
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            // journalId, pages(files), chapterName
            try {
                // парсинг журнала
                const journalId = req.body.journalId;
                if (!journalId) {
                    throw new Error('не указано имя или id журнала ("journalId" не найдено)');
                }
                const journal = yield app_data_source_1.dataSource.getRepository(journal_entity_1.Journal)
                    .findOne({
                    relations: { chapters: true },
                    where: { id: journalId }
                });
                if (!journal) {
                    throw new Error('журнала с таким id не существует');
                }
                const journalFolderName = (0, domain_1.makeFolderName)(journal.title);
                // парсинг порядкового номера главы
                const serialNumber = req.body.serialNumber || journal.number_of_chapters + 1;
                if (isNaN(serialNumber)) {
                    throw new Error('номер главы должен быть числом');
                }
                // получение файлов -> страниц главы
                const pages = (_a = req.files) === null || _a === void 0 ? void 0 : _a.pages;
                if (!pages)
                    throw new Error('нужно добавить страницы ("pages" не найдено)');
                // проверка путей
                const pathToPublic = path.join(__dirname, "..", "..", "public");
                if (!pathToPublic) {
                    throw new Error("папка public не найдена");
                }
                const pathToJournal = path.join(__dirname, "..", "..", "public", journalFolderName);
                if (!fs.existsSync(pathToJournal)) {
                    throw new Error("папка журнала не найдена");
                }
                if (fs.existsSync(journalFolderName)) {
                    throw new Error("глава с таким номером уже есть на сервере");
                }
                // добавление главы в базу
                let chapterName = req.body.chapterName || (serialNumber + "");
                chapterName = (0, domain_1.makeFolderName)(chapterName);
                const size = Array.isArray(pages) ? pages.length : 1;
                const rawChapter = { name: chapterName, size, serial_number: serialNumber };
                const chapter = yield app_data_source_1.dataSource.getRepository(chapter_entity_1.Chapter).create(rawChapter);
                // обновление полей journal
                ++journal.number_of_chapters;
                journal.chapters.push(chapter);
                yield app_data_source_1.dataSource.getRepository(chapter_entity_1.Chapter).save(chapter);
                yield app_data_source_1.dataSource.getRepository(journal_entity_1.Journal).save(journal);
                // создание папки главы
                const pathToChapter = path.join(pathToJournal, serialNumber + '');
                fs.mkdirSync(pathToChapter);
                // помещение страниц в папку
                if (!Array.isArray(pages)) {
                    pages.mv(path.join(pathToChapter, '1.jpg'));
                }
                else {
                    pages.forEach((page, index) => {
                        page.mv(path.join(pathToChapter, `${index + 1}.jpg`));
                    });
                }
                res.json(chapter);
            }
            catch (error) {
                (0, processApiError_1.default)(404, error, next);
            }
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try { // chapterId, journalId
                // парсинг главы
                const chapterId = req.body.chapterId;
                if (!chapterId) {
                    throw new Error("передайте id главы");
                }
                const chapter = yield app_data_source_1.dataSource.getRepository(chapter_entity_1.Chapter)
                    .findOneBy({ id: chapterId });
                if (!chapter) {
                    throw new Error('главы с таким id не существует');
                }
                const chapterFolderName = chapter.serial_number + '';
                // парсинг журнала (в котором содержится глава)
                const journalId = req.body.journalId;
                if (!journalId) {
                    throw new Error("передайте id журнала");
                }
                const journal = yield app_data_source_1.dataSource.getRepository(journal_entity_1.Journal)
                    .findOne({ relations: { chapters: true }, where: { id: journalId } });
                if (!journal) {
                    throw new Error("журнала с таким id не существует");
                }
                const journalFolderName = (0, domain_1.makeFolderName)(journal.title);
                // удаление файлов
                const pathToChapter = path.join(__dirname, '..', '..', 'public', journalFolderName, chapterFolderName);
                if (!fs.existsSync(pathToChapter)) {
                    throw new Error("глава не сохранена на сервере");
                }
                fs.rmSync(pathToChapter, { recursive: true, force: true });
                if (fs.existsSync(pathToChapter)) {
                    throw new Error("ошибка в удалении папки/есть папка с одинаковым названием");
                }
                // удаление из бд
                yield app_data_source_1.dataSource.getRepository(chapter_entity_1.Chapter).delete({ id: chapter.id });
                journal.chapters = journal.chapters.filter(c => c.id === chapter.id);
                --journal.number_of_chapters;
                yield app_data_source_1.dataSource.getRepository(journal_entity_1.Journal).save(journal);
                res.json({ message: 'deleted successfully' });
            }
            catch (error) {
                (0, processApiError_1.default)(404, error, next);
            }
        });
    }
}
exports.default = new chapterController();
