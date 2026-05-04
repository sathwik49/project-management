export const QUERY_KEYS = {
  USER: {
    CURRENT: ["current-user"],
  },

  WORKSPACE: {
    ALL: ["workspaces"],
    DETAIL: (id: string) => ["workspace", id],
    MEMBERS: (id: string) => ["workspace-members", id],
    ANALYTICS: (id: string) => ["workspace-analytics", id],
  },

  PROJECT: {
    ALL: (workspaceId: string) => ["projects", workspaceId],
    DETAIL: (workspaceId: string, projectId: string) => [
      "project",
      workspaceId,
      projectId,
    ],
    ANALYTICS: (workspaceId: string, projectId: string) => [
      "project-analytics",
      workspaceId,
      projectId,
    ],
  },

  TASK: {
    ALL: (workspaceId: string, filters?: any) => [
      "tasks",
      workspaceId,
      filters,
    ],
    DETAIL: (workspaceId: string, projectId: string, taskId: string) => [
      "task",
      workspaceId,
      projectId,
      taskId,
    ],
  },
};

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    VERIFY_EMAIL: (token: string) => `/auth/verify-email/${token}`,
    GOOGLE: "/auth/google",
  },

  USER: {
    CURRENT: "/user/me",
  },

  WORKSPACE: {
    CREATE: "/workspace",
    ALL: "/workspace",
    GET_BY_ID: (id: string) => `/workspace/${id}`,
    MEMBERS: (id: string) => `/workspace/${id}/members`,
    ANALYTICS: (id: string) => `/workspace/${id}/analytics`,
    UPDATE: (id: string) => `/workspace/${id}`,
    DELETE: (id: string) => `/workspace/${id}`,
    SWITCH: "/workspace/switch",
    CHANGE_ROLE: (id: string) => `/workspace/${id}/member-role`,
  },

  MEMBER: {
    JOIN: (inviteCode: string) => `/member/join/${inviteCode}`,
  },

  PROJECT: {
    CREATE: (workspaceId: string) =>
      `/project/workspace/${workspaceId}/projects`,
    ALL: (workspaceId: string) => `/project/workspace/${workspaceId}/projects`,
    GET: (workspaceId: string, projectId: string) =>
      `/project/workspace/${workspaceId}/projects/${projectId}`,
    ANALYTICS: (workspaceId: string, projectId: string) =>
      `/project/workspace/${workspaceId}/projects/${projectId}/analytics`,
    UPDATE: (workspaceId: string, projectId: string) =>
      `/project/workspace/${workspaceId}/projects/${projectId}`,
    DELETE: (workspaceId: string, projectId: string) =>
      `/project/workspace/${workspaceId}/projects/${projectId}`,
  },

  TASK: {
    CREATE: (workspaceId: string, projectId: string) =>
      `/task/workspace/${workspaceId}/projects/${projectId}/tasks`,
    ALL: (workspaceId: string) => `/task/workspace/${workspaceId}/tasks`,
    GET: (workspaceId: string, projectId: string, taskId: string) =>
      `/task/workspace/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
    UPDATE: (workspaceId: string, projectId: string, taskId: string) =>
      `/task/workspace/${workspaceId}/projects/${projectId}/tasks/${taskId}`,
    DELETE: (workspaceId: string, taskId: string) =>
      `/task/workspace/${workspaceId}/tasks/${taskId}`,
  },
};
