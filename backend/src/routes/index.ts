import { Router } from "express";
import authRouter from "./auth.route";
import userRouter from "./user.route";
import isAuthenticated from "../middlewares/isAuthenticated";
import workspaceRouter from "./workspace.route";
import memberRouter from "./member.route";
import projectRouter from "./project.route";
import taskRouter from "./task.route";

const mainRouter = Router()

mainRouter.use("/auth",authRouter);
mainRouter.use("/user",isAuthenticated,userRouter)
mainRouter.use("/workspace",isAuthenticated,workspaceRouter)
mainRouter.use("/member",isAuthenticated,memberRouter)
mainRouter.use("/project",isAuthenticated,projectRouter)
mainRouter.use("/task",isAuthenticated,taskRouter)

export default mainRouter;