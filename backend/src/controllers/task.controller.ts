import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import { ZodError } from "zod";
import { UserInterface } from "../utils/interfaces";
import { roleGuard } from "../utils/roleGuard";
import { ProjectPermission } from "../utils/enums";
import { createTaskSchema, updateTaskSchema } from "../validations/task.validation";
import { AuthError, ValidationError } from "../utils/error";
import { getMemberRoleInWorkspace } from "../services/member.service";
import { createTaskService, deleteTaskByIdService, getAllTasksInWorkspaceService, getTaskByIdService, updateTaskService } from "../services/task.service";

export const createTaskController = asyncHandler(
  async (req: Request, res: Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) {
      throw new AuthError("UnAuthorized");
    }

    const projectId = req.params.projectId;
    if (!projectId || typeof projectId !== "string") {
      throw new ValidationError("Invalid ProjectId");
    }

    const workspaceId = req.params.workspaceId;
    if (!workspaceId || typeof workspaceId !== "string") {
      throw new ValidationError("Invalid WorkspaceId");
    }

    const validation = createTaskSchema.safeParse(req.body);
    if (!validation.success) {
      //console.log(validation.error.errors)
      throw new ZodError(validation.error.errors);
    }

    const role = await getMemberRoleInWorkspace(userId,workspaceId)
    //console.log(role)
    roleGuard(role,[ProjectPermission.CREATE_TASK])
    const task = await createTaskService(projectId,workspaceId,userId,validation.data)

    return res.status(200).json({
      message:"Task created successfully in workspace",
      task
    })
  }
);

export const updateTaskController = asyncHandler(
  async (req:Request,res:Response) =>{
    const { id: userId } = req.user as UserInterface;
    if (!userId) {
      throw new AuthError("UnAuthorized");
    }

    const projectId = req.params.projectId;
    if (!projectId || typeof projectId !== "string") {
      throw new ValidationError("Invalid ProjectId");
    }

    const workspaceId = req.params.workspaceId;
    if (!workspaceId || typeof workspaceId !== "string") {
      throw new ValidationError("Invalid WorkspaceId");
    }

    const taskId = req.params.id
    if (!taskId || typeof taskId !== "string") {
      throw new ValidationError("Invalid TaskId");
    }

    const validation = updateTaskSchema.safeParse(req.body);
    if (!validation.success) {
      //console.log(validation.error.errors)
      throw new ZodError(validation.error.errors);
    }

    const role = await getMemberRoleInWorkspace(userId,workspaceId)
    roleGuard(role,[ProjectPermission.EDIT_TASK])

    const task = await updateTaskService(taskId,projectId,workspaceId,userId,req.body)

    return res.status(200).json({
      message:"Updated Task successfully",
      task
    })
  }
)

export const getAllTasksInWorkspaceController = asyncHandler(
  async(req:Request,res:Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) {
      throw new AuthError("UnAuthorized");
    }

    const workspaceId = req.params.workspaceId;
    if (!workspaceId || typeof workspaceId !== "string") {
      throw new ValidationError("Invalid WorkspaceId");
    }

    const filters = {
      projectId:req.query.projectId as string | undefined,
      status:req.query.status ? (req.query.status as string).split(",") : undefined,
      priority:req.query.priority ? (req.query.priority as string).split(",") : undefined,
      assignedTo:req.query.assignedTo ? (req.query.assignedTo as string).split(",") : undefined,
      keyword:req.query.keyword as string | undefined,
      dueDate:req.query.dueDate as string | undefined,
    }

    const paginationFliter = {
      pageSize:parseInt(req.query.pageSize as string) || 10,
      pageNumber:parseInt(req.query.pageNumber as string) || 1
    }

    const role = await getMemberRoleInWorkspace(userId,workspaceId)
    roleGuard(role,[ProjectPermission.VIEW_ONLY])

    const { tasks,pagination } = await getAllTasksInWorkspaceService(workspaceId,filters,paginationFliter)

    return res.status(200).json({
      message:"All Tasks fetched sucessfully",
      tasks,
      pagination
    })
  }
)

export const getTaskByIdController = asyncHandler(
  async (req:Request,res:Response)=>{
    const { id: userId } = req.user as UserInterface;
    if (!userId) {
      throw new AuthError("UnAuthorized");
    }

    const taskId = req.params.id;
    if(!taskId || typeof taskId!=="string"){
      throw new ValidationError("Invalid TaskId")
    }

    const projectId = req.params.projectId;
    if (!projectId || typeof projectId !== "string") {
      throw new ValidationError("Invalid ProjectId");
    }

    const workspaceId = req.params.workspaceId;
    if (!workspaceId || typeof workspaceId !== "string") {
      throw new ValidationError("Invalid WorkspaceId");
    }

    const role = await getMemberRoleInWorkspace(userId,workspaceId)
    roleGuard(role,[ProjectPermission.VIEW_ONLY])

    const task = await  getTaskByIdService(taskId,projectId,workspaceId)

    return res.status(200).json({
      message:"Task fetched successfully",
      task
    })
  } 
)

export const deleteTaskByIdController = asyncHandler(
  async(req:Request,res:Response) => {
    const { id: userId } = req.user as UserInterface;
    if (!userId) {
      throw new AuthError("UnAuthorized");
    }

     const taskId = req.params.id;
    if(!taskId || typeof taskId!=="string"){
      throw new ValidationError("Invalid TaskId")
    }

    const workspaceId = req.params.workspaceId;
    if (!workspaceId || typeof workspaceId !== "string") {
      throw new ValidationError("Invalid WorkspaceId");
    }

    const role = await getMemberRoleInWorkspace(userId,workspaceId)
    roleGuard(role,[ProjectPermission.DELETE_TASK])

    await deleteTaskByIdService(workspaceId,taskId)

    return res.status(200).json({
      message:"Task deleted successfully from workspace"
    })
  }
)
