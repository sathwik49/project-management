export type ApiResponseType<ErrorT, DetailsT> = {
  message: string;
  success: boolean;
  error?: ErrorT;
  details?: DetailsT;
};

export type signUpResponseType = ApiResponseType<unknown, unknown>;

export type signInResponseType = ApiResponseType<unknown, unknown>;

export type currentUserType = {
  currentWorkspace: {
    name: string;
    id: string;
    description: string | null;
    inviteCode: string;
    ownerId: string;
  } | null;
} & {
  name: string;
  email: string;
  profilePicture: string | null;
  currentWorkspaceId: string | null;
};

export type getCurrentUserResponseType = ApiResponseType<
  unknown,
  currentUserType
>;

export type Workspace = {
  name: string;
  id: string;
  description: string | null;
  inviteCode: string;
  ownerId: string;
};

export type userWorkspacesType = Array<Workspace>;

export type getAllUserWorkspacesResponseType = ApiResponseType<
  unknown,
  userWorkspacesType
>;

export type WorkspaceMemberUser = {
  id: string;
  name: string | null;
  email: string;
  currentWorkspaceId: string | null;
  profilePicture: string | null;
};

export type WorkspaceMemberRole = {
  name: string;
  permissions: string[];
};

export type WorkspaceMember = {
  user: WorkspaceMemberUser;
  role: WorkspaceMemberRole;
};

export type WorkspaceWithMembers = {
  workspace: Workspace;
  members: WorkspaceMember[];
};

export type WorkspaceAnalytics = {
  totalTasks: number;
  overdueTasks: number;
  completedTasks: number;
};

export type getWorkspaceByIdResponseType = ApiResponseType<
  unknown,
  WorkspaceWithMembers
>;

export type getWorkspaceMembersResponseType = ApiResponseType<
  unknown,
  WorkspaceMember[]
>;

export type getWorkspaceAnalyticsResponseType = ApiResponseType<
  unknown,
  WorkspaceAnalytics
>;

export type createWorkspaceResponseType = ApiResponseType<unknown, Workspace>;

export type updateWorkspaceResponseType = ApiResponseType<unknown, Workspace>;

export type deleteWorkspaceResponseType = ApiResponseType<
  unknown,
  { currentWorkspaceId: string | null }
>;

export type changeMemberRoleResponseType = ApiResponseType<
  unknown,
  WorkspaceMember
>;

export type Project = {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
};

export type ProjectCreator = {
  id: string;
  name: string | null;
  profilePicture: string | null;
};

export type ProjectWithCreator = Project & {
  createdBy: ProjectCreator;
};

export type getProjectsInWorkspaceResponseType = ApiResponseType<
  unknown,
  ProjectWithCreator[]
> & {
  pagination?: {
    totalCount: number;
    totalPages: number;
    pageSize: number;
    pageNumber: number;
  };
};

export type createProjectResponseType = ApiResponseType<unknown, Project>;

export type getProjectByIdResponseType = ApiResponseType<unknown, Project>;

export type getProjectAnalyticsResponseType = ApiResponseType<
  unknown,
  WorkspaceAnalytics
>;

export type updateProjectResponseType = ApiResponseType<unknown, Project>;

export type deleteProjectResponseType = ApiResponseType<unknown, null>;

export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "IN_REVIEW"
  | "DONE"
  | "BACKLOG";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type TaskAssignee = {
  id: string;
  name: string | null;
  profilePicture: string | null;
};

export type TaskBase = {
  id: string;
  title: string;
  description: string | null;
  taskCode: string;
  dueDate: string;
  projectId: string;
  workspaceId: string;
  assignedToId: string;
  createdById: string;
  status: TaskStatus;
  priority: TaskPriority;
  createdAt: Date;
  updatedAt: Date;
};

export type TaskCreator = {
  id: string;
  name: string | null;
  profilePicture: string | null;
};

export type TaskWithDetails = TaskBase & {
  assignedTo: TaskAssignee | null;
  createdBy: TaskCreator;
};

export type TaskListDetails = {
  tasks: TaskWithDetails[];
  pagination: {
    pageSize: number;
    pageNumber: number;
    totalCount: number;
    totalPages: number;
    skip: number;
  };
};

export type createTaskResponseType = ApiResponseType<unknown, TaskBase>;

export type updateTaskResponseType = ApiResponseType<unknown, TaskBase>;

export type getTasksInWorkspaceResponseType = ApiResponseType<
  unknown,
  TaskListDetails
>;

export type getTaskByIdResponseType = ApiResponseType<unknown, TaskWithDetails>;

export type deleteTaskResponseType = ApiResponseType<unknown, null>;

export type joinWorkspaceResponseType = ApiResponseType<unknown, unknown>;
