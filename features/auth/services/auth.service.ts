import api from "@/shared/lib/api";
import { LoginResponse } from "@/types/auth.types";
import { LoginFormData } from "@/features/auth/validations/auth.validations";

export const authService = {
  login: async (data: LoginFormData): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  },
};
