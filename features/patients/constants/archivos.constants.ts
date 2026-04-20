import { MedicalFileCategory } from "../types/patient.types";
import { MEDICAL_FILE_CATEGORY_LABELS } from "./patient.constants";

export const CATEGORIES = Object.keys(MEDICAL_FILE_CATEGORY_LABELS) as MedicalFileCategory[];
export const MAX_FILE_SIZE_MB = 10;
export const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"];

export interface UploadState {
  file: File | null;
  category: MedicalFileCategory;
  description: string;
  error: string | null;
}

export const INITIAL_UPLOAD: UploadState = {
  file: null,
  category: "LAB_RESULTS",
  description: "",
  error: null,
};
