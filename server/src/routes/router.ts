import express, { Express, Request, Response } from "express";
import userRouter from './userRouter'
import journalRouter from "./journalRouter";
import chapterRouter from "./chapterRouter";

const router: Express = express();

router.use('/users', userRouter)
router.use('/journals', journalRouter)
router.use('/chapters', chapterRouter)

export default router;