export enum ProjectPermission {
  CREATE_WORKSPACE = "CREATE_WORKSPACE",
  DELETE_WORKSPACE = "DELETE_WORKSPACE",
  EDIT_WORKSPACE = "EDIT_WORKSPACE",
  MANAGE_WORKSPACE_SETTINGS = "MANAGE_WORKSPACE_SETTINGS",

  ADD_MEMBER = "ADD_MEMBER",
  CHANGE_MEMBER_ROLE = "CHANGE_MEMBER_ROLE",
  REMOVE_MEMBER = "REMOVE_MEMBER",

  CREATE_PROJECT = "CREATE_PROJECT",
  EDIT_PROJECT = "EDIT_PROJECT",
  DELETE_PROJECT = "DELETE_PROJECT",

  CREATE_TASK = "CREATE_TASK",
  EDIT_TASK = "EDIT_TASK",
  DELETE_TASK = "DELETE_TASK",

  VIEW_ONLY = "VIEW_ONLY",
}

export enum ProjectRole {
  OWNER = "OWNER",
  ADMIN = "ADMIN",
  MEMBER = "MEMBER",
}

export const RolePermissions = {
  OWNER: [
    ProjectPermission.CREATE_WORKSPACE,
    ProjectPermission.DELETE_WORKSPACE,
    ProjectPermission.EDIT_WORKSPACE,
    ProjectPermission.MANAGE_WORKSPACE_SETTINGS,

    ProjectPermission.ADD_MEMBER,
    ProjectPermission.CHANGE_MEMBER_ROLE,
    ProjectPermission.REMOVE_MEMBER,

    ProjectPermission.CREATE_PROJECT,
    ProjectPermission.EDIT_PROJECT,
    ProjectPermission.DELETE_PROJECT,

    ProjectPermission.CREATE_TASK,
    ProjectPermission.EDIT_TASK,
    ProjectPermission.DELETE_TASK,
  ],
  ADMIN: [
    ProjectPermission.EDIT_WORKSPACE,
    ProjectPermission.MANAGE_WORKSPACE_SETTINGS,

    ProjectPermission.ADD_MEMBER,
    ProjectPermission.CHANGE_MEMBER_ROLE,

    ProjectPermission.CREATE_PROJECT,
    ProjectPermission.EDIT_PROJECT,

    ProjectPermission.CREATE_TASK,
    ProjectPermission.EDIT_TASK,
    ProjectPermission.DELETE_TASK,
  ],
  MEMBER: [
    ProjectPermission.VIEW_ONLY,
    ProjectPermission.CREATE_TASK,
    ProjectPermission.EDIT_TASK,
  ],
};
