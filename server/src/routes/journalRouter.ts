import express, { Express } from "express"
import journalController from "../controllers/journalController"
import { check } from '../middlewares/checkMiddleware'

const journalRouter: Express = express();

journalRouter.get("/:id", journalController.getOne)
journalRouter.get("/", journalController.getAll)
journalRouter.post("/filter", journalController.getFilterData)

journalRouter.post("/create", check, journalController.create)
journalRouter.post("/delete", check, journalController.delete)

journalRouter.post("/add_genre", check, journalController.addGenre)
journalRouter.post("/remove_genre", check, journalController.removeGenre)
journalRouter.post("/add_author", check, journalController.addAuthor)
journalRouter.post("/remove_author", check, journalController.removeAuthor)

export default journalRouter;
