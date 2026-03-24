import api from "@/lib/api";
import { LoginResponse } from "@/types/auth.types";
import { LoginFormData } from "@/validations/auth.validations";

export const authService = {
  login: async (data: LoginFormData): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  },
};
