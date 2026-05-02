import { Router } from "express";
import {
  createTaskController,
  deleteTaskByIdController,
  getAllTasksInWorkspaceController,
  getTaskByIdController,
  updateTaskController,
} from "../controllers/task.controller";

const taskRouter = Router();

taskRouter.post(
  "/workspace/:workspaceId/projects/:projectId/tasks",
  createTaskController,
);

taskRouter.get(
  "/workspace/:workspaceId/tasks",
  getAllTasksInWorkspaceController,
);

taskRouter.get(
  "/workspace/:workspaceId/projects/:projectId/tasks/:taskId",
  getTaskByIdController,
);

taskRouter.patch(
  "/workspace/:workspaceId/projects/:projectId/tasks/:taskId",
  updateTaskController,
);

taskRouter.delete(
  "/workspace/:workspaceId/tasks/:taskId",
  deleteTaskByIdController,
);

export default taskRouter;
