import { User } from "@/features/users/types";

export type AuthUser = Pick<User, "id" | "firstName" | "lastNamePaternal" | "email" | "role"> & {
  mustChangePassword: boolean;
};

export interface LoginResponse {
  access_token: string;
  user: AuthUser;
}
