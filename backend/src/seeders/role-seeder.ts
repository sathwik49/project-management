import { PrismaClient,ProjectRole,ProjectPermission } from "../generated/prisma";

const prisma = new PrismaClient();

async function roleSeeder() {
  await prisma.$transaction([
    prisma.role.upsert({
      where: { name: ProjectRole.OWNER },
      update: {},
      create: {
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
    }),
    prisma.role.upsert({
      where: { name: ProjectRole.ADMIN },
      update: {},
      create: {
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
    }),
    prisma.role.upsert({
      where: { name: ProjectRole.MEMBER },
      update: {},
      create: {
        name: ProjectRole.MEMBER,
        permissions: [
          ProjectPermission.VIEW_ONLY,
          ProjectPermission.CREATE_TASK,
          ProjectPermission.EDIT_TASK,
        ],
      },
    }),
  ]);
}

roleSeeder()
  .then(() => {
    console.log('Roles seeded successfully.');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error('Seeding failed:', e);
    return prisma.$disconnect();
  });
