import api from "@/shared/lib/api";

import { LoginFormData } from "@/features/auth/validations/auth.validations";
import { LoginResponse } from "../types/auth.types";

export const authService = {
  login: async (data: LoginFormData): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", data);
    return response.data;
  },
};
