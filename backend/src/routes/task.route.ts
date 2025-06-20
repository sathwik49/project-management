import { Router } from "express";
import { createTaskController, deleteTaskByIdController, getAllTasksInWorkspaceController, getTaskByIdController, updateTaskController } from "../controllers/task.controller";

const taskRouter = Router()

taskRouter.post("/project/:projectId/workspace/:workspaceId/create",createTaskController)
taskRouter.put("/:id/project/:projectId/workspace/:workspaceId/update",updateTaskController)
taskRouter.get("/workspace/:workspaceId/all/",getAllTasksInWorkspaceController)
taskRouter.get("/:id/project/:projectId/workspace/:workspaceId",getTaskByIdController)
taskRouter.delete("/:id/workspace/:workspaceId",deleteTaskByIdController)

export default taskRouter;