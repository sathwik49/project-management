import type {
  signInInputType,
  signUpInputType,
} from "../validations/auth.validation";
import type {
  changeMemberRoleResponseType,
  createProjectResponseType,
  createTaskResponseType,
  createWorkspaceResponseType,
  deleteProjectResponseType,
  deleteTaskResponseType,
  deleteWorkspaceResponseType,
  getAllUserWorkspacesResponseType,
  getCurrentUserResponseType,
  getProjectAnalyticsResponseType,
  getProjectByIdResponseType,
  getProjectsInWorkspaceResponseType,
  getTaskByIdResponseType,
  getTasksInWorkspaceResponseType,
  getWorkspaceAnalyticsResponseType,
  getWorkspaceByIdResponseType,
  getWorkspaceMembersResponseType,
  joinWorkspaceResponseType,
  signInResponseType,
  signUpResponseType,
  TaskPriority,
  TaskStatus,
  updateProjectResponseType,
  updateTaskResponseType,
  updateWorkspaceResponseType,
} from "./types";
import { api } from "./axios";
import { ENDPOINTS } from "@/lib/endpoints";

export const signUpMutation = async (
  data: signUpInputType,
): Promise<signUpResponseType> => {
  const res = await api.post(ENDPOINTS.AUTH.REGISTER, data);
  return res.data;
};

export const signInMutation = async (
  data: signInInputType,
): Promise<signInResponseType> => {
  const res = await api.post(ENDPOINTS.AUTH.LOGIN, data);
  return res.data;
};

export const getCurrentUser = async (): Promise<getCurrentUserResponseType> => {
  const res = await api.get(ENDPOINTS.USER.CURRENT);
  return res.data;
};

export const logOutMutation = async () => {
  const res = await api.post(ENDPOINTS.AUTH.LOGOUT);
  return res.data;
};

export const verifyEmailQuery = async (token: string) => {
  const res = await api.get(ENDPOINTS.AUTH.VERIFY_EMAIL(token));
  return res.data;
};

export const getAllUserWorkspaces =
  async (): Promise<getAllUserWorkspacesResponseType> => {
    const res = await api.get(ENDPOINTS.WORKSPACE.ALL);
    return res.data;
  };

export const switchCurrentWorkspace = async (workspaceId: string) => {
  const res = await api.patch(ENDPOINTS.WORKSPACE.SWITCH, { workspaceId });
  return res.data;
};

export const createWorkspace = async (data: {
  name: string;
  description?: string;
}): Promise<createWorkspaceResponseType> => {
  const res = await api.post(ENDPOINTS.WORKSPACE.CREATE, data);
  return res.data;
};

export const getWorkspaceById = async (
  id: string,
): Promise<getWorkspaceByIdResponseType> => {
  const res = await api.get(ENDPOINTS.WORKSPACE.GET_BY_ID(id));
  return res.data;
};

export const getWorkspaceMembers = async (
  id: string,
): Promise<getWorkspaceMembersResponseType> => {
  const res = await api.get(ENDPOINTS.WORKSPACE.MEMBERS(id));
  return res.data;
};

export const getWorkspaceAnalytics = async (
  id: string,
): Promise<getWorkspaceAnalyticsResponseType> => {
  const res = await api.get(ENDPOINTS.WORKSPACE.ANALYTICS(id));
  return res.data;
};

export const updateWorkspace = async (
  id: string,
  data: { name: string; description?: string },
): Promise<updateWorkspaceResponseType> => {
  const res = await api.patch(ENDPOINTS.WORKSPACE.UPDATE(id), data);
  return res.data;
};

export const deleteWorkspace = async (
  id: string,
): Promise<deleteWorkspaceResponseType> => {
  const res = await api.delete(ENDPOINTS.WORKSPACE.DELETE(id));
  return res.data;
};

