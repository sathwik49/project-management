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
  signUpResponseType,
  TaskPriority,
  TaskStatus,
  updateProjectResponseType,
  updateTaskResponseType,
  updateWorkspaceResponseType,
} from "./types";
import { api } from "./axios";

export const signUpMutation = async (
  data: signUpInputType,
): Promise<signUpResponseType> => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const signInMutation = async (
  data: signInInputType,
): Promise<signUpResponseType> => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const getCurrentUser = async (): Promise<getCurrentUserResponseType> => {
  const res = await api.get("/user/get-user");
  return res.data;
};

export const logOutMutation = async () => {
  const res = await api.post("/auth/logout");
  return res.data;
};

export const getAllUserWorkspaces =
  async (): Promise<getAllUserWorkspacesResponseType> => {
    const res = await api.get("/workspace/all");
    return res.data;
  };
export const switchCurrentWorkspace = async (workspaceId: string) => {
  const res = await api.patch("/workspace/current-workspace", { workspaceId });
  return res.data;
};


export const createWorkspace = async (data: {
  name: string;
  description?: string;
}): Promise<createWorkspaceResponseType> => {
  const res = await api.post("/workspace/create/new", data);
  return res.data;
};

export const getWorkspaceById = async (
  id: string,
): Promise<getWorkspaceByIdResponseType> => {
  const res = await api.get(`/workspace/${id}`);
  return res.data;
};

export const getWorkspaceMembers = async (
  id: string,
): Promise<getWorkspaceMembersResponseType> => {
  const res = await api.get(`/workspace/members/${id}`);
  return res.data;
};

export const getWorkspaceAnalytics = async (
  id: string,
): Promise<getWorkspaceAnalyticsResponseType> => {
  const res = await api.get(`/workspace/analytics/${id}`);
  return res.data;
};

export const updateWorkspace = async (
  id: string,
  data: { name: string; description?: string },
): Promise<updateWorkspaceResponseType> => {
  const res = await api.put(`/workspace/update/${id}`, data);
  return res.data;
};

export const deleteWorkspace = async (
  id: string,
): Promise<deleteWorkspaceResponseType> => {
  const res = await api.delete(`/workspace/delete/${id}`);
  return res.data;
};

export const changeWorkspaceMemberRole = async (
  workspaceId: string,
  data: {
    memberId: string;
    roleId: string;
  },
): Promise<changeMemberRoleResponseType> => {
  const res = await api.put(
    `/workspace/change/member/role/${workspaceId}`,
    data,
  );
  return res.data;
};


export const createProject = async (
  workspaceId: string,
  data: {
    name: string;
    description?: string;
    image?: string;
  },
): Promise<createProjectResponseType> => {
  const res = await api.post(`/project/workspace/${workspaceId}/create`, data);
  return res.data;
};

export const getProjectsInWorkspace = async (
  workspaceId: string,
  params?: {
    pageNumber?: number;
    pageSize?: number;
  },
): Promise<getProjectsInWorkspaceResponseType> => {
  const res = await api.get(`/project/workspace/${workspaceId}/all`, {
    params,
  });
  return res.data;
};

export const getProjectById = async (
  workspaceId: string,
  projectId: string,
): Promise<getProjectByIdResponseType> => {
  const res = await api.get(
    `/project/${projectId}/workspace/${workspaceId}`,
  );
  return res.data;
};

export const getProjectAnalytics = async (
  workspaceId: string,
  projectId: string,
): Promise<getProjectAnalyticsResponseType> => {
  const res = await api.get(
    `/project/${projectId}/workspace/${workspaceId}/analytics`,
  );
  return res.data;
};

export const updateProject = async (
  workspaceId: string,
  projectId: string,
  data: {
    name: string;
    description?: string;
    image?: string;
  },
): Promise<updateProjectResponseType> => {
  const res = await api.put(
    `/project/${projectId}/workspace/${workspaceId}/update`,
    data,
  );
  return res.data;
};

export const deleteProject = async (
  workspaceId: string,
  projectId: string,
): Promise<deleteProjectResponseType> => {
  const res = await api.delete(
    `/project/${projectId}/workspace/${workspaceId}/delete`,
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
    `/task/project/${projectId}/workspace/${workspaceId}/create`,
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
  const res = await api.put(
    `/task/${taskId}/project/${projectId}/workspace/${workspaceId}/update`,
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
  const res = await api.get(`/task/workspace/${workspaceId}/all/`, {
    params,
  });
  return res.data;
};

export const getTaskById = async (
  workspaceId: string,
  projectId: string,
  taskId: string,
): Promise<getTaskByIdResponseType> => {
  const res = await api.get(
    `/task/${taskId}/project/${projectId}/workspace/${workspaceId}`,
  );
  return res.data;
};

export const deleteTask = async (
  workspaceId: string,
  taskId: string,
): Promise<deleteTaskResponseType> => {
  const res = await api.delete(`/task/${taskId}/workspace/${workspaceId}`);
  return res.data;
};


export const joinWorkspace = async (
  inviteCode: string,
): Promise<joinWorkspaceResponseType> => {
  const res = await api.post(`/member/workspace/${inviteCode}/join`);
  return res.data;
};
