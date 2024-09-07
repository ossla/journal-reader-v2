"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter_1 = __importDefault(require("./userRouter"));
const journalRouter_1 = __importDefault(require("./journalRouter"));
const chapterRouter_1 = __importDefault(require("./chapterRouter"));
const router = (0, express_1.default)();
router.use('/users', userRouter_1.default);
router.use('/journals', journalRouter_1.default);
router.use('/chapters', chapterRouter_1.default);
exports.default = router;
