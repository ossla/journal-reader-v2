"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const checkMiddleware_1 = require("../middlewares/checkMiddleware");
const chapterController_1 = __importDefault(require("../controllers/chapterController"));
const chapterRouter = (0, express_1.default)();
chapterRouter.post("/create", checkMiddleware_1.check, chapterController_1.default.create);
chapterRouter.post("/delete", checkMiddleware_1.check, chapterController_1.default.delete);
exports.default = chapterRouter;
