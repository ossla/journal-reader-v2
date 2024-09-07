"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const journalController_1 = __importDefault(require("../controllers/journalController"));
const checkMiddleware_1 = require("../middlewares/checkMiddleware");
const journalRouter = (0, express_1.default)();
journalRouter.get("/:id", journalController_1.default.getOne);
journalRouter.get("/", journalController_1.default.getAll);
journalRouter.post("/filter", journalController_1.default.getFilterData);
journalRouter.post("/create", checkMiddleware_1.check, journalController_1.default.create);
journalRouter.post("/delete", checkMiddleware_1.check, journalController_1.default.delete);
journalRouter.post("/add_genre", checkMiddleware_1.check, journalController_1.default.addGenre);
journalRouter.post("/remove_genre", checkMiddleware_1.check, journalController_1.default.removeGenre);
journalRouter.post("/add_author", checkMiddleware_1.check, journalController_1.default.addAuthor);
journalRouter.post("/remove_author", checkMiddleware_1.check, journalController_1.default.removeAuthor);
exports.default = journalRouter;
