import { $Enums } from "../generated/prisma";
import { ProjectPermission, ProjectRole, RolePermissions } from "./enums";
import { UnAuthorizedError } from "./error";

export const roleGuard = (
  role: $Enums.ProjectRole,
  requiredPermissions: ProjectPermission[]
): void => {
  const permissions = RolePermissions[role];

  if (!permissions) {
    throw new UnAuthorizedError(`Invalid role: ${role}`);
  }

  const hasAllPermissions = requiredPermissions.every((permission) =>
    permissions.includes(permission)
  );

  if (!hasAllPermissions) {
    throw new UnAuthorizedError(
      "You do not have the necessary permissions to perform this task"
    );
  }
};
