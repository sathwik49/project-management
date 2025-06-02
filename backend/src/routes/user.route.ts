import { Router } from "express";
import { getCurrentUserController } from "../controllers/user.controller";

const userRouter = Router()

userRouter.get("/get-user",getCurrentUserController)

export default userRouter;