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
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeFolder = exports.processAuthors = exports.processGenres = void 0;
const genre_entity_1 = require("../../entities/genre.entity");
const author_entity_1 = require("../../entities/author.entity");
const app_data_source_1 = require("../../app-data-source");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const domain_1 = require("../../domain");
function processGenres(genres) {
    return __awaiter(this, void 0, void 0, function* () {
        let genresArr = new Array();
        if (typeof genres === 'string' && genres.length) {
            genres = JSON.parse(genres);
            for (let i = 0; i < genres.length; i++) {
                let genre = yield app_data_source_1.dataSource.getRepository(genre_entity_1.Genre).findOneBy({ name: genres[i] });
                if (genre) {
                    genresArr.push(genre);
                }
                else {
                    const newGenre = new genre_entity_1.Genre();
                    newGenre.name = genres[i];
                    yield app_data_source_1.dataSource.manager.save(newGenre);
                    genresArr.push(newGenre);
                }
            }
        }
        return genresArr;
    });
}
exports.processGenres = processGenres;
function processAuthors(authors) {
    return __awaiter(this, void 0, void 0, function* () {
        let authorsArr = new Array();
        if (typeof authors === 'string' && authors.length) {
            authors = JSON.parse(authors);
            for (let i = 0; i < authors.length; i++) {
                let author = yield app_data_source_1.dataSource.getRepository(author_entity_1.Author).findOneBy({ name: authors[i] });
                if (author) {
                    authorsArr.push(author);
                }
                else {
                    const newAuthor = new author_entity_1.Author();
                    newAuthor.name = authors[i];
                    yield app_data_source_1.dataSource.manager.save(newAuthor);
                    authorsArr.push(newAuthor);
                }
            }
        }
        return authorsArr;
    });
}
exports.processAuthors = processAuthors;
function makeFolder(title, coverImg) {
    return __awaiter(this, void 0, void 0, function* () {
        // создание папки
        const folderName = (0, domain_1.makeFolderName)(title);
        const pathToPublic = path.join(__dirname, "..", "..", "..", "public");
        if (!fs.existsSync(pathToPublic)) {
            fs.mkdirSync(pathToPublic);
        }
        const folderPath = path.join(pathToPublic, folderName);
        if (fs.existsSync(folderPath)) {
            throw new Error("Произведение с таким названием уже существует");
        }
        fs.mkdirSync(folderPath);
        // перемещение обложки журнала
        if (coverImg) {
            if (Array.isArray(coverImg)) {
                throw new Error("загрузите только 1 файл");
            }
            coverImg.mv(path.join(folderPath, "cover.jpg"));
        }
        else {
            throw new Error("загрузите обложку");
        }
    });
}
exports.makeFolder = makeFolder;
