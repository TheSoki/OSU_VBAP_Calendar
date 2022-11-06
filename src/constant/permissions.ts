export const PERMISSIONS = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type PERMISSIONS_TYPE = typeof PERMISSIONS[keyof typeof PERMISSIONS];
