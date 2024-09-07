import express, { Express } from "express";
import { check } from "../middlewares/checkMiddleware";
import chapterController from "../controllers/chapterController";

const chapterRouter: Express = express();

chapterRouter.post("/create", check, chapterController.create)
chapterRouter.post("/delete", check, chapterController.delete)


export default chapterRouter;
