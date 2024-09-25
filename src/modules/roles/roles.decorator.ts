import { SetMetadata } from '@nestjs/common';
import { Role } from './roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => {
  const defaultRoles = [Role.ADMIN]; // Set ADMIN as the default role
  const mergedRoles = [...defaultRoles, ...roles]; // Merge default roles with provided roles
  return SetMetadata(ROLES_KEY, mergedRoles);
};
