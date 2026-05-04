import bcrypt from "bcrypt";
import { PrismaClient, ProjectRole } from "../generated/prisma";

export async function generateUniqueInviteCode(prisma: PrismaClient) {
  const chars = "abcdefghijklmnopqrstuvwxyz123456789";

  while (true) {
    let code = "";
    for (let i = 0; i < 7; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }

    const exists = await prisma.workspace.findFirst({
      where: { inviteCode: code },
    });

    if (!exists) return code;
  }
}

export async function adminSeeder(prisma: PrismaClient) {
  const hashedPassword = await bcrypt.hash("123456", 10);

  const users = [
    { email: "admin@promansys.abc", name: "Admin" },
    { email: "u1@promansys.abc", name: "User 1" },
    { email: "u2@promansys.abc", name: "User 2" },
    { email: "u3@promansys.abc", name: "User 3" },
    { email: "u4@promansys.abc", name: "User 4" },
    { email: "u5@promansys.abc", name: "User 5" },
  ];

  for (const u of users) {
    const createdUser = await prisma.user.create({
      data: { name: u.name, email: u.email, lastLogin: new Date() },
    });

    await prisma.account.create({
      data: {
        provider: "EMAIL",
        providerId: u.email,
        emailVerified: true,
        password: hashedPassword,
        userId: createdUser.id,
      },
    });

    const workspace = await prisma.workspace.create({
      data: {
        name: "My Workspace",
        description: "Default Workspace",
        inviteCode: await generateUniqueInviteCode(prisma),
        ownerId: createdUser.id,
      },
    });

    const role = await prisma.role.findFirst({
      where: { name: ProjectRole.OWNER },
    });

    if (!role) throw new Error("OWNER role not found — run roleSeeder first");

    await prisma.member.create({
      data: {
        userId: createdUser.id,
        workspaceId: workspace.id,
        roleId: role.name,
      },
    });

    await prisma.user.update({
      where: { id: createdUser.id },
      data: { currentWorkspaceId: workspace.id },
    });

    console.log(`Created user: ${u.email}`);
  }
}
