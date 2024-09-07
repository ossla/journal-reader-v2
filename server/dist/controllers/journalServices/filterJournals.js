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
exports.handleFilterData = void 0;
const processApiError_1 = __importDefault(require("../../error/processApiError"));
const typeorm_1 = require("typeorm");
const journal_entity_1 = require("../../entities/journal.entity");
const app_data_source_1 = require("../../app-data-source");
class filterService {
    static getInstance(limit, offset) {
        if (!filterService.instance) {
            filterService.instance = new filterService(limit, offset);
        }
        return filterService.instance;
    }
    constructor(limit, offset) {
        this.limit = 9;
        this.offset = 0;
        this.limit = limit;
        this.offset = offset;
    }
    getWithGenresAuthorsYear(rawGenres, rawAuthors, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const genres = JSON.parse(rawGenres);
            const authors = JSON.parse(rawAuthors);
            return yield app_data_source_1.dataSource.getRepository(journal_entity_1.Journal)
                .find({ where: {
                    genres: { name: (0, typeorm_1.In)(genres) },
                    authors: { name: (0, typeorm_1.In)(authors) },
                    year: year
                },
                relations: { genres: true, authors: true },
                skip: this.offset,
                take: this.limit
            });
        });
    }
    getWithGenresAuthors(rawGenres, rawAuthors) {
        return __awaiter(this, void 0, void 0, function* () {
            const genres = JSON.parse(rawGenres);
            const authors = JSON.parse(rawAuthors);
            return yield app_data_source_1.dataSource.getRepository(journal_entity_1.Journal)
                .find({ where: {
                    genres: { name: (0, typeorm_1.In)(genres) },
                    authors: { name: (0, typeorm_1.In)(authors) }
                },
                relations: { genres: true, authors: true },
                skip: this.offset,
                take: this.limit
            });
        });
    }
    getWithGenresYear(rawGenres, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const genres = JSON.parse(rawGenres);
            return yield app_data_source_1.dataSource.getRepository(journal_entity_1.Journal)
                .find({ where: {
                    genres: { name: (0, typeorm_1.In)(genres) },
                    year: year
                },
                relations: { genres: true, authors: true },
                skip: this.offset,
                take: this.limit
            });
        });
    }
    getWithAuthorsYear(rawAuthors, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const authors = JSON.parse(rawAuthors);
            return yield app_data_source_1.dataSource.getRepository(journal_entity_1.Journal)
                .find({ where: {
                    authors: { name: (0, typeorm_1.In)(authors) },
                    year: year
                },
                relations: { genres: true, authors: true },
                skip: this.offset,
                take: this.limit
            });
        });
    }
    getWithAuthors(rawAuthors) {
        return __awaiter(this, void 0, void 0, function* () {
            const authors = JSON.parse(rawAuthors);
            return yield app_data_source_1.dataSource.getRepository(journal_entity_1.Journal)
                .find({ where: {
                    authors: { name: (0, typeorm_1.In)(authors) }
                },
                relations: { genres: true, authors: true },
                skip: this.offset,
                take: this.limit
            });
        });
    }
    getWithGenres(rawGenres) {
        return __awaiter(this, void 0, void 0, function* () {
            const genres = JSON.parse(rawGenres);
            return yield app_data_source_1.dataSource.getRepository(journal_entity_1.Journal)
                .find({ where: {
                    genres: { name: (0, typeorm_1.In)(genres) }
                },
                relations: { genres: true, authors: true },
                skip: this.offset,
                take: this.limit
            });
        });
    }
    getWithYear(year) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield app_data_source_1.dataSource.getRepository(journal_entity_1.Journal)
                .find({ where: { year: year },
                relations: { genres: true, authors: true },
                skip: this.offset,
                take: this.limit
            });
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            console.error("getAll request, no filter data. use GET ..api/journals/");
            return yield app_data_source_1.dataSource.getRepository(journal_entity_1.Journal)
                .find({
                relations: { genres: true, authors: true },
                skip: this.offset,
                take: this.limit
            });
        });
    }
}
function handleFilterData(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const page = Number(req.body.page) || 1;
            const limit = Number(req.body.limit) || 9;
            const offset = limit * (page - 1);
            const service = filterService.getInstance(limit, offset);
            const rawGenres = req.body.genres;
            const rawAuthors = req.body.authors;
            const year = req.body.year;
            const upperYear = req.body.upperYear;
            const lowerYear = req.body.lowerYear;
            if (year && upperYear || year && lowerYear) {
                throw new Error("укажите только один тип фильтрации по году: год ИЛИ годовой промежуток");
            }
            let response;
            if (rawGenres && rawAuthors && year) { // genres & authors & year
                response = yield service.getWithGenresAuthorsYear(rawGenres, rawAuthors, year);
            }
            else if (rawGenres && rawAuthors && !year) { // genres & authors
                response = yield service.getWithGenresAuthors(rawGenres, rawAuthors);
            }
            else if (rawGenres && !rawAuthors && year) { // genres & year
                response = yield service.getWithGenresYear(rawGenres, year);
            }
            else if (!rawGenres && rawAuthors && year) { // authors & year
                response = yield service.getWithAuthorsYear(rawAuthors, year);
            }
            else if (rawGenres && !rawAuthors && !year) { // genres
                response = yield service.getWithGenres(rawGenres);
            }
            else if (!rawGenres && rawAuthors && !year) { // authors
                response = yield service.getWithAuthors(rawAuthors);
            }
            else if (!rawGenres && !rawAuthors && year) { // year
                response = yield service.getWithYear(year);
            }
            else { // all (better use GET getAll)
                response = yield service.getAll();
            }
            if (lowerYear) {
                response.filter(j => j.year >= lowerYear);
            }
            if (upperYear) {
                response.filter(j => j.year <= upperYear);
            }
            res.json(response);
        }
        catch (error) {
            (0, processApiError_1.default)(404, error, next);
        }
    });
}
exports.handleFilterData = handleFilterData;
