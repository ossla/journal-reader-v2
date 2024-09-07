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
const express_1 = __importDefault(require("express"));
const userController_1 = __importDefault(require("../controllers/userController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const userRouter = (0, express_1.default)();
userRouter.get('/auth', authMiddleware_1.auth, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield userController_1.default.check(req, res, next);
}));
userRouter.get("/find", userController_1.default.findOne);
userRouter.post("/registration", userController_1.default.registration);
userRouter.post("/login", userController_1.default.login);
exports.default = userRouter;
