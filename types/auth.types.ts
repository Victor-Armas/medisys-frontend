import { User } from "./users.types";

export type AuthUser = Pick<
  User,
  "id" | "firstName" | "lastNamePaternal" | "email" | "role"
>;

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}
