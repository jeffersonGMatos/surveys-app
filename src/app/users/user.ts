export enum UserRoles {
  adm = "adm",
  agt = "agt"
};

export const userRolesDescription = {
  "adm": "Administrador",
  "agt": "Agente"
}

export interface User {
  userId: string | null
  name: string
  username: string
  profile: UserRoles
  isActive?: string
  password?: string
}