export const changeWorkspaceMemberRole = async (
  workspaceId: string,
  data: { memberId: string; roleId: string },
): Promise<changeMemberRoleResponseType> => {
  const res = await api.patch(
    ENDPOINTS.WORKSPACE.CHANGE_ROLE(workspaceId),
    data,
  );
  return res.data;
};

export const createProject = async (
  workspaceId: string,
  data: { name: string; description?: string; image?: string },
): Promise<createProjectResponseType> => {
  const res = await api.post(ENDPOINTS.PROJECT.CREATE(workspaceId), data);
  return res.data;
};

export const getProjectsInWorkspace = async (
  workspaceId: string,
  params?: { pageNumber?: number; pageSize?: number },
): Promise<getProjectsInWorkspaceResponseType> => {
  const res = await api.get(ENDPOINTS.PROJECT.ALL(workspaceId), { params });
  return res.data;
};

export const getProjectById = async (
  workspaceId: string,
  projectId: string,
): Promise<getProjectByIdResponseType> => {
  const res = await api.get(ENDPOINTS.PROJECT.GET(workspaceId, projectId));
  return res.data;
};

export const getProjectAnalytics = async (
  workspaceId: string,
  projectId: string,
): Promise<getProjectAnalyticsResponseType> => {
  const res = await api.get(
    ENDPOINTS.PROJECT.ANALYTICS(workspaceId, projectId),
  );
  return res.data;
};

export const updateProject = async (
  workspaceId: string,
  projectId: string,
  data: { name: string; description?: string; image?: string },
): Promise<updateProjectResponseType> => {
  const res = await api.patch(
    ENDPOINTS.PROJECT.UPDATE(workspaceId, projectId),
    data,
  );
  return res.data;
};

export const deleteProject = async (
  workspaceId: string,
  projectId: string,
): Promise<deleteProjectResponseType> => {
  const res = await api.delete(
    ENDPOINTS.PROJECT.DELETE(workspaceId, projectId),
  );
  return res.data;
};

type CreateTaskBody = {
  title: string;
  description?: string;
  dueDate: string;
  assignedTo?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
};

type UpdateTaskBody = {
  title: string;
  description?: string;
  dueDate: string;
  assignedTo?: string;
  status: TaskStatus;
  priority: TaskPriority;
};

export const createTask = async (
  workspaceId: string,
  projectId: string,
  body: CreateTaskBody,
): Promise<createTaskResponseType> => {
  const res = await api.post(
    ENDPOINTS.TASK.CREATE(workspaceId, projectId),
    body,
  );
  return res.data;
};

export const updateTask = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
  body: UpdateTaskBody,
): Promise<updateTaskResponseType> => {
  const res = await api.patch(
    ENDPOINTS.TASK.UPDATE(workspaceId, projectId, taskId),
    body,
  );
  return res.data;
};

export const getTasksInWorkspace = async (
  workspaceId: string,
  params?: {
    projectId?: string;
    status?: TaskStatus[];
    priority?: TaskPriority[];
    assignedTo?: string[];
    keyword?: string;
    dueDate?: string;
    pageNumber?: number;
    pageSize?: number;
  },
): Promise<getTasksInWorkspaceResponseType> => {
  const res = await api.get(ENDPOINTS.TASK.ALL(workspaceId), { params });
  return res.data;
};

export const getTaskById = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
): Promise<getTaskByIdResponseType> => {
  const res = await api.get(ENDPOINTS.TASK.GET(workspaceId, projectId, taskId));
  return res.data;
};

export const deleteTask = async (
  workspaceId: string,
  taskId: string,
): Promise<deleteTaskResponseType> => {
  const res = await api.delete(ENDPOINTS.TASK.DELETE(workspaceId, taskId));
  return res.data;
};

export const joinWorkspace = async (
  inviteCode: string,
): Promise<joinWorkspaceResponseType> => {
  const res = await api.post(ENDPOINTS.MEMBER.JOIN(inviteCode));
  return res.data;
};
