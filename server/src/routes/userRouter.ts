import express, { Express } from "express";
import userController from "../controllers/userController";
import { auth } from '../middlewares/authMiddleware'
import { ICustomRequest } from "../middlewares/authMiddleware";

const userRouter: Express = express();

userRouter.get('/auth', auth, async (req, res, next) => {
    await userController.check(req as ICustomRequest, res, next)
})
userRouter.get("/find", userController.findOne)

userRouter.post("/registration", userController.registration)
userRouter.post("/login", userController.login)

export default userRouter;
