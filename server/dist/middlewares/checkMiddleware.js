"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.check = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const check = (req, res, next) => {
    var _a;
    if (req.method === 'OPTIONS')
        next();
    try {
        const token = (_a = req.header('authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
        if (!token) {
            res.status(401).json({ message: 'не авторизован' });
        }
        else {
            const secretKey = process.env.SECRET_KEY;
            if (!secretKey) {
                throw new Error('SECRET_KEY не найден');
            }
            const decoded = jsonwebtoken_1.default.verify(token, secretKey);
            if (typeof decoded === 'string') {
                throw new Error(decoded);
            }
            else {
                if (!decoded.is_admin)
                    throw new Error('user не имеет достаточно прав');
            }
            req.user = decoded;
            next();
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.json({ message: 'checkAdmin: ' + error.message });
        }
        else if (typeof error === 'string') {
            res.json({ message: error });
        }
    }
};
exports.check = check;
