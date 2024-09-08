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
const processApiError_1 = __importDefault(require("../error/processApiError"));
const filterJournals_1 = require("./journalServices/filterJournals");
const journalCreation_1 = require("./journalServices/journalCreation");
const editGenresAuthors_1 = require("./journalServices/editGenresAuthors");
const domain_1 = require("../domain");
class journalController {
    create(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { title, status, description } = req.body;
                const year = req.body.year;
                if (!title || !year || !status || !description)
                    throw new Error('нужно заполнить все обязательные поля');
                try {
                    const coverImg = (_a = req.files) === null || _a === void 0 ? void 0 : _a.coverImg;
                    (0, journalCreation_1.makeFolder)(title, coverImg);
                }
                catch (e) {
                    (0, processApiError_1.default)(404, e, next);
                }
                const journal = new journal_entity_1.Journal();
                journal.title = title;
                journal.description = description;
                journal.status = status;
                journal.year = year;
                // Жанры, как и авторы, будут приходить 
                // в формате json {genres: '["жанр 1", "жанр 2"]', ...}
                let genres = req.body.genres;
                journal.genres = [];
                if (genres) {
                    journal.genres = yield (0, journalCreation_1.processGenres)(genres);
                }
                let authors = req.body.authors;
                journal.authors = [];
                if (authors) {
                    journal.authors = yield (0, journalCreation_1.processAuthors)(authors);
                }
                yield app_data_source_1.dataSource.manager.save(journal);
                res.json(journal);
            }
            catch (error) {
                (0, processApiError_1.default)(404, error, next);
            }
        });
    }
    delete(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try { // journalId
                const journalId = req.body.journalId;
                const journal = yield app_data_source_1.dataSource.getRepository(journal_entity_1.Journal)
                    .findOne({ where: { id: journalId } });
                if (!journal)
                    throw new Error('журнала с таким id не существует');
                const journalFolderName = (0, domain_1.makeFolderName)(journal.title);
                // удаление файлов
                const pathToJournal = path.join(__dirname, '..', '..', 'public', journalFolderName);
                fs.rmSync(pathToJournal, { recursive: true, force: true });
                if (fs.existsSync(pathToJournal)) {
                    throw new Error("ошибка в удалении папки");
                }
                yield app_data_source_1.dataSource.getRepository(journal_entity_1.Journal).delete({ id: journalId });
                res.json({ message: 'deleted successfully' });
            }
            catch (error) {
                (0, processApiError_1.default)(404, error, next);
            }
        });
    }
    getOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const journalId = req.params.id;
                if (!journalId) {
                    throw new Error("something goes wrong with journal id parameter (undefined)");
                }
                const journal = yield app_data_source_1.dataSource.getRepository(journal_entity_1.Journal)
                    .findOne({
                    where: { id: journalId },
                    relations: { genres: true, authors: true, chapters: true }
                });
                if (!journal)
                    throw new Error('журнал не найден');
                res.json(journal);
            }
            catch (error) {
                (0, processApiError_1.default)(404, error, next);
            }
        });
    }
    getAll(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = Number(req.query.page) || 1;
                const limit = Number(req.query.limit) || 9;
                const offset = limit * (page - 1);
                const journals = yield app_data_source_1.dataSource.getRepository(journal_entity_1.Journal)
                    .find({
                    relations: { genres: true, authors: true, chapters: false },
                    skip: offset,
                    take: limit
                });
                res.json(journals);
            }
            catch (error) {
                (0, processApiError_1.default)(404, error, next);
            }
        });
    }
    getFilterData(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, filterJournals_1.handleFilterData)(req, res, next);
        });
    }
    addGenre(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, editGenresAuthors_1.handleAddGenre)(req, res, next);
        });
    }
    removeGenre(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, editGenresAuthors_1.handleRemoveGenre)(req, res, next);
        });
    }
    addAuthor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, editGenresAuthors_1.handleAddAuthor)(req, res, next);
        });
    }
    removeAuthor(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, editGenresAuthors_1.handleRemoveAuthor)(req, res, next);
        });
    }
}
exports.default = new journalController();
