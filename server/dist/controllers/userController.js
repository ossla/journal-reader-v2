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
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_entity_1 = require("../entities/user.entity");
const app_data_source_1 = require("../app-data-source");
const processApiError_1 = __importDefault(require("../error/processApiError"));
const favorites_entity_1 = require("../entities/favorites.entity");
function createToken(id, name, email, is_admin) {
    return __awaiter(this, void 0, void 0, function* () {
        const secretKey = process.env.SECRET_KEY;
        if (!secretKey) {
            throw new Error('Secret key is not defined');
        }
        return jsonwebtoken_1.default.sign({
            id,
            name,
            email,
            is_admin
        }, secretKey, { expiresIn: '2 days' });
    });
}
class userController {
    registration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { username, email, password } = req.body;
                if (!username || !email || !password)
                    throw new Error('Нужно заполнить все поля');
                const is_admin = req.body.is_admin || false;
                const is_exist = yield app_data_source_1.dataSource.getRepository(user_entity_1.User).findOne({ where: { email } });
                if (is_exist)
                    throw new Error('Пользователь с таким email уже существует');
                const hashPassword = yield bcrypt.hash(password, 5);
                const userObj = { username, email, password: hashPassword, is_admin };
                const user = yield app_data_source_1.dataSource.getRepository(user_entity_1.User).create(userObj);
                yield app_data_source_1.dataSource.getRepository(user_entity_1.User).save(user);
                const favorites = yield app_data_source_1.dataSource.getRepository(favorites_entity_1.Favorite).create({ user });
                yield app_data_source_1.dataSource.getRepository(favorites_entity_1.Favorite).save(favorites);
                const token = yield createToken(user.id, user.username, user.email, user.is_admin);
                res.json(token);
            }
            catch (error) {
                (0, processApiError_1.default)(404, error, next);
            }
        });
    }
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // получение данных
                const { email, password } = req.body;
                if (!email || !password)
                    throw new Error('Нужно заполнить все поля');
                // идентификация
                const user = yield app_data_source_1.dataSource.getRepository(user_entity_1.User).findOneBy({
                    email: email
                });
                if (!user)
                    throw new Error('Пользователя с таким email не существует');
                // проверка пароля на валидность
                const valid = bcrypt.compareSync(password, user.password);
                if (!valid)
                    throw new Error('Неверный пароль');
                // создание токена
                const token = yield createToken(user.id, user.username, user.email, user.is_admin);
                res.json(token);
            }
            catch (error) {
                (0, processApiError_1.default)(404, error, next);
            }
        });
    }
    // Метод отвечает за создание нового токена, продление жизни пользователя
    check(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.user;
            const userId = user.id;
            const userName = user.name;
            const userEmail = user.email;
            const userIsAdmin = user.is_admin;
            const token = yield createToken(userId, userName, userEmail, userIsAdmin);
            res.json(token);
        });
    }
    findOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const id = typeof req.query.id === 'string' ? req.query.id : undefined;
                if (!id) {
                    throw Error("userController-findOne: не найден параметр id");
                }
                const user = yield app_data_source_1.dataSource.getRepository(user_entity_1.User).findOneBy({ id });
                if (!user)
                    throw new Error('пользователя с таким id нет в системе');
                res.json(user);
            }
            catch (error) {
                (0, processApiError_1.default)(404, error, next);
            }
        });
    }
}
exports.default = new userController();
