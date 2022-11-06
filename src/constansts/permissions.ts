export const PERMISSIONS = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type PERMISSIONSTYPE = typeof PERMISSIONS[keyof typeof PERMISSIONS];
