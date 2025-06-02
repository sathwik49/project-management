// import { ProjectPermission, ProjectRole, RolePermissions } from "./enums";
// import { UnAuthorizedError } from "./error";

// export const roleGuard = (
//     role:keyof typeof ProjectRole,
//     requiredPermissions:ProjectPermission[]
// ) => {
//     const permissions = RolePermissions[role]

//     const hasPermission = requiredPermissions.every((permission) => (
//         permissions.includes(permission)
//     ))

//     if(!hasPermission){
//         throw new UnAuthorizedError("You dont have necessary permissions to perform this task")
//     }
// }