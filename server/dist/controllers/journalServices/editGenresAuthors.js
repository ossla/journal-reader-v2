"use strict";
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
exports.handleRemoveAuthor = exports.handleAddAuthor = exports.handleRemoveGenre = exports.handleAddGenre = void 0;
const processApiError_1 = __importDefault(require("../../error/processApiError"));
const genre_entity_1 = require("../../entities/genre.entity");
const author_entity_1 = require("../../entities/author.entity");
const journal_entity_1 = require("../../entities/journal.entity");
const app_data_source_1 = require("../../app-data-source");
function findJournal(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield app_data_source_1.dataSource.getRepository(journal_entity_1.Journal)
            .findOne({ relations: { genres: true, authors: true },
            where: { id }
        });
    });
}
function handleAddGenre(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const genreName = req.body.genreName;
            if (!genreName) {
                throw new Error("не указано имя жанра (\"genreName\")");
            }
            let genre = yield app_data_source_1.dataSource.getRepository(genre_entity_1.Genre).findOneBy({ name: genreName });
            if (!genre) {
                genre = yield app_data_source_1.dataSource.getRepository(genre_entity_1.Genre).create({ name: genreName });
                yield app_data_source_1.dataSource.getRepository(genre_entity_1.Genre).save(genre);
            }
            const journalId = req.body.journalId;
            if (!journalId) {
                throw new Error("не указан id журнала (\"journalId\")");
            }
            const journal = yield findJournal(journalId);
            if (!journal) {
                throw new Error("журнал не найден");
            }
            if (journal.genres.find(g => g.id === genre.id)) {
                throw new Error("этот жанр уже есть у журнала");
            }
            journal.genres.push(genre);
            yield app_data_source_1.dataSource.getRepository(journal_entity_1.Journal).save(journal);
            res.json(journal);
        }
        catch (error) {
            (0, processApiError_1.default)(404, error, next);
        }
    });
}
exports.handleAddGenre = handleAddGenre;
function handleRemoveGenre(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const genreName = req.body.genreName;
            if (!genreName) {
                throw new Error("не указано имя жанра (\"genreName\")");
            }
            const genre = yield app_data_source_1.dataSource.getRepository(genre_entity_1.Genre).findOneBy({ name: genreName });
            if (!genre) {
                throw new Error("жанр не найден");
            }
            const journalId = req.body.journalId;
            if (!journalId) {
                throw new Error("не указан id журнала (\"journalId\")");
            }
            const journal = yield findJournal(journalId);
            if (!journal) {
                throw new Error("журнал не найден");
            }
            const filteredGenres = (_a = journal.genres) === null || _a === void 0 ? void 0 : _a.filter(g => {
                return g.id !== genre.id;
            });
            if (Array.isArray(filteredGenres)) {
                if (filteredGenres.length === journal.genres.length) {
                    throw new Error("жанра у журнала не было");
                }
                journal.genres = filteredGenres;
                app_data_source_1.dataSource.getRepository(journal_entity_1.Journal).save(journal);
            }
            res.json(journal);
        }
        catch (error) {
            (0, processApiError_1.default)(404, error, next);
        }
    });
}
exports.handleRemoveGenre = handleRemoveGenre;
function handleAddAuthor(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authorName = req.body.authorName;
            if (!authorName) {
                throw new Error("не указано имя автора (\"authorName\")");
            }
            let author = yield app_data_source_1.dataSource.getRepository(author_entity_1.Author).findOneBy({ name: authorName });
            if (!author) {
                author = yield app_data_source_1.dataSource.getRepository(author_entity_1.Author).create({ name: authorName });
                yield app_data_source_1.dataSource.getRepository(author_entity_1.Author).save(author);
            }
            const journalId = req.body.journalId;
            if (!journalId) {
                throw new Error("не указан id журнала (\"journalId\")");
            }
            const journal = yield findJournal(journalId);
            if (!journal) {
                throw new Error("журнал не найден");
            }
            if (journal.authors.find(a => a.id === author.id)) {
                throw new Error("этот автор уже есть у журнала");
            }
            journal.authors.push(author);
            yield app_data_source_1.dataSource.getRepository(journal_entity_1.Journal).save(journal);
            res.json(journal);
        }
        catch (error) {
            (0, processApiError_1.default)(404, error, next);
        }
    });
}
exports.handleAddAuthor = handleAddAuthor;
function handleRemoveAuthor(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const authorName = req.body.authorName;
            if (!authorName) {
                throw new Error("не указано имя автора (\"authorName\")");
            }
            const author = yield app_data_source_1.dataSource.getRepository(author_entity_1.Author).findOneBy({ name: authorName });
            if (!author) {
                throw new Error("автор не найден");
            }
            const journalId = req.body.journalId;
            if (!journalId) {
                throw new Error("не указан id журнала (\"journalId\")");
            }
            const journal = yield findJournal(journalId);
            if (!journal) {
                throw new Error("журнал не найден");
            }
            const filteredAuthors = (_a = journal.authors) === null || _a === void 0 ? void 0 : _a.filter(a => {
                return a.id !== author.id;
            });
            if (Array.isArray(filteredAuthors)) {
                if (filteredAuthors.length === journal.authors.length) {
                    throw new Error("автора у журнала не было");
                }
                journal.authors = filteredAuthors;
                app_data_source_1.dataSource.getRepository(journal_entity_1.Journal).save(journal);
            }
            res.json(journal);
        }
        catch (error) {
            (0, processApiError_1.default)(404, error, next);
        }
    });
}
exports.handleRemoveAuthor = handleRemoveAuthor;
