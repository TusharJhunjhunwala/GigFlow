import type { UserRole } from "../models/User";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
