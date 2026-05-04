import {
  PrismaClient,
  ProjectRole,
  ProjectPermission,
} from "../generated/prisma";

export async function roleSeeder(prisma: PrismaClient) {
  const roles = [
    {
      name: ProjectRole.OWNER,
      permissions: [
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
    },
    {
      name: ProjectRole.ADMIN,
      permissions: [
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
    },
    {
      name: ProjectRole.MEMBER,
      permissions: [
        ProjectPermission.VIEW_ONLY,
        ProjectPermission.CREATE_TASK,
        ProjectPermission.EDIT_TASK,
      ],
    },
  ];

  for (const role of roles) {
    const existing = await prisma.role.findUnique({
      where: { name: role.name },
    });
    if (!existing) {
      await prisma.role.create({ data: role });
    }
  }
}
