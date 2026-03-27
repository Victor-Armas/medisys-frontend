// Tipos locales compartidos entre los sub-componentes del modal

export type ModalStep = 0 | 1 | 2;

export const STEP_LABELS_STAFF = ["Rol", "Cuenta"] as const;
export const STEP_LABELS_DOCTOR = ["Rol", "Cuenta", "Perfil médico"] as const;
