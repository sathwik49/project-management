import { $Enums } from "../generated/prisma";
import { ProjectPermission, RolePermissions } from "./enums";
import { ForbiddenError } from "./error";

export const roleGuard = (
  role: $Enums.ProjectRole,
  requiredPermissions: ProjectPermission[],
): void => {
  const permissions = RolePermissions[role as keyof typeof RolePermissions];

  if (!permissions) {
    throw new ForbiddenError("Invalid role");
  }

  const hasAllPermissions = requiredPermissions.every((permission) =>
    permissions.includes(permission),
  );

  if (!hasAllPermissions) {
    throw new ForbiddenError("Permission denied");
  }
};
