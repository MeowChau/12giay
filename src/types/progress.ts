import type { Role } from './narrative'

export type RoleFlags = Record<Role, boolean>
export type Progress = { completedRoles: RoleFlags; quizPassedRoles: RoleFlags }
export type ProgressStorage = { getItem: (key: string) => string | null; setItem: (key: string, value: string) => void }
export type StorageAccess = () => ProgressStorage | null
