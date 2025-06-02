import { Router } from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import isAuthenticated from "../middlewares/isAuthenticated";
import workspaceRouter from "./workspace.route";

const mainRouter = Router()

mainRouter.use("/auth",authRouter);
mainRouter.use("/user",isAuthenticated,userRouter)
mainRouter.use("/workspace",isAuthenticated,workspaceRouter)

export default mainRouter;